"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
const server_1 = require("../../server");
const constants_1 = require("../../sharedConstants/constants");
const serverEvents_1 = require("../../socketEvents/serverEvents");
const gameBaseClasses_1 = require("../gameBaseClasses");
const sendToast_1 = require("../sendToast");
class Emitter extends gameBaseClasses_1.GameHandler {
    constructor(state) {
        super(state);
        this.state = state;
        this.sync = () => {
            if (this.state.syncedAllTime < constants_1.RESYNC) {
                syncPartial();
            }
            else {
                syncAll();
                this.state.syncedAllTime = 0;
            }
            syncAlways();
        };
        /**
         * The function that should be run on every iteration
         */
        const syncAlways = () => {
            syncExplosion();
            server_1.myServer.io.sockets
                .in(this.state.roomName)
                .emit(serverEvents_1.ServerEvents.allPlayersPos, {
                result: this.state.players.positions,
            });
        };
        /**
         * The function that sends only the new info to the client
         */
        const syncPartial = () => {
            const softWalls = this.state.walls.softs;
            if (softWalls.toDelete.length > 0) {
                server_1.myServer.io.sockets
                    .in(this.state.roomName)
                    .emit(serverEvents_1.ServerEvents.removeSoftWalls, {
                    result: softWalls.toDelete,
                });
                softWalls.toDelete = [];
            }
            const bombs = this.state.bombs;
            if (bombs.toCreate.length > 0) {
                server_1.myServer.io.sockets
                    .in(this.state.roomName)
                    .emit(serverEvents_1.ServerEvents.addBombs, {
                    result: bombs.toCreate,
                });
                bombs.toCreate = [];
            }
            if (bombs.toDelete.length > 0) {
                server_1.myServer.io.sockets
                    .in(this.state.roomName)
                    .emit(serverEvents_1.ServerEvents.removeBombs, {
                    result: bombs.toDelete,
                });
                bombs.toDelete = [];
            }
            if (this.state.players.infoChanged) {
                server_1.myServer.io.sockets
                    .in(this.state.roomName)
                    .emit(serverEvents_1.ServerEvents.allPlayerStats, {
                    result: this.state.players.infos,
                });
                this.state.players.infoChanged = false;
            }
            const powers = this.state.powerUps;
            if (powers.toCreate.length > 0) {
                server_1.myServer.io.sockets
                    .in(this.state.roomName)
                    .emit(serverEvents_1.ServerEvents.addPowerUps, {
                    result: powers.toCreate,
                });
                powers.toCreate = [];
            }
            if (powers.toDelete.length > 0) {
                server_1.myServer.io.sockets
                    .in(this.state.roomName)
                    .emit(serverEvents_1.ServerEvents.removePowerUps, {
                    result: powers.toDelete,
                });
                powers.toDelete = [];
            }
        };
        /**
         * Sends the new explosions to the client
         */
        const syncExplosion = () => {
            const fire = this.state.explosionFields;
            if (fire.toCreate.length > 0) {
                server_1.myServer.io.sockets
                    .in(this.state.roomName)
                    .emit(serverEvents_1.ServerEvents.addExplosionFields, {
                    result: {
                        time: this.state.time,
                        timeInfo: Date.now(),
                        newExplosions: fire.toCreate,
                    },
                });
                fire.toCreate = [];
            }
        };
        /**
         * Refreshes all the clients by sending all the game data, not just the new parts
         */
        const syncAll = () => {
            server_1.myServer.io.sockets
                .in(this.state.roomName)
                .emit(serverEvents_1.ServerEvents.allSoftWalls, {
                result: this.state.walls.softs.all,
            });
            this.state.walls.softs.toDelete = [];
            server_1.myServer.io.sockets.in(this.state.roomName).emit(serverEvents_1.ServerEvents.allBombs, {
                result: this.state.bombs.all,
            });
            this.state.bombs.toDelete = [];
            server_1.myServer.io.sockets
                .in(this.state.roomName)
                .emit(serverEvents_1.ServerEvents.allPlayerStats, {
                result: this.state.players.infos,
            });
            this.state.players.infoChanged = false;
            server_1.myServer.io.sockets
                .in(this.state.roomName)
                .emit(serverEvents_1.ServerEvents.allPowerUps, {
                result: this.state.powerUps.all.shown,
            });
            this.state.powerUps.toCreate = [];
            this.state.powerUps.toDelete = [];
        };
        this.syncEnd = (winner, client) => {
            var _a, _b;
            server_1.myServer.io.sockets.in(this.state.roomName).emit(serverEvents_1.ServerEvents.gameOver, {
                result: winner,
            });
            if (this.state.tutorial) {
                (0, sendToast_1.sendInfo)(client, (_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.tutorialSteps) === null || _b === void 0 ? void 0 : _b.game.gameOver.text);
            }
        };
    }
}
exports.Emitter = Emitter;
