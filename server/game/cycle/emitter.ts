import { myServer } from "../../server";
import { RESYNC } from "../../sharedConstants/constants";
import { ServerEvents } from "../../socketEvents/serverEvents";
import { GameHandler } from "../gameBaseClasses";
import { MySocket } from "../../types/MySocketType";
import { GameInstance } from "../initializer/gameInstance";
import { sendInfo } from "../sendToast";

export class Emitter extends GameHandler {
  sync: () => void;
  syncEnd: (winner: number, client: MySocket) => void;

  constructor(public state: GameInstance) {
    super(state);
    this.sync = () => {
      if (this.state.syncedAllTime < RESYNC) {
        syncPartial();
      } else {
        syncAll();
        this.state.syncedAllTime = 0;
      }
      syncAlways();
    };

    /**
     * The function that should be run on every iteration
     */
    const syncAlways = () => {
      syncExplosion();

      myServer.io.sockets
        .in(this.state.roomName)
        .emit(ServerEvents.allPlayersPos, {
          result: this.state.players.positions,
        });
    };

    /**
     * The function that sends only the new info to the client
     */
    const syncPartial = () => {
      const softWalls = this.state.walls.softs;
      if (softWalls.toDelete.length > 0) {
        myServer.io.sockets
          .in(this.state.roomName)
          .emit(ServerEvents.removeSoftWalls, {
            result: softWalls.toDelete,
          });
        softWalls.toDelete = [];
      }

      const bombs = this.state.bombs;
      if (bombs.toCreate.length > 0) {
        myServer.io.sockets
          .in(this.state.roomName)
          .emit(ServerEvents.addBombs, {
            result: bombs.toCreate,
          });
        bombs.toCreate = [];
      }
      if (bombs.toDelete.length > 0) {
        myServer.io.sockets
          .in(this.state.roomName)
          .emit(ServerEvents.removeBombs, {
            result: bombs.toDelete,
          });
        bombs.toDelete = [];
      }
      if (this.state.players.infoChanged) {
        myServer.io.sockets
          .in(this.state.roomName)
          .emit(ServerEvents.allPlayerStats, {
            result: this.state.players.infos,
          });
        this.state.players.infoChanged = false;
      }

      const powers = this.state.powerUps;
      if (powers.toCreate.length > 0) {
        myServer.io.sockets
          .in(this.state.roomName)
          .emit(ServerEvents.addPowerUps, {
            result: powers.toCreate,
          });
        powers.toCreate = [];
      }
      if (powers.toDelete.length > 0) {
        myServer.io.sockets
          .in(this.state.roomName)
          .emit(ServerEvents.removePowerUps, {
            result: powers.toDelete,
          });
        powers.toDelete = [];
      }
    };

    /**
     * Sends the new explosions to the client
     */
    const syncExplosion = () => {
      const fire = this.state.explosionFields;
      if (fire.toCreate.length > 0) {
        myServer.io.sockets
          .in(this.state.roomName)
          .emit(ServerEvents.addExplosionFields, {
            result: {
              time: this.state.time,
              timeInfo: Date.now(),
              newExplosions: fire.toCreate,
            },
          });
        fire.toCreate = [];
      }
    };

    /**
     * Refreshes all the clients by sending all the game data, not just the new parts
     */
    const syncAll = () => {
      myServer.io.sockets
        .in(this.state.roomName)
        .emit(ServerEvents.allSoftWalls, {
          result: this.state.walls.softs.all,
        });
      this.state.walls.softs.toDelete = [];
      myServer.io.sockets.in(this.state.roomName).emit(ServerEvents.allBombs, {
        result: this.state.bombs.all,
      });
      this.state.bombs.toDelete = [];
      myServer.io.sockets
        .in(this.state.roomName)
        .emit(ServerEvents.allPlayerStats, {
          result: this.state.players.infos,
        });
      this.state.players.infoChanged = false;

      myServer.io.sockets
        .in(this.state.roomName)
        .emit(ServerEvents.allPowerUps, {
          result: this.state.powerUps.all.shown,
        });
      this.state.powerUps.toCreate = [];
      this.state.powerUps.toDelete = [];
    };

    this.syncEnd = (winner: number, client: MySocket) => {
      myServer.io.sockets.in(this.state.roomName).emit(ServerEvents.gameOver, {
        result: winner,
      });
      if (this.state.tutorial) {
        sendInfo(
          client,
          this.state?.tutorialSteps?.game.gameOver.text as string
        );
      }
    };
  }
}
