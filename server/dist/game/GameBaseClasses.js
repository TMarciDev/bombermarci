"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerGameObject = exports.GameObject = exports.GameHandler = void 0;
class GameHandler {
    constructor(state) {
        this.state = state;
    }
}
exports.GameHandler = GameHandler;
class GameObject {
    constructor(state, rooms) {
        this.state = state;
        this.rooms = rooms;
    }
}
exports.GameObject = GameObject;
class ServerGameObject {
    constructor(roomName, time, gameStage, gameOver, mapInfo, maxPlayers, availableColors, freePlayerNumbers, gameLoadedClients, syncedAllTime, players, walls, bombs, explosionFields, powerUps, connectedClientIds, tutorial, tutorialSteps) {
        this.roomName = roomName;
        this.time = time;
        this.gameStage = gameStage;
        this.gameOver = gameOver;
        this.mapInfo = mapInfo;
        this.maxPlayers = maxPlayers;
        this.availableColors = availableColors;
        this.freePlayerNumbers = freePlayerNumbers;
        this.gameLoadedClients = gameLoadedClients;
        this.syncedAllTime = syncedAllTime;
        this.players = players;
        this.walls = walls;
        this.bombs = bombs;
        this.explosionFields = explosionFields;
        this.powerUps = powerUps;
        this.connectedClientIds = connectedClientIds;
        this.tutorial = tutorial;
        this.tutorialSteps = tutorialSteps;
    }
}
exports.ServerGameObject = ServerGameObject;
