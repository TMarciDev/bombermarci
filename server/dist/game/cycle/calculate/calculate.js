"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calculate = void 0;
const gameBaseClasses_1 = require("../../gameBaseClasses");
const bomb_1 = require("./bomb");
const damage_1 = require("./damage");
const explosion_1 = require("./explosion");
const powerUp_1 = require("./powerUp");
const position_1 = require("./position");
class Calculate extends gameBaseClasses_1.GameHandler {
    constructor(state) {
        super(state);
        this.state = state;
        const position = new position_1.PositionCalculator(state);
        const bomb = new bomb_1.BombCalculator(state);
        const explosion = new explosion_1.ExplosionCalculator(state);
        const damage = new damage_1.DamageCalculator(state);
        const powerUp = new powerUp_1.PowerUpCalculator(state);
        this.all = (client) => {
            position.calculate();
            bomb.calculate();
            explosion.calculate(client);
            damage.calculate(client);
            powerUp.calculate(client);
        };
    }
}
exports.Calculate = Calculate;
