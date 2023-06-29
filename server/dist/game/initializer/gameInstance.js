"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInstance = void 0;
const constants_1 = require("../../sharedConstants/constants");
const playerPlaces_1 = require("./playerPlaces");
const density_1 = require("../../sharedConstants/density");
const player_1 = require("./player");
const controlInpoutTypes_1 = require("../../sharedConstants/controlInpoutTypes");
const clientEvents_1 = require("../../socketEvents/clientEvents");
const serverEvents_1 = require("../../socketEvents/serverEvents");
const server_1 = require("../../server");
const sendToast_1 = require("../sendToast");
const gameBaseClasses_1 = require("../gameBaseClasses");
class GameInstance extends gameBaseClasses_1.ServerGameObject {
    constructor(roomName, time = 0, gameStage = "preparation", gameOver = false, mapInfo = { width: 15 * density_1.DENSITY, height: 15 * density_1.DENSITY }, maxPlayers = 4, freePlayerNumbers = [0, 1, 2, 3], gameLoadedClients = [], availableColors = [
        "blue",
        "brown",
        "green",
        "orange",
        "pink",
        "red",
        "teal",
        "white",
        "yellow",
    ], syncedAllTime = constants_1.RESYNC, players = new player_1.Players(), walls = {
        hards: [],
        softs: {
            all: [],
            toDelete: [],
        },
    }, bombs = {
        all: [],
        toCreate: [],
        toDelete: [],
    }, explosionFields = {
        all: [],
        toCreate: [],
    }, powerUps = {
        all: {
            shown: [],
            hidden: [],
        },
        toCreate: [],
        toDelete: [],
    }, connectedClientIds = [], tutorial = false, tutorialSteps = {}) {
        super(roomName, time, gameStage, gameOver, mapInfo, maxPlayers, availableColors, freePlayerNumbers, gameLoadedClients, syncedAllTime, players, walls, bombs, explosionFields, powerUps, connectedClientIds, tutorial, tutorialSteps);
        this.roomName = roomName;
        this.time = time;
        this.gameStage = gameStage;
        this.gameOver = gameOver;
        this.mapInfo = mapInfo;
        this.maxPlayers = maxPlayers;
        this.freePlayerNumbers = freePlayerNumbers;
        this.gameLoadedClients = gameLoadedClients;
        this.availableColors = availableColors;
        this.syncedAllTime = syncedAllTime;
        this.players = players;
        this.walls = walls;
        this.bombs = bombs;
        this.explosionFields = explosionFields;
        this.powerUps = powerUps;
        this.connectedClientIds = connectedClientIds;
        this.tutorial = tutorial;
        this.tutorialSteps = tutorialSteps;
        /**
         * Initiates the joining to a room
         * @param client The connected socket
         * @param args The object containing room name etc
         */
        this.joinRoom = (client, args) => {
            client.join(this.roomName);
            this.connectedClientIds.push(client.id);
            const playerNumber = this.freePlayerNumbers.shift();
            client.number = playerNumber;
            const newPlayerInfo = new player_1.PlayerStats(playerNumber, args.name);
            this.players.infos.push(newPlayerInfo);
            this.players.positions.push(new player_1.PlayerPositions(playerNumber));
            if (args.test) {
                const testPlayerNumber = this.freePlayerNumbers.shift();
                this.availableColors = ["green", "pink", "teal"];
                this.players.infos.push(new player_1.PlayerStats(testPlayerNumber, "Bomber Dummy", "yellow"));
                this.players.positions.push(new player_1.PlayerPositions(testPlayerNumber));
                this.gameLoadedClients.push("dummy");
                this.players.infos[0].health = 5;
                this.players.infos[1].health = 1;
                this.tutorial = true;
                this.players.directions[1] = [controlInpoutTypes_1.ControlEnum.LEFT];
                // this.players.positions[1] = {
                //   number: 1,
                //   pos: { x: 2 * DENSITY, y: 1 * DENSITY },
                // };
            }
            const clientPrepInfos = {
                isAdmin: playerNumber === 0,
                number: newPlayerInfo.number,
                roomName: this.roomName,
                stage: "preparation",
                playerInfos: this.players.infos,
                availableColors: this.availableColors,
                serverTimestamp: Date.now(),
            };
            client.on(clientEvents_1.ClientEvents.pageLoaded, (page) => {
                if (page === "preparation") {
                    //* Only current client gets it
                    client.emit(serverEvents_1.ServerEvents.gamePrepInfo, { result: clientPrepInfos });
                }
            });
            //* All room members except the current client gets it
            server_1.myServer.io.sockets
                .to(this.roomName)
                .emit(serverEvents_1.ServerEvents.addJoinedPlayer, { result: newPlayerInfo });
        };
        /**
         * Handles the color picking event
         * @param client The connected socket
         * @param color The color to be picked
         */
        this.pickColor = (client, color) => {
            var _a;
            const availableColors = this.availableColors;
            if (!availableColors.includes(color))
                return;
            this.availableColors = availableColors.filter((item) => item !== color);
            const prevColor = this.players.infos[client.number].color;
            this.availableColors.push(prevColor);
            this.players.infos[client.number].color = color;
            server_1.myServer.io.sockets.in(this.roomName).emit(serverEvents_1.ServerEvents.availableColors, {
                result: this.availableColors,
            });
            server_1.myServer.io.sockets
                .in(this.roomName)
                .emit(serverEvents_1.ServerEvents.updateJoinedPlayers, {
                result: this.players.infos,
            });
            if (this.tutorial) {
                (0, sendToast_1.sendInfo)(client, (_a = this === null || this === void 0 ? void 0 : this.tutorialSteps) === null || _a === void 0 ? void 0 : _a.preparation.startGame.text);
            }
        };
        /**
         * Initiates the room start if all the values are set correctly
         * @param client The connected socket
         */
        this.startRoom = (client) => {
            let allPicked = true;
            this.players.infos.forEach((p) => {
                if (p.color === "") {
                    allPicked = false;
                    return;
                }
            });
            if (!allPicked) {
                (0, sendToast_1.sendError)(client, "ERROR: someone didn't pick hero");
                return;
            }
            if (this.players.infos.length === 1 && !constants_1.ALONE_START) {
                (0, sendToast_1.sendError)(client, "ERROR: you can't start alone");
                return;
            }
            //* All room members recive it
            server_1.myServer.io.sockets
                .in(this.roomName)
                .emit(serverEvents_1.ServerEvents.changeStage, { result: "game" });
        };
        /**
         * A function wrapper to evaluate a function on every map block
         * @param coreFunc The function to run on every iteration
         */
        const iterateOnMap = (coreFunc) => {
            for (let y = 0; y < mapInfo.height; y += density_1.DENSITY) {
                for (let x = 0; x < mapInfo.width; x += density_1.DENSITY) {
                    coreFunc(x, y);
                }
            }
        };
        this.generateHardWalls = () => {
            let hardWalls = [];
            const addHardWall = (x, y) => {
                if (x === 0 ||
                    x === mapInfo.width - density_1.DENSITY ||
                    y === 0 ||
                    y === mapInfo.height - density_1.DENSITY ||
                    (x % (2 * density_1.DENSITY) === 0 && y % (2 * density_1.DENSITY) === 0)) {
                    hardWalls.push({ pos: { x: x, y: y } });
                }
            };
            iterateOnMap(addHardWall);
            return hardWalls;
        };
        this.generateSoftWalls = (exclude, options) => {
            let softWalls = [];
            const addSoftWall = (x, y) => {
                const softWallObj = { pos: { x: x, y: y } };
                if (Math.random() < options.probability &&
                    !exclude.find((e) => e.pos.x === softWallObj.pos.x && e.pos.y === softWallObj.pos.y)) {
                    softWalls.push(softWallObj);
                }
            };
            iterateOnMap(addSoftWall);
            return softWalls;
        };
        this.generatePowerUps = (places, options) => {
            const POWER_UP_TYPES = {
                add_bomb: 0,
                add_speed: 1,
                add_range: 2,
            };
            let powerUps = [];
            const keys = Object.keys(POWER_UP_TYPES);
            const addPowerUp = (x, y) => {
                const randomKey = keys[(keys.length * Math.random()) << 0];
                const powerUpObj = { pos: { x: x, y: y }, type: randomKey };
                if (Math.random() < options.probability &&
                    places.find((e) => e.pos.x === powerUpObj.pos.x && e.pos.y === powerUpObj.pos.y)) {
                    powerUps.push(powerUpObj);
                }
            };
            iterateOnMap(addPowerUp);
            return powerUps;
        };
        this.walls.hards = this.generateHardWalls();
        this.walls.softs.all = this.generateSoftWalls([...this.walls.hards, ...playerPlaces_1.PLAYER_CREATE_PLACES, ...playerPlaces_1.PLAYER_SPAWN_AREA], {
            probability: 0.9,
        });
        this.powerUps.all.hidden = this.generatePowerUps(this.walls.softs.all, {
            probability: 0.25,
        });
    }
}
exports.GameInstance = GameInstance;
