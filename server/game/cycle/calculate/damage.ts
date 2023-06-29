import { PlayerInfo } from "../../../types/ClientSliceTypes";
import { INVINCIBILITY_TIME } from "../../../sharedConstants/constants";
import { isWithin } from "../utils";
import { sendError } from "../../sendToast";
import { MySocket } from "../../../types/MySocketType";
import { GameInstance } from "../../initializer/gameInstance";
import { BaseCalculator } from "./baseCalculator";

export class DamageCalculator extends BaseCalculator {
  constructor(public state: GameInstance) {
    super(state);

    this.calculate = (client?: MySocket) => {
      const players = this.state.players;
      players.positions.forEach((player) => {
        const playerInfo = this.state.players.infos[player.number];
        if (playerInfo.invincibleUntil >= this.state.time) return;
        if (playerInfo.invincible) {
          playerInfo.invincible = false;
          players.infoChanged = true;
        }
        this.state.explosionFields.all.forEach((field) => {
          if (isWithin(field.pos, player.pos) && !playerInfo.invincible) {
            takeDamage(playerInfo, this.state.time, client as MySocket);
            players.infoChanged = true;
            return;
          }
          if (playerInfo.invincible) return;
        });
      });
    };

    /**
     * Makes the palyer loose health
     * @param player The player to damage
     * @param time The server time
     * @param client The connected socket
     */
    const takeDamage = (player: PlayerInfo, time: number, client: MySocket) => {
      player.health--;
      if (player.health <= 0) {
        handleDeath(player);
        return;
      }
      player.invincible = true;
      player.invincibleUntil = time + INVINCIBILITY_TIME;

      if (this.state.tutorial) {
        sendError(
          client,
          this.state?.tutorialSteps?.game.damage.text as string
        );
      }
    };

    /**
     * Handles a loosing player
     * @param player The player who has game over
     */
    const handleDeath = (player: PlayerInfo) => {
      player.isDead = true;
      this.state.players.directions[player.number] = [];
      this.state.players.bombers[player.number] = false;

      const playerCount = this.state.players.infos.length;
      let dead = 0;
      this.state.players.infos.forEach((info) => {
        if (info.isDead) dead++;
      });
      if (dead < playerCount - 1) return;
      else if (dead === playerCount - 1) {
        this.state.gameOver = true;
        this.state.gameStage = "won";
      } else {
        this.state.gameOver = true;
        this.state.gameStage = "draw";
      }
    };
  }
}
