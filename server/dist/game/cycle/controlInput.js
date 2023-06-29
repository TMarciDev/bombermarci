"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControlInput = void 0;
const movement_1 = require("./movement");
const controlInpoutTypes_1 = require("../../sharedConstants/controlInpoutTypes");
const placeBombs_1 = require("./placeBombs");
const game_1 = require("../game");
const handleControlInput = (roomName, number, code, keyMovement, client) => {
    if (game_1.game.state[roomName].players.infos[number].isDead)
        return;
    if (code === controlInpoutTypes_1.ControlEnum.STAY) {
        (0, movement_1.removeAllDirections)(roomName, number);
    }
    else if (code === controlInpoutTypes_1.ControlEnum.LEFT ||
        code === controlInpoutTypes_1.ControlEnum.RIGHT ||
        code === controlInpoutTypes_1.ControlEnum.UP ||
        code === controlInpoutTypes_1.ControlEnum.DOWN) {
        keyMovement === "pressed"
            ? (0, movement_1.addDirection)(roomName, number, code, client)
            : (0, movement_1.removeDirection)(roomName, number, code);
    }
    else if (code === controlInpoutTypes_1.ControlEnum.BOMB) {
        keyMovement === "pressed"
            ? (0, placeBombs_1.addBombing)(roomName, number, client)
            : (0, placeBombs_1.removeBombing)(roomName, number);
    }
};
exports.handleControlInput = handleControlInput;
