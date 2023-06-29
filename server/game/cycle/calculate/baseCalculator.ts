import { MySocket } from "../../../types/MySocketType";
import { GameHandler } from "../../gameBaseClasses";
import { GameInstance } from "../../initializer/gameInstance";

export class BaseCalculator extends GameHandler {
  constructor(public state: GameInstance) {
    super(state);
  }

  /**
   * The base calculator function that will be inherited
   * @param client The connected socket if there is any
   */
  calculate = (client?: MySocket) => {};
}
