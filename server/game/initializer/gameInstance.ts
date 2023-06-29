import {
  Bomb,
  ExplosionField,
  HardWall,
  PowerUp,
  PrepInfos,
  SoftWall,
} from "../../types/ClientSliceTypes";
import { ALONE_START, RESYNC } from "../../sharedConstants/constants";
import { PLAYER_CREATE_PLACES, PLAYER_SPAWN_AREA } from "./playerPlaces";
import { DENSITY } from "../../sharedConstants/density";
import { PlayerPositions, PlayerStats, Players } from "./player";
import { CanvasObject } from "../../types/BaseTypes";
import { MySocket } from "../../types/MySocketType";
import { JoinRoomBody } from "../../types/RoomBodyType";
import { tutorialSkeleton } from "../tutorial";
import { ControlEnum } from "../../sharedConstants/controlInpoutTypes";
import { ClientEvents } from "../../socketEvents/clientEvents";
import { ServerEvents } from "../../socketEvents/serverEvents";
import { myServer } from "../../server";
import { sendError, sendInfo } from "../sendToast";
import { ServerGameObject } from "../gameBaseClasses";

export class GameInstance extends ServerGameObject {
  generateHardWalls: () => HardWall[];
  generateSoftWalls: (exclude: CanvasObject[], options: any) => SoftWall[];
  generatePowerUps: (places: CanvasObject[], options: any) => PowerUp[];

  constructor(
    public roomName: string,
    public time = 0 as number,
    public gameStage = "preparation" as string,
    public gameOver = false as boolean,
    public mapInfo = { width: 15 * DENSITY, height: 15 * DENSITY },
    public maxPlayers = 4 as number,
    public freePlayerNumbers = [0, 1, 2, 3] as number[],
    public gameLoadedClients = [] as string[],
    public availableColors = [
      "blue",
      "brown",
      "green",
      "orange",
      "pink",
      "red",
      "teal",
      "white",
      "yellow",
    ] as string[],
    public syncedAllTime = RESYNC as number,
    public players = new Players(),
    public walls = {
      hards: [] as HardWall[],
      softs: {
        all: [] as SoftWall[],
        toDelete: [] as SoftWall[],
      },
    },
    public bombs = {
      all: [] as Bomb[],
      toCreate: [] as Bomb[],
      toDelete: [] as Bomb[],
    },
    public explosionFields = {
      all: [] as ExplosionField[],
      toCreate: [] as ExplosionField[],
    },
    public powerUps = {
      all: {
        shown: [] as PowerUp[],
        hidden: [] as PowerUp[],
      },
      toCreate: [] as PowerUp[],
      toDelete: [] as PowerUp[],
    },
    public connectedClientIds = [] as string[],
    public tutorial = false as boolean,
    public tutorialSteps = {} as typeof tutorialSkeleton
  ) {
    super(
      roomName,
      time,
      gameStage,
      gameOver,
      mapInfo,
      maxPlayers,
      availableColors,
      freePlayerNumbers,
      gameLoadedClients,
      syncedAllTime,
      players,
      walls,
      bombs,
      explosionFields,
      powerUps,
      connectedClientIds,
      tutorial,
      tutorialSteps
    );

    /**
     * A function wrapper to evaluate a function on every map block
     * @param coreFunc The function to run on every iteration
     */
    const iterateOnMap = (coreFunc: (x: number, y: number) => void) => {
      for (let y = 0; y < mapInfo.height; y += DENSITY) {
        for (let x = 0; x < mapInfo.width; x += DENSITY) {
          coreFunc(x, y);
        }
      }
    };

    this.generateHardWalls = (): HardWall[] => {
      let hardWalls: HardWall[] = [];

      const addHardWall = (x: number, y: number) => {
        if (
          x === 0 ||
          x === mapInfo.width - DENSITY ||
          y === 0 ||
          y === mapInfo.height - DENSITY ||
          (x % (2 * DENSITY) === 0 && y % (2 * DENSITY) === 0)
        ) {
          hardWalls.push({ pos: { x: x, y: y } });
        }
      };

      iterateOnMap(addHardWall);
      return hardWalls;
    };

    this.generateSoftWalls = (
      exclude: CanvasObject[],
      options: any
    ): SoftWall[] => {
      let softWalls: SoftWall[] = [];

      const addSoftWall = (x: number, y: number) => {
        const softWallObj = { pos: { x: x, y: y } };
        if (
          Math.random() < options.probability &&
          !exclude.find(
            (e) =>
              e.pos.x === softWallObj.pos.x && e.pos.y === softWallObj.pos.y
          )
        ) {
          softWalls.push(softWallObj);
        }
      };
      iterateOnMap(addSoftWall);
      return softWalls;
    };

    this.generatePowerUps = (
      places: CanvasObject[],
      options: any
    ): PowerUp[] => {
      const POWER_UP_TYPES = {
        add_bomb: 0,
        add_speed: 1,
        add_range: 2,
      };
      let powerUps: PowerUp[] = [];
      const keys = Object.keys(POWER_UP_TYPES);

      const addPowerUp = (x: number, y: number) => {
        const randomKey = keys[(keys.length * Math.random()) << 0];
        const powerUpObj: PowerUp = { pos: { x: x, y: y }, type: randomKey };
        if (
          Math.random() < options.probability &&
          places.find(
            (e) => e.pos.x === powerUpObj.pos.x && e.pos.y === powerUpObj.pos.y
          )
        ) {
          powerUps.push(powerUpObj);
        }
      };

      iterateOnMap(addPowerUp);
      return powerUps;
    };

    this.walls.hards = this.generateHardWalls();
    this.walls.softs.all = this.generateSoftWalls(
      [...this.walls.hards, ...PLAYER_CREATE_PLACES, ...PLAYER_SPAWN_AREA],
      {
        probability: 0.9,
      }
    );
    this.powerUps.all.hidden = this.generatePowerUps(this.walls.softs.all, {
      probability: 0.25,
    });
  }

