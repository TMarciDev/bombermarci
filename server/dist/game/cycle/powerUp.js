"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPower = exports.calculatePowerUps = void 0;
const density_1 = require("../../sharedConstants/density");
const sendToast_1 = require("../sendToast");
const utils_1 = require("./utils");
const calculatePowerUps = (state, client) => {
    const players = state.players;
    players.positions.forEach((player) => {
        const playerInfo = state.players.infos[player.number];
        state.powerUps.all.shown.forEach((p, idx) => {
            if ((0, utils_1.isWithin)(p.pos, player.pos)) {
                (0, exports.addPower)(state, playerInfo.number, idx, client);
                return;
            }
        });
    });
};
exports.calculatePowerUps = calculatePowerUps;
const addPower = (state, playerNumber, powerNumber, client) => {
    var _a, _b, _c;
    const collected = state.powerUps.all.shown.splice(powerNumber, 1)[0];
    state.powerUps.toDelete.push(collected);
    switch (collected.type) {
        case "add_bomb": {
            state.players.infos[playerNumber].maxBomb++;
            if (state.tutorial) {
                (0, sendToast_1.sendInfo)(client, (_a = state === null || state === void 0 ? void 0 : state.tutorialSteps) === null || _a === void 0 ? void 0 : _a.game.add.text);
            }
            break;
        }
        case "add_speed": {
            if (state.players.infos[playerNumber].speed >= density_1.density / 2)
                break;
            state.players.infos[playerNumber].speed += 1.5;
            if (state.tutorial) {
                (0, sendToast_1.sendInfo)(client, (_b = state === null || state === void 0 ? void 0 : state.tutorialSteps) === null || _b === void 0 ? void 0 : _b.game.speed.text);
            }
            break;
        }
        case "add_range": {
            state.players.infos[playerNumber].bombRange++;
            if (state.tutorial) {
                (0, sendToast_1.sendInfo)(client, (_c = state === null || state === void 0 ? void 0 : state.tutorialSteps) === null || _c === void 0 ? void 0 : _c.game.range.text);
            }
            break;
        }
    }
};
exports.addPower = addPower;
