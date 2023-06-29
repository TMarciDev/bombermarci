import { api } from "./api";

import { getSocket } from "./_socket_utils/connectSocket";
import { ClientEvents } from "./_socket_utils/clientEvents";
import { ControlEnum } from "../../features/_shared_constants/controlInpoutTypes";

export const controlApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendActionPressed: builder.mutation<void, number>({
      queryFn: (action) => {
        const socket = getSocket();
        return new Promise(() => {
          //if (action === ControlEnum.STAY) return;
          socket.emit(ClientEvents.actionPressed, action);
        });
      },
    }),
    sendActionReleased: builder.mutation<void, number>({
      queryFn: (action) => {
        const socket = getSocket();
        return new Promise(() => {
          if (action === ControlEnum.STAY) return;
          socket.emit(ClientEvents.actionReleased, action);
        });
      },
    }),
  }),
});

export const { useSendActionPressedMutation, useSendActionReleasedMutation } =
  controlApi;
