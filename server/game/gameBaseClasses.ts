import { GameInstance } from "./initializer/gameInstance";
import { ClientRooms, ServerGameInstances } from "../types/GameStateTypes";
import { tutorialSkeleton } from "./tutorial";
import {
  Bomb,
  ExplosionField,
  HardWall,
  MapInfo,
  PowerUp,
  SoftWall,
} from "../types/ClientSliceTypes";
import { PlayersInterface } from "../types/ServerGameType";

export class GameHandler {
  constructor(public state: GameInstance) {}
}

export class GameObject {
  constructor(public state: ServerGameInstances, public rooms: ClientRooms) {}
}

export class ServerGameObject {
  constructor(
    public roomName: string,
    public time: number,
    public gameStage: string,
    public gameOver: boolean,
    public mapInfo: MapInfo,
    public maxPlayers: number,
    public availableColors: string[],
    public freePlayerNumbers: number[],
    public gameLoadedClients: string[],
    public syncedAllTime: number,
    public players: PlayersInterface,
    public walls: Walls,
    public bombs: Rewriteable<Bomb>,
    public explosionFields: Creatable<ExplosionField>,
    public powerUps: RewriteablePartiallyShown<PowerUp>,
    public connectedClientIds: string[],
    public tutorial: boolean,
    public tutorialSteps?: typeof tutorialSkeleton
  ) {}
}

interface Walls {
  hards: HardWall[];
  softs: Destroyable<SoftWall>;
}

interface Mulitple<T> {
  all: T[];
}

interface Destroyable<T> extends Mulitple<T> {
  toDelete: T[];
}
interface Creatable<T> extends Mulitple<T> {
  toCreate: T[];
}

interface Rewriteable<T> extends Destroyable<T> {
  toCreate: T[];
}

interface RewriteablePartiallyShown<T> extends Omit<Rewriteable<T>, "all"> {
  all: BothType<T>;
}

interface BothType<T> {
  hidden: T[];
  shown: T[];
}
