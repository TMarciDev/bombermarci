import { api } from "./api";

import { getSocket } from "./_socket_utils/connectSocket";
import { ServerEvents } from "./_socket_utils/serverEvents";

import { RespWrapper } from "../../types/QueryResponseType";
import { ExplosionFields } from "@backend/types/ClientSliceTypes";

export const explosionFieldsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExplosionFields: builder.query<RespWrapper<ExplosionFields>, void>({
      queryFn: () => ({ data: {} as RespWrapper<ExplosionFields> }),
      async onCacheEntryAdded(_, { updateCachedData, cacheEntryRemoved }) {
        const socket = getSocket();
        try {
          socket.on(
            ServerEvents.addExplosionFields,
            (explosionFields: RespWrapper<ExplosionFields>) => {
              updateCachedData((draft) => {
                if ("result" in draft) {
                  const time = explosionFields.result.time;
                  const aliveDrafts = draft.result.newExplosions.filter(
                    (e) => e.endTime > time
                  );

                  return {
                    result: {
                      time: time,
                      timeInfo: explosionFields.result.timeInfo - Date.now(),
                      newExplosions: [
                        ...aliveDrafts,
                        ...explosionFields.result.newExplosions,
                      ],
                    },
                  };
                } else {
                  return {
                    result: {
                      ...explosionFields.result,
                      timeInfo: explosionFields.result.timeInfo - Date.now(),
                    },
                  };
                }
              });
            }
          );
          await cacheEntryRemoved;
          socket.close();
          socket.off(ServerEvents.addExplosionFields);
        } catch {}
      },
    }),
  }),
});

export const { useGetExplosionFieldsQuery } = explosionFieldsApi;
