import { api } from "./api";

import { getSocket } from "./_socket_utils/connectSocket";
import { ServerEvents } from "./_socket_utils/serverEvents";

import { RespWrapper } from "../../types/QueryResponseType";
import { PlayerInfo } from "@backend/types/ClientSliceTypes";

export const statsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<RespWrapper<PlayerInfo[]>, void>({
      queryFn: () => ({ data: {} as RespWrapper<PlayerInfo[]> }),
      async onCacheEntryAdded(_, { updateCachedData, cacheEntryRemoved }) {
        const socket = getSocket();
        try {
          socket.on(
            ServerEvents.allPlayerStats,
            (playersStats: RespWrapper<PlayerInfo[]>) => {
              updateCachedData(() => {
                return playersStats;
              });
            }
          );
          await cacheEntryRemoved;
          socket.close();
          socket.off(ServerEvents.allPlayerStats);
        } catch {}
      },
    }),
  }),
});

export const { useGetStatsQuery } = statsApi;
