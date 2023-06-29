"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDamage = void 0;
const constants_1 = require("../../sharedConstants/constants");
const utils_1 = require("./utils");
const sendToast_1 = require("../sendToast");
const calculateDamage = (state, client) => {
    const players = state.players;
    players.positions.forEach((player) => {
        const playerInfo = state.players.infos[player.number];
        if (playerInfo.invincibleUntil >= state.time)
            return;
        if (playerInfo.invincible) {
            playerInfo.invincible = false;
            players.infoChanged = true;
        }
        state.explosionFields.all.forEach((field) => {
            if ((0, utils_1.isWithin)(field.pos, player.pos) && !playerInfo.invincible) {
                takeDamage(state, playerInfo, state.time, client);
                players.infoChanged = true;
                return;
            }
            if (playerInfo.invincible)
                return;
        });
    });
};
exports.calculateDamage = calculateDamage;
const takeDamage = (state, player, time, client) => {
    var _a;
    player.health--;
    if (player.health <= 0) {
        handleDeath(state, player);
        return;
    }
    player.invincible = true;
    player.invincibleUntil = time + constants_1.INVINCIBILITY_TIME;
    if (state.tutorial) {
        (0, sendToast_1.sendError)(client, (_a = state === null || state === void 0 ? void 0 : state.tutorialSteps) === null || _a === void 0 ? void 0 : _a.game.damage.text);
    }
};
const handleDeath = (state, player) => {
    player.isDead = true;
    state.players.directions[player.number] = [];
    state.players.bombers[player.number] = false;
    const playerCount = state.players.infos.length;
    let dead = 0;
    state.players.infos.forEach((info) => {
        if (info.isDead)
            dead++;
    });
    if (dead < playerCount - 1)
        return;
    else if (dead === playerCount - 1) {
        state.gameOver = true;
        state.gameStage = "won";
    }
    else {
        state.gameOver = true;
        state.gameStage = "draw";
    }
};
