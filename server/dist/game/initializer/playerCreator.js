"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlayer = exports.Players = void 0;
const playerPlaces_1 = require("./playerPlaces");
const constants_1 = require("../../sharedConstants/constants");
class Players {
}
exports.Players = Players;
const createPlayer = (playerNumber) => {
    const info = {
        number: playerNumber,
        color: "",
        isAdmin: playerNumber == 0,
        isDead: false,
        health: constants_1.PLAYER_HEALTH,
        bombRange: 2,
        speed: constants_1.PLAYER_SPEED,
        maxBomb: 1,
        bombsDeployed: 0,
        name: "",
        invincible: false,
        invincibleUntil: 0,
    };
    const playerPlacePos = playerPlaces_1.PLAYER_CREATE_PLACES[playerNumber].pos;
    const pos = {
        number: playerNumber,
        pos: playerPlacePos,
    };
    return { info: info, pos: pos };
};
exports.createPlayer = createPlayer;
