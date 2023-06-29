"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePowerUps = exports.generateSoftWalls = exports.generateHardWalls = void 0;
const utils_1 = require("../utils");
//import { POWER_UP_TYPES } from "../../sharedConstants/powerUpTypes";
const density_1 = require("../../sharedConstants/density");
const generateHardWalls = (mapInfo) => {
    let hardWalls = [];
    const addHardWall = (x, y) => {
        if (x === 0 ||
            x === mapInfo.width - density_1.density ||
            y === 0 ||
            y === mapInfo.height - density_1.density ||
            (x % (2 * density_1.density) === 0 && y % (2 * density_1.density) === 0)) {
            hardWalls.push({ pos: { x: x, y: y } });
        }
    };
    (0, utils_1.iterateOnMap)(mapInfo, addHardWall);
    return hardWalls;
};
exports.generateHardWalls = generateHardWalls;
//TODO: fix any type
const generateSoftWalls = (mapInfo, exclude, options) => {
    let softWalls = [];
    const addSoftWall = (x, y) => {
        const softWallObj = { pos: { x: x, y: y } };
        if (
        //TODO: dry this and the next one
        Math.random() < options.probability &&
            !exclude.find((e) => e.pos.x === softWallObj.pos.x && e.pos.y === softWallObj.pos.y)) {
            softWalls.push(softWallObj);
        }
    };
    (0, utils_1.iterateOnMap)(mapInfo, addSoftWall);
    return softWalls;
};
exports.generateSoftWalls = generateSoftWalls;
const POWER_UP_TYPES = {
    add_bomb: 0,
    add_speed: 1,
    add_range: 2,
};
//TODO: fix any type
const generatePowerUps = (mapInfo, places, options) => {
    let powerUps = [];
    const keys = Object.keys(POWER_UP_TYPES);
    const addPowerUp = (x, y) => {
        const randomKey = keys[(keys.length * Math.random()) << 0];
        const powerUpObj = { pos: { x: x, y: y }, type: randomKey };
        if (Math.random() < options.probability &&
            places.find((e) => e.pos.x === powerUpObj.pos.x && e.pos.y === powerUpObj.pos.y)) {
            powerUps.push(powerUpObj);
        }
    };
    (0, utils_1.iterateOnMap)(mapInfo, addPowerUp);
    return powerUps;
};
exports.generatePowerUps = generatePowerUps;
