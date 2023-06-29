"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEvents = void 0;
var ClientEvents;
(function (ClientEvents) {
    //* Menu
    ClientEvents["createRoom"] = "createRoom";
    ClientEvents["joinRoom"] = "joinRoom";
    ClientEvents["pickColor"] = "pickColor";
    ClientEvents["pageLoaded"] = "pageLoaded";
    //* Preparation
    ClientEvents["startGameRoom"] = "startGameRoom";
    // this two stays for the in game mode
    ClientEvents["leaveRoom"] = "leaveRoom";
    ClientEvents["sendMessage"] = "sendMessage";
    //* In game
    ClientEvents["actionPressed"] = "actionPressed";
    ClientEvents["actionReleased"] = "actionReleased";
})(ClientEvents = exports.ClientEvents || (exports.ClientEvents = {}));
