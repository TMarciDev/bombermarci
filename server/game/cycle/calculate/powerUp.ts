import { DENSITY } from "../../../sharedConstants/density";
import { MySocket } from "../../../types/MySocketType";
import { GameInstance } from "../../initializer/gameInstance";
import { sendInfo } from "../../sendToast";
import { isWithin } from "../utils";
import { BaseCalculator } from "./baseCalculator";

export class PowerUpCalculator extends BaseCalculator {
  constructor(public state: GameInstance) {
    super(state);

    this.calculate = (client?: MySocket) => {
      const players = this.state.players;
      players.positions.forEach((player) => {
        const playerInfo = this.state.players.infos[player.number];
        this.state.powerUps.all.shown.forEach((p, idx) => {
          if (isWithin(p.pos, player.pos)) {
            addPower(playerInfo.number, idx, client as MySocket);
            return;
          }
        });
      });
    };

    /**
     * It adds a power to a player
     * @param playerNumber The player to be boosted
     * @param powerNumber The power to grant
     * @param client The connected socket
     */
    const addPower = (
      playerNumber: number,
      powerNumber: number,
      client: MySocket
    ) => {
      const collected = this.state.powerUps.all.shown.splice(powerNumber, 1)[0];
      this.state.powerUps.toDelete.push(collected);
      switch (collected.type) {
        case "add_bomb": {
          this.state.players.infos[playerNumber].maxBomb++;
          if (this.state.tutorial) {
            sendInfo(
              client,
              this.state?.tutorialSteps?.game.add.text as string
            );
          }
          break;
        }
        case "add_speed": {
          if (this.state.players.infos[playerNumber].speed >= DENSITY / 2)
            break;
          this.state.players.infos[playerNumber].speed += 1.5;
          if (this.state.tutorial) {
            sendInfo(
              client,
              this.state?.tutorialSteps?.game.speed.text as string
            );
          }
          break;
        }
        case "add_range": {
          this.state.players.infos[playerNumber].bombRange++;
          if (this.state.tutorial) {
            sendInfo(
              client,
              this.state?.tutorialSteps?.game.range.text as string
            );
          }
          break;
        }
      }
    };
  }
}
