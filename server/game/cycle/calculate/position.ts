import { DENSITY } from "../../../sharedConstants/density";
import { ControlEnum } from "../../../sharedConstants/controlInpoutTypes";
import { Position } from "../../../types/BaseTypes";
import { isFreeFromWalls } from "../utils";
import { GameInstance } from "../../initializer/gameInstance";
import { BaseCalculator } from "./baseCalculator";
interface Alignments {
  x: boolean;
  y: boolean;
}

export class PositionCalculator extends BaseCalculator {
  constructor(public state: GameInstance) {
    super(state);

    this.calculate = () => {
      this.state.players.directions.forEach((pressedCodes, number) => {
        if (!pressedCodes.length) return;
        handleMovement(number, pressedCodes[0]);
      });
    };

    /**
     * It initiates the getProperPosition with the proper arguments based on the given code
     * @param number The player number to be calculated
     * @param code The direction the player wants to move
     */
    const handleMovement = (number: number, code: number) => {
      const players = this.state.players;
      const speed = players.infos[number].speed;
      let playerPlace = players.positions[number].pos;

      let newPlace: Position = {} as Position;
      let changed = false;

      switch (code) {
        case ControlEnum.LEFT: {
          [newPlace, changed] = getProperPosition(playerPlace, -speed, "x");
          break;
        }
        case ControlEnum.RIGHT: {
          [newPlace, changed] = getProperPosition(playerPlace, speed, "x");
          break;
        }
        case ControlEnum.UP: {
          [newPlace, changed] = getProperPosition(playerPlace, -speed, "y");
          break;
        }
        case ControlEnum.DOWN: {
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
    const getProperPosition = (
      fromPos: Position,
      speed: number,
      axis: "x" | "y"
    ): [Position, boolean] => {
      const fVal = fromPos[axis];
      const toPos = editPos(fromPos, axis, fVal + speed);
      const tVal = toPos[axis];
      const alignments = getAligned(fromPos);
      const multiplier = speed > 0 ? 1 : -1;

      if (alignments.x && alignments.y) {
        const posToCheck = {
          ...fromPos,
          [axis]: fromPos[axis] + DENSITY * multiplier,
        };
        return isFreeFromWalls(this.state, posToCheck)
          ? [toPos, true]
          : [fromPos, false];
      }

      const oppositeAxis = axis === "x" ? "y" : "x";
      if (alignments[oppositeAxis]) {
        const toPosFloor = tVal - (tVal % DENSITY);
        let toPosCheck = toPosFloor + DENSITY * multiplier;
        if (multiplier === -1) toPosCheck += DENSITY;
        if (isFreeFromWalls(this.state, editPos(toPos, axis, toPosCheck)))
          return [toPos, true];

        let newSpeed;
        if (multiplier === 1) {
          newSpeed = toPosFloor - fVal;
        } else {
          newSpeed = toPosFloor - fVal + DENSITY;
        }
        return [editPos(fromPos, axis, fVal + newSpeed), true];
      } else {
        const opVal = fromPos[oppositeAxis];
        const direction = blockedDir(opVal);
        let diff = opVal % DENSITY;
        if (direction === 1) diff = DENSITY - diff;
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
    const blockedDir = (n: number): number => {
      //* false: decrease
      //* true: increase
      return n % (2 * DENSITY) < DENSITY ? 1 : -1;
    };

    /**
     * A helperfunction for setting a new walue for a Position by selecting an axis to change
     * @param pos The original position
     * @param axis The axis selector (x or y) to be changed. (And the other stays the same)
     * @param value The value to be set
     * @returns The modified position
     */
    const editPos = (
      pos: Position,
      axis: "x" | "y",
      value: number
    ): Position => {
      return {
        ...pos,
        [axis]: value,
      };
    };

    /**
     * Checks if a position is on the grid or not
     * @param pos The position to check
     * @returns An Alignments object containing the logical values for both axis
     */
    const getAligned = (pos: Position): Alignments => {
      return { x: isOnGrid(pos.x), y: isOnGrid(pos.y) };
    };

    /**
     * Checks if a number is on the grid or not. So it divides the value by density and checks if it is 0 or not
     * @param value The number to be checked
     * @returns The result of the assertion
     */
    const isOnGrid = (value: number): boolean => {
      return value % DENSITY === 0;
    };
  }
}
