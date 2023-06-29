"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameCycle = void 0;
const constants_1 = require("../../sharedConstants/constants");
const game_1 = require("../game");
const sendToast_1 = require("../sendToast");
const gameBaseClasses_1 = require("../gameBaseClasses");
const emitter_1 = require("./emitter");
const calculate_1 = require("./calculate/calculate");
const input_1 = require("./input");
class GameCycle extends gameBaseClasses_1.GameHandler {
    constructor(state) {
        super(state);
        this.state = state;
        this.emitter = new emitter_1.Emitter(state);
        const calculate = new calculate_1.Calculate(state);
        let additionalFrames = 0;
        let interval = null;
        this.input = new input_1.Input(state);
        this.start = (client) => {
            var _a, _b;
            interval = setInterval(() => {
                progress(client);
            }, 1000 / constants_1.FRAME_RATE);
            if (this.state.tutorial) {
                (0, sendToast_1.sendInfo)(client, (_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.tutorialSteps) === null || _b === void 0 ? void 0 : _b.game.move.text);
            }
        };
        /**
         * The body of the cycle, it calls next if the game is not over
         * @param client
         */
        const progress = (client) => {
            const winner = next(client);
            if (winner === null || additionalFrames < constants_1.FRAME_RATE * 4) {
                this.emitter.sync();
                if (winner !== null)
                    additionalFrames++;
            }
            else {
                this.emitter.syncEnd(winner, client);
                destroy(this.state.roomName);
                clearInterval(interval);
            }
        };
        /**
         * It calculates the next frame of the game
         * @param client The connected socket
         * @returns null if there is no winner yet, -1 if draw. It returns the winner player number if there is one
         */
        const next = (client) => {
            calculate.all(client);
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
        /**
         * Deletes all the game data
         * @param roomName The room name to be cleared
         */
        const destroy = (roomName) => {
            game_1.game.state[roomName].connectedClientIds.forEach((id) => {
                delete game_1.game.rooms[id];
            });
            delete game_1.game.state[roomName];
        };
    }
}
exports.GameCycle = GameCycle;
