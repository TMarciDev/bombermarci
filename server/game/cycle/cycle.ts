import { FRAME_RATE } from "../../sharedConstants/constants";
import { game } from "../game";
import { sendInfo } from "../sendToast";
import { MySocket } from "../../types/MySocketType";
import { GameInstance } from "../initializer/gameInstance";
import { GameHandler } from "../gameBaseClasses";
import { Emitter } from "./emitter";
import { Calculate } from "./calculate/calculate";
import { Input } from "./input";

export class GameCycle extends GameHandler {
  emitter: Emitter;
  input: Input;

  start: (client: MySocket) => void;

  constructor(public state: GameInstance) {
    super(state);
    this.emitter = new Emitter(state);
    const calculate = new Calculate(state);
    let additionalFrames = 0;
    let interval: NodeJS.Timer | null = null;
    this.input = new Input(state);

    this.start = (client: MySocket) => {
      interval = setInterval(() => {
        progress(client);
      }, 1000 / FRAME_RATE);

      if (this.state.tutorial) {
        sendInfo(client, this.state?.tutorialSteps?.game.move.text as string);
      }
    };
    /**
     * The body of the cycle, it calls next if the game is not over
     * @param client
     */
    const progress = (client: MySocket) => {
      const winner = next(client);

      if (winner === null || additionalFrames < FRAME_RATE * 4) {
        this.emitter.sync();
        if (winner !== null) additionalFrames++;
      } else {
        this.emitter.syncEnd(winner, client);
        destroy(this.state.roomName);
        clearInterval(interval as NodeJS.Timer);
      }
    };

    /**
     * It calculates the next frame of the game
     * @param client The connected socket
     * @returns null if there is no winner yet, -1 if draw. It returns the winner player number if there is one
     */
    const next = (client: MySocket) => {
      calculate.all(client);
      const timePassed = 1000 / FRAME_RATE;
      this.state.time += timePassed;
      this.state.syncedAllTime += timePassed;
      if (!this.state.gameOver) return null;
      else if (this.state.gameStage != "draw") {
        let winner = -1;
        this.state.players.infos.forEach((info) => {
          if (!info.isDead) {
            winner = info.number;
          }
        });
        if (winner === -1) {
          console.error("Winner calculation failed");
        }
        return winner;
      } else {
        return -1;
      }
    };

    /**
     * Deletes all the game data
     * @param roomName The room name to be cleared
     */
    const destroy = (roomName: string) => {
      game.state[roomName].connectedClientIds.forEach((id) => {
        delete game.rooms[id];
      });
      delete game.state[roomName];
    };
  }
}
