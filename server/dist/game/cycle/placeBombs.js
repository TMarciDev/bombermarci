"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBombPlacements = void 0;
const density_1 = require("./../../sharedConstants/density");
const constants_1 = require("../../sharedConstants/constants");
const calculateBombPlacements = (state) => {
    state.players.bombers.forEach((isBombing, number) => {
        if (!isBombing)
            return;
        const player = state.players.infos[number];
        if (player.bombsDeployed >= player.maxBomb)
            return;
        if (!deployAround(state, state.players.positions[number].pos, number))
            return;
        player.bombsDeployed++;
    });
};
exports.calculateBombPlacements = calculateBombPlacements;
const deployAround = (state, pos, number) => {
    const playerInfo = state.players.infos[number];
    const bombPos = getRoundedPos(pos);
    if (!isFreeFromBomb(state, bombPos))
        return false;
    state.bombs.all.push({
        pos: bombPos,
        playerNumber: number,
        range: playerInfo.bombRange,
        endTime: state.time + constants_1.BOMB_TIME,
    });
    state.bombs.toCreate.push({
        pos: bombPos,
        playerNumber: number,
        range: playerInfo.bombRange,
        endTime: state.time + constants_1.BOMB_TIME,
    });
    return true;
};
//TODO: extract this!
const isFreeFromBomb = (state, pos) => {
    if (state.bombs.all.find((p) => p.pos.x === pos.x && p.pos.y === pos.y)) {
        return false;
    }
    return true;
};
const getRoundedPos = (pos) => {
    return { x: roundToDensity(pos.x), y: roundToDensity(pos.y) };
};
const roundToDensity = (n) => {
    const remainder = n % density_1.density;
    return remainder < density_1.density / 2 ? n - remainder : n + (density_1.density - remainder);
};
