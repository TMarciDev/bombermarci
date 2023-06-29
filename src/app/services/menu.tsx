import { api } from "./api";

import { getSocket } from "./_socket_utils/connectSocket";
import { ClientEvents } from "./_socket_utils/clientEvents";

import { SocketResponse } from "@backend/types/AcknowledgementType";
import { CreateRoomBody, JoinRoomBody } from "@backend/types/RoomBodyType";

export const menuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createRoom: builder.mutation<SocketResponse, CreateRoomBody>({
      queryFn: ({ name, test = false }) => {
        const socket = getSocket();
        return new Promise((resolve) => {
          socket.emit(
            ClientEvents.createRoom,
            { name: name, test: test },
            (response: SocketResponse) => {
              resolve({ data: response });
            }
          );
        });
      },
    }),
    joinRoom: builder.mutation<SocketResponse, JoinRoomBody>({
      queryFn: (args) => {
        const socket = getSocket();
        return new Promise((resolve) => {
          socket.emit(
            ClientEvents.joinRoom,
            args,
            (response: SocketResponse) => {
              resolve({ data: response });
            }
          );
        });
      },
    }),
  }),
});

export const { useCreateRoomMutation, useJoinRoomMutation } = menuApi;
