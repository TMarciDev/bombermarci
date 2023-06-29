import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//import { api } from '../api'

import { getSocket } from "./_socket_utils/connectSocket";
import { ServerEvents } from "./_socket_utils/serverEvents";

import { PlayerInfo, PrepInfos } from "@backend/types/ClientSliceTypes";
import { ClientEvents } from "./_socket_utils/clientEvents";

import { RespWrapper } from "../../types/QueryResponseType";
import { SocketResponse } from "@backend/types/AcknowledgementType";

//export const preparationApi = api.injectEndpoints({
export const preparationApi = createApi({
  reducerPath: "preparationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: (builder) => ({
    getPreparation: builder.query<RespWrapper<PrepInfos>, void>({
      keepUnusedDataFor: 10000000,
      queryFn: () => ({ data: {} as RespWrapper<PrepInfos> }),
      async onCacheEntryAdded(_, { updateCachedData, cacheEntryRemoved }) {
        const socket = getSocket();
        try {
          socket.on(
            ServerEvents.gamePrepInfo,
            (info: RespWrapper<PrepInfos>) => {
              updateCachedData(() => {
                return info;
              });
            }
          );
          socket.on(
            ServerEvents.addJoinedPlayer,
            (addedPlayer: RespWrapper<PlayerInfo>) => {
              updateCachedData((draft) => {
                if ("result" in draft && "playerInfos" in draft.result) {
                  draft.result.playerInfos.push(addedPlayer.result);
                }
              });
            }
          );
          socket.on(
            ServerEvents.updateJoinedPlayers,
            (updatedInfos: RespWrapper<PlayerInfo[]>) => {
              updateCachedData((draft) => {
                return {
                  result: {
                    ...draft.result,
                    playerInfos: [...updatedInfos.result],
                  },
                };
              });
            }
          );
          socket.on(
            ServerEvents.availableColors,
            (availableColors: RespWrapper<string[]>) => {
              updateCachedData((draft) => {
                return {
                  result: {
                    ...draft.result,
                    availableColors: [...availableColors.result],
                  },
                };
              });
            }
          );
          socket.on(
            ServerEvents.changeStage,
            (newStage: RespWrapper<string>) => {
              updateCachedData((draft) => {
                return { result: { ...draft.result, stage: newStage.result } };
              });
            }
          );
          await cacheEntryRemoved;
          socket.close();
          socket.off(ServerEvents.availableColors);
          socket.off(ServerEvents.gamePrepInfo);
          socket.off(ServerEvents.updateJoinedPlayers);
          socket.off(ServerEvents.addJoinedPlayer);
        } catch {}
      },
    }),
    sendLoaded: builder.mutation<SocketResponse, void>({
      queryFn: () => {
        const socket = getSocket();
        return new Promise((resolve) => {
          socket.emit(
            ClientEvents.pageLoaded,
            "preparation",
            (response: SocketResponse) => {
              resolve({ data: response });
            }
          );
        });
      },
    }),
    pickColor: builder.mutation<SocketResponse, string>({
      queryFn: (color) => {
        const socket = getSocket();
        return new Promise((resolve) => {
          socket.emit(
            ClientEvents.pickColor,
            color,
            (response: SocketResponse) => {
              resolve({ data: response });
            }
          );
        });
      },
    }),
    startGame: builder.mutation<SocketResponse, void>({
      queryFn: () => {
        const socket = getSocket();
        return new Promise((resolve) => {
          socket.emit(
            ClientEvents.startGameRoom,
            (response: SocketResponse) => {
              resolve({ data: response });
            }
          );
        });
      },
    }),
  }),
});

export const {
  useGetPreparationQuery,
  useSendLoadedMutation,
  usePickColorMutation,
  useStartGameMutation,
} = preparationApi;
