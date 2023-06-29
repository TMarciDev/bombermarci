import { EXPLOSION_TIME } from "../../../sharedConstants/constants";
import { getBombIndex, isFreeFromWalls, getSoftWallIndex } from "../utils";
import { DENSITY } from "../../../sharedConstants/density";
import { Bomb } from "../../../types/ClientSliceTypes";
import { Position } from "../../../types/BaseTypes";
import { sendInfo } from "../../sendToast";
import { MySocket } from "../../../types/MySocketType";
import { GameInstance } from "../../initializer/gameInstance";
import { BaseCalculator } from "./baseCalculator";

interface CanGo {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export class ExplosionCalculator extends BaseCalculator {
  constructor(public state: GameInstance) {
    super(state);

    this.calculate = (client?: MySocket) => {
      deleteEnded();
      searchTimeIgnited(client as MySocket);
    };

    /**
     * Deletes all the explosions of the state that are over so we don't have to involve those in our calculations
     */
    const deleteEnded = () => {
      this.state.explosionFields.all = this.state.explosionFields.all.filter(
        (explosion) => explosion.endTime > this.state.time
      );
    };

    /**
     * Searches for the bombs that needs to be blown up, and ignites them
     * @param client The connected socket
     */
    const searchTimeIgnited = (client: MySocket) => {
      let exploding: Bomb[] = [];

      this.state.bombs.all.forEach((bomb, idx) => {
        if (bomb.endTime <= this.state.time) {
          exploding.push(this.state.bombs.all.splice(idx, 1)[0]);
        }
      });

      exploding.forEach((bomb) => {
        explodeBomb(bomb, true, client);
      });
    };

    /**
     * Explodes a bomb. It calculates all the four directions to be blown up in the given bomb area
     * @param bomb The bomb to blow up
     * @param timed True if a bomb was exploded by itself
     * @param client The connected client
     */
    const explodeBomb = (
      bomb: Bomb,
      timed: boolean = true,
      client: MySocket
    ) => {
      this.state.bombs.toDelete.push(bomb);
      this.state.players.infos[bomb.playerNumber].bombsDeployed--;
      const time = this.state.time;
      const pos = bomb.pos;

      if (timed) {
        this.state.explosionFields.toCreate.push({
          playerNumber: bomb.playerNumber,
          pos: pos,
          endTime: time + EXPLOSION_TIME,
          timestamp: Date.now() + EXPLOSION_TIME,
        });
        this.state.explosionFields.all.push({
          playerNumber: bomb.playerNumber,
          pos: pos,
          endTime: time + EXPLOSION_TIME,
          timestamp: Date.now() + EXPLOSION_TIME,
        });
      }

      let canGo: CanGo = {
        left: true,
        right: true,
        up: true,
        down: true,
      };

      for (let i = 1; i < bomb.range; ++i) {
        if (!canGo.left && !canGo.right && !canGo.up && !canGo.down) break;
        canGo.left &&
          flowToDirection(
            canGo,
            "left",
            { x: pos.x - i * DENSITY, y: pos.y },
            bomb.playerNumber,
            client
          );
        canGo.right &&
          flowToDirection(
            canGo,
            "right",
            { x: pos.x + i * DENSITY, y: pos.y },
            bomb.playerNumber,
            client
          );
        canGo.up &&
          flowToDirection(
            canGo,
            "up",
            { x: pos.x, y: pos.y - i * DENSITY },
            bomb.playerNumber,
            client
          );
        canGo.down &&
          flowToDirection(
            canGo,
            "down",
            { x: pos.x, y: pos.y + i * DENSITY },
            bomb.playerNumber,
            client
          );
      }

      if (this.state.tutorial && !this.state?.tutorialSteps?.game.win.done) {
        sendInfo(client, this.state?.tutorialSteps?.game.win.text as string);
        this.state.tutorialSteps!.game.win.done = true;
      }
    };

    /**
     * Calculates the bomb flow direction and evaulates if there is something in the way or not
     * @param canGo The object that holds the direction possibilities
     * @param dir The direction to flow to. Hitting an obsticle will cause setting the canGo objects direction false
     * @param posToCheck The position to be checked for obsticles or bombs
     * @param playerNumber The player number of the explosion
     * @param client The connected client
     */
    const flowToDirection = (
      canGo: CanGo,
      dir: keyof CanGo,
      posToCheck: Position,
      playerNumber: number,
      client: MySocket
    ) => {
      if (!isFreeFromWalls(this.state, posToCheck)) {
        canGo[dir] = false;
        removeWall(getSoftWallIndex(this.state, posToCheck));
      } else {
        this.state.explosionFields.toCreate.push({
          playerNumber: playerNumber,
          pos: posToCheck,
          endTime: this.state.time + EXPLOSION_TIME,
          timestamp: Date.now() + EXPLOSION_TIME,
        });
        this.state.explosionFields.all.push({
          playerNumber: playerNumber,
          pos: posToCheck,
          endTime: this.state.time + EXPLOSION_TIME,
          timestamp: Date.now() + EXPLOSION_TIME,
        });
      }
      const newBombIndex = getBombIndex(this.state, posToCheck);
      if (newBombIndex >= 0) {
        canGo[dir] = false;
        explodeBomb(
          this.state.bombs.all.splice(newBombIndex, 1)[0],
          false,
          client
        );
      }
    };

    /**
     * It handles removing a wall upon explosion
     * @param index The index of teh wall to be romoved
     */
    const removeWall = (index: number) => {
      if (index < 0) return;
      const toDelete = this.state.walls.softs.all.splice(index, 1)[0];

      this.state.walls.softs.toDelete.push(toDelete);
      powerUpReveal(toDelete.pos);
    };

    /**
     * It reveals a power up if it became visble under a wall
     * @param pos The position to be revelaed at
     */
    const powerUpReveal = (pos: Position) => {
      const powerUps = this.state.powerUps.all;

      const pwIdx = powerUps.hidden.findIndex(
        (p) => p.pos.x === pos.x && p.pos.y === pos.y
      );

      if (pwIdx < 0) return;
      const toCreate = powerUps.hidden.splice(pwIdx, 1)[0];
      powerUps.shown.push(toCreate);
      this.state.powerUps.toCreate.push(toCreate);
    };
  }
}
