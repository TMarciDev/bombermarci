import { DENSITY } from "../../../sharedConstants/density";
import { Position } from "../../../types/BaseTypes";
import { BOMB_TIME } from "../../../sharedConstants/constants";
import { GameInstance } from "../../initializer/gameInstance";
import { BaseCalculator } from "./baseCalculator";

export class BombCalculator extends BaseCalculator {
  constructor(public state: GameInstance) {
    super(state);

    this.calculate = () => {
      this.state.players.bombers.forEach((isBombing, number) => {
        if (!isBombing) return;
        const player = this.state.players.infos[number];
        if (player.bombsDeployed >= player.maxBomb) return;
        if (!deployAround(this.state.players.positions[number].pos, number))
          return;
        player.bombsDeployed++;
      });
    };

    /**
     * Deploys a bomb if the area is free from bombs
     * @param pos The position to plant the bomb
     * @param number The number of the player who planted the bomb
     * @returns True if a bomb was planted succesfully
     */
    const deployAround = (pos: Position, number: number): boolean => {
      const playerInfo = this.state.players.infos[number];
      const bombPos: Position = getRoundedPos(pos);
      if (!isFreeFromBomb(bombPos)) return false;
      this.state.bombs.all.push({
        pos: bombPos,
        playerNumber: number,
        range: playerInfo.bombRange,
        endTime: this.state.time + BOMB_TIME,
      });
      this.state.bombs.toCreate.push({
        pos: bombPos,
        playerNumber: number,
        range: playerInfo.bombRange,
        endTime: this.state.time + BOMB_TIME,
      });
      return true;
    };

    /**
     * Chacks of an area is free from bombs or not
     * @param pos The position to be checked
     * @returns The result of the search. True if it is free.
     */
    const isFreeFromBomb = (pos: Position): boolean => {
      if (
        this.state.bombs.all.find((p) => p.pos.x === pos.x && p.pos.y === pos.y)
      ) {
        return false;
      }
      return true;
    };

    /**
     * Gets the soon to be planted position for the bomb.
     * @param pos The raw position to be rounded
     * @returns The rounded position
     */
    const getRoundedPos = (pos: Position): Position => {
      return { x: roundToDensity(pos.x), y: roundToDensity(pos.y) };
    };

    /**
     * Rounds a number to the density of the map
     * @param n The number to be rounded
     * @returns The rounded number
     */
    const roundToDensity = (n: number): number => {
      const remainder = n % DENSITY;
      return remainder < DENSITY / 2
        ? n - remainder
        : n + (DENSITY - remainder);
    };
  }
}
