import { Socket } from "socket.io-client";
import * as io from "socket.io-client";

let socket: Socket;
/**
 * It creates a socket connection of there is no connection yet
 * @returns The connected socket
 */
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io.connect(process.env.REACT_APP_SOCKET_URL as string);
  }
  return socket;
};
