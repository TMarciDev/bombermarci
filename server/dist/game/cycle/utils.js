"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWithin = exports.getBombIndex = exports.getSoftWallIndex = exports.isFreeFromWalls = void 0;
const density_1 = require("../../sharedConstants/density");
/**
 * Checks if a given position has a wall or not
 * @param state The current state
 * @param pos The position to look for
 * @param includeBombs To also be sensitive if it finds a bomb instead
 * @returns The result of the search: true if didn't find any
 */
const isFreeFromWalls = (state, pos, includeBombs = false) => {
    const walls = state.walls;
    let obsticles = [
        ...walls.hards,
        ...walls.softs.all,
    ];
    if (includeBombs) {
        obsticles = [...obsticles, ...state.bombs.all];
    }
    if (obsticles.find((p) => p.pos.x === pos.x && p.pos.y === pos.y)) {
        return false;
    }
    return true;
};
exports.isFreeFromWalls = isFreeFromWalls;
/**
 * Checks the given position and then returns it's index in the state
 * @param state The game state we search in
 * @param pos The targeted position that
 * @returns The index of the soft wall
 */
const getSoftWallIndex = (state, pos) => {
    return state.walls.softs.all.findIndex((p) => {
        return p.pos.x === pos.x && p.pos.y === pos.y;
    });
};
exports.getSoftWallIndex = getSoftWallIndex;
/**
 * Gets the given bomb index on a location
 * @param state The state we search in
 * @param pos The position we search for
 * @returns The idnex of the bomb
 */
const getBombIndex = (state, pos) => {
    return state.bombs.all.findIndex((p) => {
        return p.pos.x === pos.x && p.pos.y === pos.y;
    });
};
exports.getBombIndex = getBombIndex;
/**
 * Checks if a position defined rectangle is intersects with another position defined rectangle
 * @param target Target position rectangle
 * @param player Player position rectangle
 * @returns True if the two intersetcs
 */
const isWithin = (target, player) => {
    const xAligned = target.x === player.x;
    const yAligned = target.y === player.y;
    if (xAligned && yAligned)
        return true;
    if (!xAligned && !yAligned)
        return false;
    let newPlayerPos;
    if (xAligned) {
        //* yAligned: false
        if (target.y >= player.y) {
            newPlayerPos = {
                x: player.x,
                y: player.y + density_1.DENSITY - (player.y % density_1.DENSITY),
            };
        }
        else {
            newPlayerPos = {
                x: player.x,
                y: player.y - (player.y % density_1.DENSITY),
            };
        }
    }
    else {
        if (target.x >= player.x) {
            newPlayerPos = {
                x: player.x + density_1.DENSITY - (player.x % density_1.DENSITY),
                y: player.y,
            };
        }
        else {
            newPlayerPos = {
                x: player.x - (player.x % density_1.DENSITY),
                y: player.y,
            };
        }
    }
    if (target.x !== newPlayerPos.x && target.y !== newPlayerPos.y)
        return false;
    if (Math.abs(target.x - player.x) + Math.abs(target.y - player.y) + density_1.HITBOX >=
        density_1.DENSITY)
        return false;
    return true;
};
exports.isWithin = isWithin;
