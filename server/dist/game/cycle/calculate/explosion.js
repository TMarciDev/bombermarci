"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplosionCalculator = void 0;
const constants_1 = require("../../../sharedConstants/constants");
const utils_1 = require("../utils");
const density_1 = require("../../../sharedConstants/density");
const sendToast_1 = require("../../sendToast");
const baseCalculator_1 = require("./baseCalculator");
class ExplosionCalculator extends baseCalculator_1.BaseCalculator {
    constructor(state) {
        super(state);
        this.state = state;
        this.calculate = (client) => {
            deleteEnded();
            searchTimeIgnited(client);
        };
        /**
         * Deletes all the explosions of the state that are over so we don't have to involve those in our calculations
         */
        const deleteEnded = () => {
            this.state.explosionFields.all = this.state.explosionFields.all.filter((explosion) => explosion.endTime > this.state.time);
        };
        /**
         * Searches for the bombs that needs to be blown up, and ignites them
         * @param client The connected socket
         */
        const searchTimeIgnited = (client) => {
            let exploding = [];
            this.state.bombs.all.forEach((bomb, idx) => {
                if (bomb.endTime <= this.state.time) {
                    exploding.push(this.state.bombs.all.splice(idx, 1)[0]);
                }
            });
            exploding.forEach((bomb) => {
                explodeBomb(bomb, true, client);
            });
        };
        /**
         * Explodes a bomb. It calculates all the four directions to be blown up in the given bomb area
         * @param bomb The bomb to blow up
         * @param timed True if a bomb was exploded by itself
         * @param client The connected client
         */
        const explodeBomb = (bomb, timed = true, client) => {
            var _a, _b, _c, _d;
            this.state.bombs.toDelete.push(bomb);
            this.state.players.infos[bomb.playerNumber].bombsDeployed--;
            const time = this.state.time;
            const pos = bomb.pos;
            if (timed) {
                this.state.explosionFields.toCreate.push({
                    playerNumber: bomb.playerNumber,
                    pos: pos,
                    endTime: time + constants_1.EXPLOSION_TIME,
                    timestamp: Date.now() + constants_1.EXPLOSION_TIME,
                });
                this.state.explosionFields.all.push({
                    playerNumber: bomb.playerNumber,
                    pos: pos,
                    endTime: time + constants_1.EXPLOSION_TIME,
                    timestamp: Date.now() + constants_1.EXPLOSION_TIME,
                });
            }
            let canGo = {
                left: true,
                right: true,
                up: true,
                down: true,
            };
            for (let i = 1; i < bomb.range; ++i) {
                if (!canGo.left && !canGo.right && !canGo.up && !canGo.down)
                    break;
                canGo.left &&
                    flowToDirection(canGo, "left", { x: pos.x - i * density_1.DENSITY, y: pos.y }, bomb.playerNumber, client);
                canGo.right &&
                    flowToDirection(canGo, "right", { x: pos.x + i * density_1.DENSITY, y: pos.y }, bomb.playerNumber, client);
                canGo.up &&
                    flowToDirection(canGo, "up", { x: pos.x, y: pos.y - i * density_1.DENSITY }, bomb.playerNumber, client);
                canGo.down &&
                    flowToDirection(canGo, "down", { x: pos.x, y: pos.y + i * density_1.DENSITY }, bomb.playerNumber, client);
            }
            if (this.state.tutorial && !((_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.tutorialSteps) === null || _b === void 0 ? void 0 : _b.game.win.done)) {
                (0, sendToast_1.sendInfo)(client, (_d = (_c = this.state) === null || _c === void 0 ? void 0 : _c.tutorialSteps) === null || _d === void 0 ? void 0 : _d.game.win.text);
                this.state.tutorialSteps.game.win.done = true;
            }
        };
        /**
         * Calculates the bomb flow direction and evaulates if there is something in the way or not
         * @param canGo The object that holds the direction possibilities
         * @param dir The direction to flow to. Hitting an obsticle will cause setting the canGo objects direction false
         * @param posToCheck The position to be checked for obsticles or bombs
         * @param playerNumber The player number of the explosion
         * @param client The connected client
         */
        const flowToDirection = (canGo, dir, posToCheck, playerNumber, client) => {
            if (!(0, utils_1.isFreeFromWalls)(this.state, posToCheck)) {
                canGo[dir] = false;
                removeWall((0, utils_1.getSoftWallIndex)(this.state, posToCheck));
            }
            else {
                this.state.explosionFields.toCreate.push({
                    playerNumber: playerNumber,
                    pos: posToCheck,
                    endTime: this.state.time + constants_1.EXPLOSION_TIME,
                    timestamp: Date.now() + constants_1.EXPLOSION_TIME,
                });
                this.state.explosionFields.all.push({
                    playerNumber: playerNumber,
                    pos: posToCheck,
                    endTime: this.state.time + constants_1.EXPLOSION_TIME,
                    timestamp: Date.now() + constants_1.EXPLOSION_TIME,
                });
            }
            const newBombIndex = (0, utils_1.getBombIndex)(this.state, posToCheck);
            if (newBombIndex >= 0) {
                canGo[dir] = false;
                explodeBomb(this.state.bombs.all.splice(newBombIndex, 1)[0], false, client);
            }
        };
        /**
         * It handles removing a wall upon explosion
         * @param index The index of teh wall to be romoved
         */
        const removeWall = (index) => {
            if (index < 0)
                return;
            const toDelete = this.state.walls.softs.all.splice(index, 1)[0];
            this.state.walls.softs.toDelete.push(toDelete);
            powerUpReveal(toDelete.pos);
        };
        /**
         * It reveals a power up if it became visble under a wall
         * @param pos The position to be revelaed at
         */
        const powerUpReveal = (pos) => {
            const powerUps = this.state.powerUps.all;
            const pwIdx = powerUps.hidden.findIndex((p) => p.pos.x === pos.x && p.pos.y === pos.y);
            if (pwIdx < 0)
                return;
            const toCreate = powerUps.hidden.splice(pwIdx, 1)[0];
            powerUps.shown.push(toCreate);
            this.state.powerUps.toCreate.push(toCreate);
        };
    }
}
exports.ExplosionCalculator = ExplosionCalculator;
