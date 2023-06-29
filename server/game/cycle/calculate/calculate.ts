import { GameHandler } from "../../gameBaseClasses";
import { MySocket } from "../../../types/MySocketType";
import { GameInstance } from "../../initializer/gameInstance";
import { BombCalculator } from "./bomb";
import { DamageCalculator } from "./damage";
import { ExplosionCalculator } from "./explosion";
import { PowerUpCalculator } from "./powerUp";
import { PositionCalculator } from "./position";

export class Calculate extends GameHandler {
  all: (client: MySocket) => void;

  constructor(public state: GameInstance) {
    super(state);
    const position = new PositionCalculator(state);
    const bomb = new BombCalculator(state);
    const explosion = new ExplosionCalculator(state);
    const damage = new DamageCalculator(state);
    const powerUp = new PowerUpCalculator(state);

    this.all = (client: MySocket) => {
      position.calculate();
      bomb.calculate();
      explosion.calculate(client);
      damage.calculate(client);
      powerUp.calculate(client);
    };
  }
}
