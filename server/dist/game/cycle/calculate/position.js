"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionCalculator = void 0;
const density_1 = require("../../../sharedConstants/density");
const controlInpoutTypes_1 = require("../../../sharedConstants/controlInpoutTypes");
const utils_1 = require("../utils");
const baseCalculator_1 = require("./baseCalculator");
class PositionCalculator extends baseCalculator_1.BaseCalculator {
    constructor(state) {
        super(state);
        this.state = state;
        this.calculate = () => {
            this.state.players.directions.forEach((pressedCodes, number) => {
                if (!pressedCodes.length)
                    return;
                handleMovement(number, pressedCodes[0]);
            });
        };
        /**
         * It initiates the getProperPosition with the proper arguments based on the given code
         * @param number The player number to be calculated
         * @param code The direction the player wants to move
         */
        const handleMovement = (number, code) => {
            const players = this.state.players;
            const speed = players.infos[number].speed;
            let playerPlace = players.positions[number].pos;
            let newPlace = {};
            let changed = false;
            switch (code) {
                case controlInpoutTypes_1.ControlEnum.LEFT: {
                    [newPlace, changed] = getProperPosition(playerPlace, -speed, "x");
                    break;
                }
                case controlInpoutTypes_1.ControlEnum.RIGHT: {
                    [newPlace, changed] = getProperPosition(playerPlace, speed, "x");
                    break;
                }
                case controlInpoutTypes_1.ControlEnum.UP: {
                    [newPlace, changed] = getProperPosition(playerPlace, -speed, "y");
                    break;
                }
                case controlInpoutTypes_1.ControlEnum.DOWN: {
                    [newPlace, changed] = getProperPosition(playerPlace, speed, "y");
                    break;
                }
            }
            if (changed) {
                players.positions[number].pos = newPlace;
            }
        };
        /**
         * It calculates the result position on the map
         * @param fromPos The original position the player wants to move on
         * @param speed The players speed, the maximum value to move forward
         * @param axis Sets the function to thinking in horizontal or lateral orientation.
         * @returns The proper position on the map after the movement
         */
        const getProperPosition = (fromPos, speed, axis) => {
            const fVal = fromPos[axis];
            const toPos = editPos(fromPos, axis, fVal + speed);
            const tVal = toPos[axis];
            const alignments = getAligned(fromPos);
            const multiplier = speed > 0 ? 1 : -1;
            if (alignments.x && alignments.y) {
                const posToCheck = Object.assign(Object.assign({}, fromPos), { [axis]: fromPos[axis] + density_1.DENSITY * multiplier });
                return (0, utils_1.isFreeFromWalls)(this.state, posToCheck)
                    ? [toPos, true]
                    : [fromPos, false];
            }
            const oppositeAxis = axis === "x" ? "y" : "x";
            if (alignments[oppositeAxis]) {
                const toPosFloor = tVal - (tVal % density_1.DENSITY);
                let toPosCheck = toPosFloor + density_1.DENSITY * multiplier;
                if (multiplier === -1)
                    toPosCheck += density_1.DENSITY;
                if ((0, utils_1.isFreeFromWalls)(this.state, editPos(toPos, axis, toPosCheck)))
                    return [toPos, true];
                let newSpeed;
                if (multiplier === 1) {
                    newSpeed = toPosFloor - fVal;
                }
                else {
                    newSpeed = toPosFloor - fVal + density_1.DENSITY;
                }
                return [editPos(fromPos, axis, fVal + newSpeed), true];
            }
            else {
                const opVal = fromPos[oppositeAxis];
                const direction = blockedDir(opVal);
                let diff = opVal % density_1.DENSITY;
                if (direction === 1)
                    diff = density_1.DENSITY - diff;
                const absSpeed = Math.abs(speed);
                if (diff >= absSpeed)
                    return [
                        editPos(fromPos, oppositeAxis, opVal + absSpeed * direction),
                        true,
                    ];
                return [editPos(fromPos, oppositeAxis, opVal + diff * direction), true];
            }
        };
        /**
         * It calculates the given position offset and tells the program what path is shorter
         * @param n The position we starting from
         * @returns 1 if we should add to our current position, -1 otherwise
         */
        const blockedDir = (n) => {
            //* false: decrease
            //* true: increase
            return n % (2 * density_1.DENSITY) < density_1.DENSITY ? 1 : -1;
        };
        /**
         * A helperfunction for setting a new walue for a Position by selecting an axis to change
         * @param pos The original position
         * @param axis The axis selector (x or y) to be changed. (And the other stays the same)
         * @param value The value to be set
         * @returns The modified position
         */
        const editPos = (pos, axis, value) => {
            return Object.assign(Object.assign({}, pos), { [axis]: value });
        };
        /**
         * Checks if a position is on the grid or not
         * @param pos The position to check
         * @returns An Alignments object containing the logical values for both axis
         */
        const getAligned = (pos) => {
            return { x: isOnGrid(pos.x), y: isOnGrid(pos.y) };
        };
        /**
         * Checks if a number is on the grid or not. So it divides the value by density and checks if it is 0 or not
         * @param value The number to be checked
         * @returns The result of the assertion
         */
        const isOnGrid = (value) => {
            return value % density_1.DENSITY === 0;
        };
    }
}
exports.PositionCalculator = PositionCalculator;
