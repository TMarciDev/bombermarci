"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.isValidClient = void 0;
const game_1 = require("./game");
/**
 * Validates the client
 * @param client The client asking for permission
 * @returns True if the client is allowed
 */
const isValidClient = (client) => {
    if (!game_1.game.rooms[client.id]) {
        return false;
    }
    return true;
};
exports.isValidClient = isValidClient;
/**
 * Searches and then removes an item from the array
 * @param arr Source array
 * @param value Value to be removed
 * @returns The clean array
 */
const removeItem = (arr, value) => {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
};
exports.removeItem = removeItem;
