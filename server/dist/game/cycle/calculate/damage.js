"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageCalculator = void 0;
const constants_1 = require("../../../sharedConstants/constants");
const utils_1 = require("../utils");
const sendToast_1 = require("../../sendToast");
const baseCalculator_1 = require("./baseCalculator");
class DamageCalculator extends baseCalculator_1.BaseCalculator {
    constructor(state) {
        super(state);
        this.state = state;
        this.calculate = (client) => {
            const players = this.state.players;
            players.positions.forEach((player) => {
                const playerInfo = this.state.players.infos[player.number];
                if (playerInfo.invincibleUntil >= this.state.time)
                    return;
                if (playerInfo.invincible) {
                    playerInfo.invincible = false;
                    players.infoChanged = true;
                }
                this.state.explosionFields.all.forEach((field) => {
                    if ((0, utils_1.isWithin)(field.pos, player.pos) && !playerInfo.invincible) {
                        takeDamage(playerInfo, this.state.time, client);
                        players.infoChanged = true;
                        return;
                    }
                    if (playerInfo.invincible)
                        return;
                });
            });
        };
        /**
         * Makes the palyer loose health
         * @param player The player to damage
         * @param time The server time
         * @param client The connected socket
         */
        const takeDamage = (player, time, client) => {
            var _a, _b;
            player.health--;
            if (player.health <= 0) {
                handleDeath(player);
                return;
            }
            player.invincible = true;
            player.invincibleUntil = time + constants_1.INVINCIBILITY_TIME;
            if (this.state.tutorial) {
                (0, sendToast_1.sendError)(client, (_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.tutorialSteps) === null || _b === void 0 ? void 0 : _b.game.damage.text);
            }
        };
        /**
         * Handles a loosing player
         * @param player The player who has game over
         */
        const handleDeath = (player) => {
            player.isDead = true;
            this.state.players.directions[player.number] = [];
            this.state.players.bombers[player.number] = false;
            const playerCount = this.state.players.infos.length;
            let dead = 0;
            this.state.players.infos.forEach((info) => {
                if (info.isDead)
                    dead++;
            });
            if (dead < playerCount - 1)
                return;
            else if (dead === playerCount - 1) {
                this.state.gameOver = true;
                this.state.gameStage = "won";
            }
            else {
                this.state.gameOver = true;
                this.state.gameStage = "draw";
            }
        };
    }
}
exports.DamageCalculator = DamageCalculator;
