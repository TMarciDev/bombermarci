"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePositions = void 0;
const density_1 = require("./../../sharedConstants/density");
const controlInpoutTypes_1 = require("./../../sharedConstants/controlInpoutTypes");
const game_1 = require("../game");
const utils_1 = require("./utils");
const calculatePositions = (state, roomName) => {
    state.players.directions.forEach((pressedCodes, number) => {
        if (!pressedCodes.length)
            return;
        handleMovement(roomName, number, pressedCodes[0]);
    });
};
exports.calculatePositions = calculatePositions;
const handleMovement = (roomName, number, code) => {
    const players = game_1.game.state[roomName].players;
    const speed = players.infos[number].speed;
    let playerPlace = players.positions[number].pos;
    let newPlace = {};
    let changed = false;
    switch (code) {
        case controlInpoutTypes_1.ControlEnum.LEFT: {
            [newPlace, changed] = getProperPosition(roomName, playerPlace, -speed, "x");
            break;
        }
        case controlInpoutTypes_1.ControlEnum.RIGHT: {
            [newPlace, changed] = getProperPosition(roomName, playerPlace, speed, "x");
            break;
        }
        case controlInpoutTypes_1.ControlEnum.UP: {
            [newPlace, changed] = getProperPosition(roomName, playerPlace, -speed, "y");
            break;
        }
        case controlInpoutTypes_1.ControlEnum.DOWN: {
            [newPlace, changed] = getProperPosition(roomName, playerPlace, speed, "y");
            break;
        }
    }
    if (changed) {
        players.positions[number].pos = newPlace;
    }
};
const getProperPosition = (roomName, fromPos, speed, axis) => {
    const fVal = fromPos[axis];
    //const toPos = { ...fromPos, [axis]: fromPos[axis] + speed };
    const toPos = editPos(fromPos, axis, fVal + speed);
    const tVal = toPos[axis];
    const alignments = getAligned(fromPos);
    const multiplier = speed > 0 ? 1 : -1;
    const state = game_1.game.state[roomName];
    if (alignments.x && alignments.y) {
        const posToCheck = Object.assign(Object.assign({}, fromPos), { [axis]: fromPos[axis] + density_1.density * multiplier });
        return (0, utils_1.isFreeFromWalls)(state, posToCheck)
            ? [toPos, true]
            : [fromPos, false];
    }
    //* We can assume that the two value is opposite
    const oppositeAxis = axis === "x" ? "y" : "x";
    if (alignments[oppositeAxis]) {
        const toPosFloor = tVal - (tVal % density_1.density);
        let toPosCheck = toPosFloor + density_1.density * multiplier;
        if (multiplier === -1)
            toPosCheck += density_1.density;
        if ((0, utils_1.isFreeFromWalls)(state, editPos(toPos, axis, toPosCheck)))
            return [toPos, true];
        let newSpeed;
        if (multiplier === 1) {
            newSpeed = toPosFloor - fVal;
        }
        else {
            newSpeed = toPosFloor - fVal + density_1.density;
        }
        return [editPos(fromPos, axis, fVal + newSpeed), true];
    }
    else {
        const opVal = fromPos[oppositeAxis];
        const direction = blockedDir(opVal);
        let diff = opVal % density_1.density;
        if (direction === 1)
            diff = density_1.density - diff;
        const absSpeed = Math.abs(speed);
        if (diff >= absSpeed)
            return [
                editPos(fromPos, oppositeAxis, opVal + absSpeed * direction),
                true,
            ];
        return [editPos(fromPos, oppositeAxis, opVal + diff * direction), true];
    }
};
const blockedDir = (n) => {
    //* false: decrease
    //* true: increase
    return n % (2 * density_1.density) < density_1.density ? 1 : -1;
};
const editPos = (pos, axis, value) => {
    return Object.assign(Object.assign({}, pos), { [axis]: value });
};
const getAligned = (pos) => {
    return { x: isOnGrid(pos.x), y: isOnGrid(pos.y) };
};
const isOnGrid = (value) => {
    return value % density_1.density === 0;
};
