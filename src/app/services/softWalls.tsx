import { api } from "./api";

import { getSocket } from "./_socket_utils/connectSocket";
import { ServerEvents } from "./_socket_utils/serverEvents";

import { RespWrapper } from "../../types/QueryResponseType";
import { SoftWall } from "@backend/types/ClientSliceTypes";

export const softWallsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSoftWalls: builder.query<RespWrapper<SoftWall[]>, void>({
      queryFn: () => ({ data: {} as RespWrapper<SoftWall[]> }),
      async onCacheEntryAdded(_, { updateCachedData, cacheEntryRemoved }) {
        const socket = getSocket();
        try {
          socket.on(
            ServerEvents.allSoftWalls,
            (softWalls: RespWrapper<SoftWall[]>) => {
              updateCachedData(() => {
                return softWalls;
              });
            }
          );
          socket.on(
            ServerEvents.removeSoftWalls,
            (toRemove: RespWrapper<SoftWall[]>) => {
              updateCachedData((draft) => {
                return {
                  result: draft.result.filter((fromDraft) => {
                    return !toRemove.result.find((fromToRemove) => {
                      const draftPos = fromDraft.pos;
                      const removePos = fromToRemove.pos;
                      return (
                        draftPos.x === removePos.x && draftPos.y === removePos.y
                      );
                    });
                  }),
                };
              });
            }
          );
          await cacheEntryRemoved;
          socket.close();
          socket.off(ServerEvents.allSoftWalls);
          socket.off(ServerEvents.removeSoftWalls);
        } catch {}
      },
    }),
  }),
});

export const { useGetSoftWallsQuery } = softWallsApi;
