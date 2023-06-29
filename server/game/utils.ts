import { DENSITY } from "./../sharedConstants/density";
import { Position } from "../types/BaseTypes";
import { MySocket } from "../types/MySocketType";
import { game } from "./game";

/**
 * Validates the client
 * @param client The client asking for permission
 * @returns True if the client is allowed
 */
export const isValidClient = (client: MySocket) => {
  if (!game.rooms[client.id]) {
    return false;
  }
  return true;
};

/**
 * Searches and then removes an item from the array
 * @param arr Source array
 * @param value Value to be removed
 * @returns The clean array
 */
export const removeItem = <T>(arr: Array<T>, value: T): Array<T> => {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};
