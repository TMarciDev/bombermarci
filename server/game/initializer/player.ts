import { PLAYER_CREATE_PLACES } from "./playerPlaces";
import { PlayerPos } from "../../types/ClientSliceTypes";
import { PlayerInfo } from "../../types/ClientSliceTypes";
import { PLAYER_HEALTH, PLAYER_SPEED } from "../../sharedConstants/constants";
import { Position } from "../../types/BaseTypes";
import { PlayersInterface } from "../../types/ServerGameType";

export class PlayerStats implements PlayerInfo {
  constructor(
    public number: number,
    public name: string,
    public color = "" as string,
    public isAdmin = false as boolean,
    public isDead = false as boolean,
    public health = PLAYER_HEALTH as number,
    public bombRange = 2 as number,
    public speed = PLAYER_SPEED as number,
    public maxBomb = 1 as number,
    public bombsDeployed = 0 as number,
    public invincible = false as boolean,
    public invincibleUntil = 0 as number
  ) {
    this.isAdmin = this.number === 0;
  }
}

export class PlayerPositions implements PlayerPos {
  constructor(public number: number, public pos = {} as Position) {
    this.pos = PLAYER_CREATE_PLACES[this.number].pos;
  }
}

export class Players implements PlayersInterface {
  constructor(
    public infos = [] as PlayerInfo[],
    public positions = [] as PlayerPos[],
    public directions = [[], [], [], []] as number[][],
    public bombers = [] as boolean[],
    public infoChanged = false as boolean
  ) {}
}
