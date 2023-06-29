"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverEvents_1 = require("./socketEvents/serverEvents");
const clientEvents_1 = require("./socketEvents/clientEvents");
const game_1 = require("./game/game");
const sendToast_1 = require("./game/sendToast");
const cycle_1 = require("./game/cycle/cycle");
const utils_1 = require("./game/utils");
const tutorial_1 = require("./game/tutorial");
const server_1 = require("./server");
server_1.myServer.io.on("connection", (client) => {
    let gameCycle = null;
    (0, sendToast_1.sendInfo)(client, tutorial_1.tutorialSkeleton.menu.selectTutorial.text);
    let roomName = "";
    console.log(`User connected: ${client.id}`);
    client.on(clientEvents_1.ClientEvents.createRoom, (args, callback) => {
        callback({ status: "ok" });
        game_1.game.createRoom(client, args);
        roomName = game_1.game.rooms[client.id];
    });
    client.on(clientEvents_1.ClientEvents.joinRoom, (args, callback) => {
        let success = false;
        if (args.roomName in game_1.game.state) {
            if (game_1.game.state[args.roomName].gameStage === "preparation") {
                if (game_1.game.state[args.roomName].freePlayerNumbers.length > 0) {
                    callback({ status: "ok" });
                    game_1.game.joinRoom(client, args);
                    roomName = args.roomName;
                    success = true;
                }
                else {
                    (0, sendToast_1.sendError)(client, "ERROR: room is full!");
                }
            }
            else {
                (0, sendToast_1.sendError)(client, "ERROR: game already started!");
            }
        }
        else {
            (0, sendToast_1.sendError)(client, "ERROR: no such room!");
        }
        if (!success)
            callback({ status: "failed" });
    });
    client.on(clientEvents_1.ClientEvents.pickColor, (color) => {
        if (!(0, utils_1.isValidClient)(client))
            return;
        game_1.game.pickColor(client, color);
    });
    client.on(clientEvents_1.ClientEvents.startGameRoom, () => {
        if (!(0, utils_1.isValidClient)(client))
            return;
        game_1.game.startRoom(client);
    });
    client.on(clientEvents_1.ClientEvents.pageLoaded, (page, callback) => {
        if (!(0, utils_1.isValidClient)(client))
            return;
        if (page !== "game")
            return;
        const currentState = game_1.game.state[roomName];
        if (!currentState)
            return;
        const startInfo = {
            mapInfo: currentState.mapInfo,
            hardWalls: currentState.walls.hards,
        };
        const loadedClients = currentState.gameLoadedClients;
        if (!loadedClients.includes(client.id)) {
            loadedClients.push(client.id);
        }
        else {
            //sendError(client, "You are already connected.");
        }
        if (loadedClients.length + currentState.freePlayerNumbers.length >=
            currentState.maxPlayers) {
            server_1.myServer.io.sockets
                .in(roomName)
                .emit(serverEvents_1.ServerEvents.gameStartInfo, { result: startInfo });
            // * Az összes kliens sikeresen betöltötte a játékot
            gameCycle = new cycle_1.GameCycle(game_1.game.state[roomName]);
            gameCycle.start(client);
        }
        callback({ status: "ok" });
    });
    client.on(clientEvents_1.ClientEvents.actionPressed, (input) => {
        if (!(0, utils_1.isValidClient)(client))
            return;
        gameCycle === null || gameCycle === void 0 ? void 0 : gameCycle.input.new(input, "pressed", client);
    });
    client.on(clientEvents_1.ClientEvents.actionReleased, (input) => {
        if (!(0, utils_1.isValidClient)(client))
            return;
        gameCycle === null || gameCycle === void 0 ? void 0 : gameCycle.input.new(input, "released", client);
    });
});
