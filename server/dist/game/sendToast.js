"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInfo = exports.sendError = void 0;
const serverEvents_1 = require("../socketEvents/serverEvents");
/**
 * Sends error to the client
 * @param client The connected socket
 * @param message The message to be sent
 */
const sendError = (client, message) => {
    client.emit(serverEvents_1.ServerEvents.sendError, message);
};
exports.sendError = sendError;
/**
 * Sends info to the client
 * @param client The connected socket
 * @param message The message to be sent
 */
const sendInfo = (client, message) => {
    client.emit(serverEvents_1.ServerEvents.sendInfo, message);
};
exports.sendInfo = sendInfo;
