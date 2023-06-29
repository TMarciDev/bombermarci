"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameCycle = void 0;
const constants_1 = require("../../sharedConstants/constants");
const game_1 = require("../game");
const sendToast_1 = require("../sendToast");
const GameHandlerTypes_1 = require("../../types/GameHandlerTypes");
const emitter_1 = require("./emitter");
const calculate_1 = require("./calculate/calculate");
class GameCycle extends GameHandlerTypes_1.GameHandler {
    constructor(state) {
        super(state);
        this.state = state;
        this.start = (client) => {
            var _a, _b;
            this.interval = setInterval(() => {
                this.progress(client);
            }, 1000 / constants_1.FRAME_RATE);
            if (this.state.tutorial) {
                (0, sendToast_1.sendInfo)(client, (_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.tutorialSteps) === null || _b === void 0 ? void 0 : _b.game.move.text);
            }
        };
        this.progress = (client) => {
            const winner = this.next(client);
            if (winner === null || this.additionalFrames < constants_1.FRAME_RATE * 4) {
                this.emitter.sync();
                if (winner !== null)
                    this.additionalFrames++;
            }
            else {
                this.emitter.syncEnd(winner, client);
                this.delete(this.state.roomName);
                clearInterval(this.interval);
            }
        };
        this.next = (client) => {
            this.calculate.all(client);
            const timePassed = 1000 / constants_1.FRAME_RATE;
            this.state.time += timePassed;
            this.state.syncedAllTime += timePassed;
            if (!this.state.gameOver)
                return null;
            else if (this.state.gameStage != "draw") {
                let winner = -1;
                this.state.players.infos.forEach((info) => {
                    if (!info.isDead) {
                        winner = info.number;
                    }
                });
                if (winner === -1) {
                    console.error("Winner calculation failed");
                }
                return winner;
            }
            else {
                return -1;
            }
        };
        this.delete = (roomName) => {
            game_1.game.state[roomName].connectedClientIds.forEach((id) => {
                delete game_1.game.rooms[id];
            });
            delete game_1.game.state[roomName];
        };
        this.emitter = new emitter_1.Emitter(this.state);
        this.calculate = new calculate_1.Calculate(this.state);
        this.additionalFrames = 0;
        this.interval = null;
    }
}
exports.GameCycle = GameCycle;