  /**
   * Initiates the joining to a room
   * @param client The connected socket
   * @param args The object containing room name etc
   */
  joinRoom = (client: MySocket, args: JoinRoomBody) => {
    client.join(this.roomName);
    this.connectedClientIds.push(client.id);

    const playerNumber = this.freePlayerNumbers.shift();
    client.number = playerNumber;

    const newPlayerInfo = new PlayerStats(playerNumber as number, args.name);

    this.players.infos.push(newPlayerInfo);
    this.players.positions.push(new PlayerPositions(playerNumber as number));

    if (args.test) {
      const testPlayerNumber = this.freePlayerNumbers.shift();

      this.availableColors = ["green", "pink", "teal"];
      this.players.infos.push(
        new PlayerStats(testPlayerNumber as number, "Bomber Dummy", "yellow")
      );
      this.players.positions.push(
        new PlayerPositions(testPlayerNumber as number)
      );
      this.gameLoadedClients.push("dummy");
      this.players.infos[0].health = 5;
      this.players.infos[1].health = 1;
      this.tutorial = true;
      this.players.directions[1] = [ControlEnum.LEFT];
      // this.players.positions[1] = {
      //   number: 1,
      //   pos: { x: 2 * DENSITY, y: 1 * DENSITY },
      // };
    }

    const clientPrepInfos: PrepInfos = {
      isAdmin: playerNumber === 0,
      number: newPlayerInfo.number,
      roomName: this.roomName,
      stage: "preparation",
      playerInfos: this.players.infos,
      availableColors: this.availableColors,
      serverTimestamp: Date.now(),
    };
    client.on(ClientEvents.pageLoaded, (page) => {
      if (page === "preparation") {
        //* Only current client gets it
        client.emit(ServerEvents.gamePrepInfo, { result: clientPrepInfos });
      }
    });

    //* All room members except the current client gets it
    myServer.io.sockets
      .to(this.roomName)
      .emit(ServerEvents.addJoinedPlayer, { result: newPlayerInfo });
  };

  /**
   * Handles the color picking event
   * @param client The connected socket
   * @param color The color to be picked
   */
  pickColor = (client: MySocket, color: string) => {
    const availableColors = this.availableColors;
    if (!availableColors.includes(color)) return;
    this.availableColors = availableColors.filter((item) => item !== color);
    const prevColor = this.players.infos[client.number as number].color;
    this.availableColors.push(prevColor);
    this.players.infos[client.number as number].color = color;

    myServer.io.sockets.in(this.roomName).emit(ServerEvents.availableColors, {
      result: this.availableColors,
    });

    myServer.io.sockets
      .in(this.roomName)
      .emit(ServerEvents.updateJoinedPlayers, {
        result: this.players.infos,
      });

    if (this.tutorial) {
      sendInfo(
        client,
        this?.tutorialSteps?.preparation.startGame.text as string
      );
    }
  };
  /**
   * Initiates the room start if all the values are set correctly
   * @param client The connected socket
   */
  startRoom = (client: MySocket) => {
    let allPicked = true;
    this.players.infos.forEach((p) => {
      if (p.color === "") {
        allPicked = false;
        return;
      }
    });
    if (!allPicked) {
      sendError(client, "ERROR: someone didn't pick hero");
      return;
    }
    if (this.players.infos.length === 1 && !ALONE_START) {
      sendError(client, "ERROR: you can't start alone");
      return;
    }

    //* All room members recive it
    myServer.io.sockets
      .in(this.roomName)
      .emit(ServerEvents.changeStage, { result: "game" });
  };
}
