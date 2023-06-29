import { GameInstance } from "../game/initializer/gameInstance";

export interface ServerGameInstances {
  [roomName: string]: GameInstance;
}
export interface ClientRooms {
  [clientId: string]: string; //* roomName
}
