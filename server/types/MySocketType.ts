import { Socket } from "socket.io";

export interface MySocket extends Socket {
  number?: number;
}
