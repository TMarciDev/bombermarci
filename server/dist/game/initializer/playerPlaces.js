"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAYER_SPAWN_AREA = exports.PLAYER_CREATE_PLACES = void 0;
const density_1 = require("../../sharedConstants/density");
exports.PLAYER_CREATE_PLACES = [
    { pos: { x: 1 * density_1.DENSITY, y: 1 * density_1.DENSITY } },
    { pos: { x: 13 * density_1.DENSITY, y: 13 * density_1.DENSITY } },
    { pos: { x: 1 * density_1.DENSITY, y: 13 * density_1.DENSITY } },
    { pos: { x: 13 * density_1.DENSITY, y: 1 * density_1.DENSITY } },
];
exports.PLAYER_SPAWN_AREA = [
    { pos: { x: 2 * density_1.DENSITY, y: 1 * density_1.DENSITY } },
    { pos: { x: 1 * density_1.DENSITY, y: 2 * density_1.DENSITY } },
    { pos: { x: 2 * density_1.DENSITY, y: 13 * density_1.DENSITY } },
    { pos: { x: 1 * density_1.DENSITY, y: 12 * density_1.DENSITY } },
    { pos: { x: 12 * density_1.DENSITY, y: 1 * density_1.DENSITY } },
    { pos: { x: 13 * density_1.DENSITY, y: 2 * density_1.DENSITY } },
    { pos: { x: 12 * density_1.DENSITY, y: 13 * density_1.DENSITY } },
    { pos: { x: 13 * density_1.DENSITY, y: 12 * density_1.DENSITY } },
];
