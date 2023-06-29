import { PlayerInfo, PlayerPos } from "./ClientSliceTypes";

export interface PlayersInterface {
  infos: PlayerInfo[];
  positions: PlayerPos[];
  directions: number[][];
  bombers: boolean[];
  infoChanged: boolean;
}
