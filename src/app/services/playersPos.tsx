import { api } from "./api";

import { getSocket } from "./_socket_utils/connectSocket";
import { ServerEvents } from "./_socket_utils/serverEvents";

import { RespWrapperWithPrev } from "../../types/QueryResponseType";
import { PlayerPos } from "@backend/types/ClientSliceTypes";

export const playersPosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlayersPos: builder.query<RespWrapperWithPrev<PlayerPos[]>, void>({
      queryFn: () => ({ data: {} as RespWrapperWithPrev<PlayerPos[]> }),
      async onCacheEntryAdded(_, { updateCachedData, cacheEntryRemoved }) {
        const socket = getSocket();
        try {
          socket.on(
            ServerEvents.allPlayersPos,
            (playersPos: RespWrapperWithPrev<PlayerPos[]>) => {
              updateCachedData((draft) => {
                return { result: playersPos.result, prevResult: draft.result };
              });
            }
          );
          await cacheEntryRemoved;
          socket.close();
          socket.off(ServerEvents.allPlayersPos);
        } catch {}
      },
    }),
  }),
});

export const { useGetPlayersPosQuery } = playersPosApi;
