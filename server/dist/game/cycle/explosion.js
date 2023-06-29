"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExplosions = void 0;
const constants_1 = require("../../sharedConstants/constants");
const utils_1 = require("./utils");
const density_1 = require("./../../sharedConstants/density");
const sendToast_1 = require("../sendToast");
const calculateExplosions = (state, client) => {
    deleteEnded(state);
    searchTimeIgnited(state, client);
};
exports.calculateExplosions = calculateExplosions;
const deleteEnded = (state) => {
    state.explosionFields.all = state.explosionFields.all.filter((explosion) => explosion.endTime > state.time);
};
const searchTimeIgnited = (state, client) => {
    let exploding = [];
    state.bombs.all.forEach((bomb, idx) => {
        if (bomb.endTime <= state.time) {
            exploding.push(state.bombs.all.splice(idx, 1)[0]);
        }
    });
    exploding.forEach((b) => {
        explodeBomb(state, b, true, client);
    });
};
const explodeBomb = (state, bomb, timed = true, client) => {
    var _a, _b;
    state.bombs.toDelete.push(bomb);
    state.players.infos[bomb.playerNumber].bombsDeployed--;
    const time = state.time;
    const pos = bomb.pos;
    if (timed) {
        //TODO: refact dulication
        state.explosionFields.toCreate.push({
            playerNumber: bomb.playerNumber,
            pos: pos,
            endTime: time + constants_1.EXPLOSION_TIME,
            timestamp: Date.now() + constants_1.EXPLOSION_TIME,
        });
        state.explosionFields.all.push({
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
            flowToDir(canGo, "left", { x: pos.x - i * density_1.density, y: pos.y }, state, bomb.playerNumber, client);
        canGo.right &&
            flowToDir(canGo, "right", { x: pos.x + i * density_1.density, y: pos.y }, state, bomb.playerNumber, client);
        canGo.up &&
            flowToDir(canGo, "up", { x: pos.x, y: pos.y - i * density_1.density }, state, bomb.playerNumber, client);
        canGo.down &&
            flowToDir(canGo, "down", { x: pos.x, y: pos.y + i * density_1.density }, state, bomb.playerNumber, client);
    }
    if (state.tutorial && !((_a = state === null || state === void 0 ? void 0 : state.tutorialSteps) === null || _a === void 0 ? void 0 : _a.game.win.done)) {
        (0, sendToast_1.sendInfo)(client, (_b = state === null || state === void 0 ? void 0 : state.tutorialSteps) === null || _b === void 0 ? void 0 : _b.game.win.text);
        state.tutorialSteps.game.win.done = true;
    }
};
const flowToDir = (canGo, dir, posToCheck, state, playerNumber, client) => {
    if (!(0, utils_1.isFreeFromWalls)(state, posToCheck)) {
        canGo[dir] = false;
        removeWall(state, (0, utils_1.isSoftWall)(state, posToCheck));
    }
    else {
        state.explosionFields.toCreate.push({
            playerNumber: playerNumber,
            pos: posToCheck,
            endTime: state.time + constants_1.EXPLOSION_TIME,
            timestamp: Date.now() + constants_1.EXPLOSION_TIME,
        });
        state.explosionFields.all.push({
            playerNumber: playerNumber,
            pos: posToCheck,
            endTime: state.time + constants_1.EXPLOSION_TIME,
            timestamp: Date.now() + constants_1.EXPLOSION_TIME,
        });
    }
    const newBombIndex = (0, utils_1.isBomb)(state, posToCheck);
    if (newBombIndex >= 0) {
        canGo[dir] = false;
        explodeBomb(state, state.bombs.all.splice(newBombIndex, 1)[0], false, client);
    }
};
const removeWall = (state, index) => {
    if (index < 0)
        return;
    const toDelete = state.walls.softs.all.splice(index, 1)[0];
    state.walls.softs.toDelete.push(toDelete);
    powerUpReveal(state, toDelete.pos);
};
const powerUpReveal = (state, pos) => {
    const powerUps = state.powerUps.all;
    const pwIdx = powerUps.hidden.findIndex((p) => p.pos.x === pos.x && p.pos.y === pos.y);
    if (pwIdx < 0)
        return;
    const toCreate = powerUps.hidden.splice(pwIdx, 1)[0];
    powerUps.shown.push(toCreate);
    state.powerUps.toCreate.push(toCreate);
};
