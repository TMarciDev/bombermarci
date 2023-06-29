import { api } from "./api";

import { getSocket } from "./_socket_utils/connectSocket";
import { ServerEvents } from "./_socket_utils/serverEvents";

import { RespWrapper } from "../../types/QueryResponseType";
import { PowerUp } from "@backend/types/ClientSliceTypes";

export const powerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPowers: builder.query<RespWrapper<PowerUp[]>, void>({
      queryFn: () => ({ data: {} as RespWrapper<PowerUp[]> }),
      async onCacheEntryAdded(_, { updateCachedData, cacheEntryRemoved }) {
        const socket = getSocket();
        try {
          socket.on(
            ServerEvents.allPowerUps,
            (powerUps: RespWrapper<PowerUp[]>) => {
              updateCachedData(() => {
                return powerUps;
              });
            }
          );
          socket.on(
            ServerEvents.addPowerUps,
            (powerUps: RespWrapper<PowerUp[]>) => {
              updateCachedData((draft) => {
                if (!("result" in draft)) return powerUps;
                draft.result.push(...powerUps.result);
              });
            }
          );
          socket.on(
            ServerEvents.removePowerUps,
            (powerUps: RespWrapper<PowerUp[]>) => {
              updateCachedData((draft) => {
                return {
                  result: draft.result.filter((fromDraft) => {
                    return !powerUps.result.find((fromToRemove) => {
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
          socket.off(ServerEvents.allPowerUps);
          socket.off(ServerEvents.addPowerUps);
          socket.off(ServerEvents.removePowerUps);
        } catch {}
      },
    }),
  }),
});

export const { useGetPowersQuery } = powerApi;
