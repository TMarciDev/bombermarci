import { ServerEvents } from "../socketEvents/serverEvents";
import { MySocket } from "../types/MySocketType";

/**
 * Sends error to the client
 * @param client The connected socket
 * @param message The message to be sent
 */
export const sendError = (client: MySocket, message: string) => {
  client.emit(ServerEvents.sendError, message);
};

/**
 * Sends info to the client
 * @param client The connected socket
 * @param message The message to be sent
 */
export const sendInfo = (client: MySocket, message: string) => {
  client.emit(ServerEvents.sendInfo, message);
};
