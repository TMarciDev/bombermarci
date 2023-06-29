"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerUpCalculator = void 0;
const density_1 = require("../../../sharedConstants/density");
const sendToast_1 = require("../../sendToast");
const utils_1 = require("../utils");
const baseCalculator_1 = require("./baseCalculator");
class PowerUpCalculator extends baseCalculator_1.BaseCalculator {
    constructor(state) {
        super(state);
        this.state = state;
        this.calculate = (client) => {
            const players = this.state.players;
            players.positions.forEach((player) => {
                const playerInfo = this.state.players.infos[player.number];
                this.state.powerUps.all.shown.forEach((p, idx) => {
                    if ((0, utils_1.isWithin)(p.pos, player.pos)) {
                        addPower(playerInfo.number, idx, client);
                        return;
                    }
                });
            });
        };
        /**
         * It adds a power to a player
         * @param playerNumber The player to be boosted
         * @param powerNumber The power to grant
         * @param client The connected socket
         */
        const addPower = (playerNumber, powerNumber, client) => {
            var _a, _b, _c, _d, _e, _f;
            const collected = this.state.powerUps.all.shown.splice(powerNumber, 1)[0];
            this.state.powerUps.toDelete.push(collected);
            switch (collected.type) {
                case "add_bomb": {
                    this.state.players.infos[playerNumber].maxBomb++;
                    if (this.state.tutorial) {
                        (0, sendToast_1.sendInfo)(client, (_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.tutorialSteps) === null || _b === void 0 ? void 0 : _b.game.add.text);
                    }
                    break;
                }
                case "add_speed": {
                    if (this.state.players.infos[playerNumber].speed >= density_1.DENSITY / 2)
                        break;
                    this.state.players.infos[playerNumber].speed += 1.5;
                    if (this.state.tutorial) {
                        (0, sendToast_1.sendInfo)(client, (_d = (_c = this.state) === null || _c === void 0 ? void 0 : _c.tutorialSteps) === null || _d === void 0 ? void 0 : _d.game.speed.text);
                    }
                    break;
                }
                case "add_range": {
                    this.state.players.infos[playerNumber].bombRange++;
                    if (this.state.tutorial) {
                        (0, sendToast_1.sendInfo)(client, (_f = (_e = this.state) === null || _e === void 0 ? void 0 : _e.tutorialSteps) === null || _f === void 0 ? void 0 : _f.game.range.text);
                    }
                    break;
                }
            }
        };
    }
}
exports.PowerUpCalculator = PowerUpCalculator;
