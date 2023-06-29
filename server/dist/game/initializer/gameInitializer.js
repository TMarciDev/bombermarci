"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInstance = void 0;
const constants_1 = require("../../sharedConstants/constants");
const mapGenerators_1 = require("./mapGenerators");
const playerPlaces_1 = require("./playerPlaces");
const density_1 = require("../../sharedConstants/density");
class GameInstance {
    constructor(time = 0, gameStage = "preparation", gameOver = false, mapInfo = { width: 15 * density_1.density, height: 15 * density_1.density }, maxPlayers = 4, freePlayerNumbers = [0, 1, 2, 3], gameLoadedClients = [], availableColors = [
        "blue",
        "brown",
        "green",
        "orange",
        "pink",
        "red",
        "teal",
        "white",
        "yellow",
    ], syncedAllTime = constants_1.RESYNC, players = {
        infos: [],
        positions: [],
        directions: [[], [], [], []],
        bombers: [false, false, false, false],
        infoChanged: false,
    }, walls = {
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
    }, connectedCLientIds = [], tutorial = false) {
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
        this.connectedCLientIds = connectedCLientIds;
        this.tutorial = tutorial;
        this.walls.hards = (0, mapGenerators_1.generateHardWalls)(this.mapInfo);
        this.walls.softs.all = (0, mapGenerators_1.generateSoftWalls)(this.mapInfo, [...this.walls.hards, ...playerPlaces_1.PLAYER_CREATE_PLACES, ...playerPlaces_1.PLAYER_SPAWN_AREA], {
            probability: 0.9,
        });
        this.powerUps.all.hidden = (0, mapGenerators_1.generatePowerUps)(this.mapInfo, this.walls.softs.all, {
            probability: 0.25,
        });
    }
}
exports.GameInstance = GameInstance;
// export const getDefaultGameState = (): ServerGameObject => {
//   const baseMapProperties = { width: 15 * density, height: 15 * density };
//   const hardWalls = generateHardWalls(baseMapProperties);
//   const softWallExcludes: CanvasObject[] = [
//     ...hardWalls,
//     ...PLAYER_CREATE_PLACES,
//     ...PLAYER_SPAWN_AREA,
//   ];
//   const softWalls = generateSoftWalls(baseMapProperties, softWallExcludes, {
//     probability: 0.9,
//   });
//   const powerUps = generatePowerUps(baseMapProperties, softWalls, {
//     probability: 0.25,
//   });
//   return {
//     time: 0,
//     gameStage: "preparation",
//     gameOver: false,
//     mapInfo: baseMapProperties,
//     maxPlayers: 4,
//     freePlayerNumbers: [0, 1, 2, 3],
//     gameLoadedClients: [],
//     availableColors: [
//       "blue",
//       "brown",
//       "green",
//       "orange",
//       "pink",
//       "red",
//       "teal",
//       "white",
//       "yellow",
//     ],
//     syncedAllTime: RESYNC,
//     players: {
//       infos: [],
//       positions: [],
//       directions: [[], [], [], []],
//       bombers: [false, false, false, false],
//       infoChanged: false,
//     },
//     walls: {
//       hards: hardWalls,
//       softs: {
//         all: softWalls,
//         toDelete: [],
//       },
//     },
//     bombs: {
//       all: [],
//       toCreate: [],
//       toDelete: [],
//     },
//     explosionFields: {
//       all: [],
//       toCreate: [],
//     },
//     powerUps: {
//       all: {
//         shown: [],
//         hidden: powerUps,
//       },
//       toCreate: [],
//       toDelete: [],
//     },
//     connectedCLientIds: [],
//     tutorial: false,
//   };
// };
