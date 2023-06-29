import { CanvasObject } from "./BaseTypes";
export interface MapInfo {
  width: number;
  height: number;
}

export interface PrepInfos {
  isAdmin: boolean;
  number: number;
  roomName: string;
  stage: string;
  playerInfos: PlayerInfo[];
  availableColors: string[];
  serverTimestamp: number;
}

export interface StartInfos {
  mapInfo: MapInfo;
  hardWalls: HardWall[];
}

export interface PlayerInfo {
  number: number;
  isAdmin: boolean;
  name: string;
  color: string;
  health: number;
  isDead: boolean;
  speed: number;
  maxBomb: number;
  bombRange: number;
  bombsDeployed: number;
  invincible: boolean;
  invincibleUntil: number;
}

export interface RemovePlayerHealth {
  number: number;
}

export interface PlayerPos extends CanvasObject {
  number: number;
}

export interface HardWall extends CanvasObject {}
export interface SoftWall extends CanvasObject {}
export interface Bomb extends CanvasObject {
  playerNumber: number;
  range: number;
  endTime: number;
}
export interface ExplosionField extends CanvasObject {
  playerNumber: number;
  endTime: number;
  timestamp: number;
}

export interface ExplosionFields {
  time: number;
  timeInfo: number;
  newExplosions: ExplosionField[];
}

export interface PowerUp extends CanvasObject {
  type: string;
}
