import { api } from "./api";

import { getSocket } from "./_socket_utils/connectSocket";
import { ServerEvents } from "./_socket_utils/serverEvents";

import { RespWrapper } from "../../types/QueryResponseType";
import { StartInfos } from "@backend/types/ClientSliceTypes";
import { ClientEvents } from "./_socket_utils/clientEvents";
import { SocketResponse } from "@backend/types/AcknowledgementType";

export const gameApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGame: builder.query<RespWrapper<StartInfos>, void>({
      queryFn: () => ({ data: {} as RespWrapper<StartInfos> }),
      async onCacheEntryAdded(_, { updateCachedData, cacheEntryRemoved }) {
        const socket = getSocket();
        try {
          socket.on(
            ServerEvents.gameStartInfo,
            (info: RespWrapper<StartInfos>) => {
              updateCachedData(() => {
                return info;
              });
            }
          );
          await cacheEntryRemoved;
          socket.close();
          socket.off(ServerEvents.gameStartInfo);
        } catch {}
      },
    }),
    getGamOver: builder.query<RespWrapper<number>, void>({
      queryFn: () => ({ data: {} as RespWrapper<number> }),
      async onCacheEntryAdded(_, { updateCachedData, cacheEntryRemoved }) {
        const socket = getSocket();
        try {
          socket.on(ServerEvents.gameOver, (winner: RespWrapper<number>) => {
            updateCachedData(() => {
              return winner;
            });
          });
          await cacheEntryRemoved;
          socket.close();
          socket.off(ServerEvents.gameOver);
        } catch {}
      },
    }),
    sendLoaded: builder.mutation<SocketResponse, void>({
      queryFn: () => {
        const socket = getSocket();
        return new Promise((resolve) => {
          socket.emit(
            ClientEvents.pageLoaded,
            "game",
            (response: SocketResponse) => {
              resolve({ data: response });
            }
          );
        });
      },
    }),
  }),
});

export const { useGetGameQuery, useGetGamOverQuery, useSendLoadedMutation } =
  gameApi;
