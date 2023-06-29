import { api } from "./api";

import { getSocket } from "./_socket_utils/connectSocket";
import { ServerEvents } from "./_socket_utils/serverEvents";
import { toast } from "react-toastify";
export const errorDisplayApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listenToErrors: builder.query<string, void>({
      queryFn: () => ({ data: "" }),
      async onCacheEntryAdded(_, { updateCachedData, cacheEntryRemoved }) {
        const socket = getSocket();
        try {
          socket.on(ServerEvents.sendError, (error: string) => {
            updateCachedData(() => {
              toast.error(error);
              return error;
            });
          });
          socket.on(ServerEvents.sendInfo, (info: string) => {
            updateCachedData(() => {
              toast(info, { autoClose: 6000 });
              return info;
            });
          });
          socket.on("connect_error", (error: Error) => {
            console.error("Socket connection error:", error);
            updateCachedData(() => {
              toast.error("Socket connection error", { autoClose: 1000 });
              return "Socket connection error";
            });
          });
          await cacheEntryRemoved;
          socket.close();
          socket.off(ServerEvents.sendError);
          socket.off(ServerEvents.sendInfo);
          socket.off("connect_error");
        } catch {}
      },
    }),
  }),
});

export const { useListenToErrorsQuery } = errorDisplayApi;
