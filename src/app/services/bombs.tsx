import { api } from "./api";

import { getSocket } from "./_socket_utils/connectSocket";
import { ServerEvents } from "./_socket_utils/serverEvents";

import { RespWrapper } from "../../types/QueryResponseType";
import { Bomb } from "@backend/types/ClientSliceTypes";

export const bombsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBombs: builder.query<RespWrapper<Bomb[]>, void>({
      queryFn: () => ({ data: {} as RespWrapper<Bomb[]> }),
      async onCacheEntryAdded(_, { updateCachedData, cacheEntryRemoved }) {
        const socket = getSocket();
        try {
          socket.on(ServerEvents.allBombs, (bombs: RespWrapper<Bomb[]>) => {
            updateCachedData(() => {
              return bombs;
            });
          });
          socket.on(ServerEvents.addBombs, (bombs: RespWrapper<Bomb[]>) => {
            updateCachedData((draft) => {
              if ("result" in draft) {
                return { result: [...draft.result, ...bombs.result] };
              } else {
                return bombs;
              }
            });
          });
          socket.on(
            ServerEvents.removeBombs,
            (toRemove: RespWrapper<Bomb[]>) => {
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
          socket.off(ServerEvents.allBombs);
          socket.off(ServerEvents.addBombs);
          socket.off(ServerEvents.removeBombs);
        } catch {}
      },
    }),
  }),
});

export const { useGetBombsQuery } = bombsApi;
