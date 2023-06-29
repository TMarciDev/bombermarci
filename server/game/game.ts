import shortid from "shortid";
import { ClientRooms, ServerGameInstances } from "../types/GameStateTypes";
import { MySocket } from "../types/MySocketType";
import { CreateRoomBody, JoinRoomBody } from "../types/RoomBodyType";
import { GameInstance } from "./initializer/gameInstance";
import { tutorialSkeleton } from "./tutorial";
import { sendInfo } from "./sendToast";
import { GameObject } from "./gameBaseClasses";

class Game extends GameObject {
  constructor(
    public state = {} as ServerGameInstances,
    public rooms = {} as ClientRooms
  ) {
    super(state, rooms);
  }

  /**
   * Initiates create room operation
   * @param client The connected socket
   * @param args The start game arguments, for example for tutorial game
   */
  createRoom = (client: MySocket, args: CreateRoomBody) => {
    const roomName: string = shortid.generate().slice(0, 3);
    this.state[roomName] = new GameInstance(roomName);
    this.joinRoom(client, { ...args, roomName: roomName });

    if (this.state[roomName].tutorial) {
      this.state[roomName].tutorialSteps = JSON.parse(
        JSON.stringify(tutorialSkeleton)
      );
      sendInfo(
        client,
        this.state[roomName]?.tutorialSteps?.preparation.selectHero
          .text as string
      );
    }
  };

  /**
   * Initiates the joining to a room
   * @param client The connected socket
   * @param args The object containing room name etc
   */
  joinRoom = (client: MySocket, args: JoinRoomBody) => {
    const roomName = args.roomName;
    this.rooms[client.id] = roomName;
    this.state[roomName].joinRoom(client, args);
  };

  /**
   * Handles the color picking event
   * @param client The connected socket
   * @param color The color to be picked
   */
  pickColor = (client: MySocket, color: string) => {
    const roomName = this.rooms[client.id];
    this.state[roomName].pickColor(client, color);
  };

  /**
   * Initiates the room start
   * @param client The connected socket
   */
  startRoom = (client: MySocket) => {
    const roomName = this.rooms[client.id];
    this.state[roomName].startRoom(client);
  };
}

export const game = new Game();
