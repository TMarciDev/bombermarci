"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BombCalculator = void 0;
const density_1 = require("../../../sharedConstants/density");
const constants_1 = require("../../../sharedConstants/constants");
const baseCalculator_1 = require("./baseCalculator");
class BombCalculator extends baseCalculator_1.BaseCalculator {
    constructor(state) {
        super(state);
        this.state = state;
        this.calculate = () => {
            this.state.players.bombers.forEach((isBombing, number) => {
                if (!isBombing)
                    return;
                const player = this.state.players.infos[number];
                if (player.bombsDeployed >= player.maxBomb)
                    return;
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
        const deployAround = (pos, number) => {
            const playerInfo = this.state.players.infos[number];
            const bombPos = getRoundedPos(pos);
            if (!isFreeFromBomb(bombPos))
                return false;
            this.state.bombs.all.push({
                pos: bombPos,
                playerNumber: number,
                range: playerInfo.bombRange,
                endTime: this.state.time + constants_1.BOMB_TIME,
            });
            this.state.bombs.toCreate.push({
                pos: bombPos,
                playerNumber: number,
                range: playerInfo.bombRange,
                endTime: this.state.time + constants_1.BOMB_TIME,
            });
            return true;
        };
        /**
         * Chacks of an area is free from bombs or not
         * @param pos The position to be checked
         * @returns The result of the search. True if it is free.
         */
        const isFreeFromBomb = (pos) => {
            if (this.state.bombs.all.find((p) => p.pos.x === pos.x && p.pos.y === pos.y)) {
                return false;
            }
            return true;
        };
        /**
         * Gets the soon to be planted position for the bomb.
         * @param pos The raw position to be rounded
         * @returns The rounded position
         */
        const getRoundedPos = (pos) => {
            return { x: roundToDensity(pos.x), y: roundToDensity(pos.y) };
        };
        /**
         * Rounds a number to the density of the map
         * @param n The number to be rounded
         * @returns The rounded number
         */
        const roundToDensity = (n) => {
            const remainder = n % density_1.DENSITY;
            return remainder < density_1.DENSITY / 2
                ? n - remainder
                : n + (density_1.DENSITY - remainder);
        };
    }
}
exports.BombCalculator = BombCalculator;
