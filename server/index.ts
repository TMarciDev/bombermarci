import { CreateRoomBody, JoinRoomBody } from "./types/RoomBodyType";
import { ServerEvents } from "./socketEvents/serverEvents";
import { MySocket } from "./types/MySocketType";

import { ClientEvents } from "./socketEvents/clientEvents";
import { game } from "./game/game";
import { sendError, sendInfo } from "./game/sendToast";
import { StartInfos } from "./types/ClientSliceTypes";
import { GameCycle } from "./game/cycle/cycle";

import { isValidClient } from "./game/utils";
import { tutorialSkeleton } from "./game/tutorial";
import { myServer } from "./server";

myServer.io.on("connection", (client: MySocket) => {
  let gameCycle: GameCycle | null = null;

  sendInfo(client, tutorialSkeleton.menu.selectTutorial.text);
  let roomName = "";
  console.log(`User connected: ${client.id}`);
  client.on(ClientEvents.createRoom, (args: CreateRoomBody, callback) => {
    callback({ status: "ok" });
    game.createRoom(client, args);
    roomName = game.rooms[client.id];
  });

  client.on(ClientEvents.joinRoom, (args: JoinRoomBody, callback) => {
    let success = false;
    if (args.roomName in game.state) {
      if (game.state[args.roomName].gameStage === "preparation") {
        if (game.state[args.roomName].freePlayerNumbers.length > 0) {
          callback({ status: "ok" });
          game.joinRoom(client, args);
          roomName = args.roomName;
          success = true;
        } else {
          sendError(client, "ERROR: room is full!");
        }
      } else {
        sendError(client, "ERROR: game already started!");
      }
    } else {
      sendError(client, "ERROR: no such room!");
    }
    if (!success) callback({ status: "failed" });
  });

  client.on(ClientEvents.pickColor, (color: string) => {
    if (!isValidClient(client)) return;
    game.pickColor(client, color);
  });

  client.on(ClientEvents.startGameRoom, () => {
    if (!isValidClient(client)) return;
    game.startRoom(client);
  });

  client.on(ClientEvents.pageLoaded, (page: string, callback) => {
    if (!isValidClient(client)) return;
    if (page !== "game") return;
    const currentState = game.state[roomName];
    if (!currentState) return;
    const startInfo: StartInfos = {
      mapInfo: currentState.mapInfo,
      hardWalls: currentState.walls.hards,
    };

    const loadedClients = currentState.gameLoadedClients;

    if (!loadedClients.includes(client.id)) {
      loadedClients.push(client.id);
    } else {
      //sendError(client, "You are already connected.");
    }
    if (
      loadedClients.length + currentState.freePlayerNumbers.length >=
      currentState.maxPlayers
    ) {
      myServer.io.sockets
        .in(roomName)
        .emit(ServerEvents.gameStartInfo, { result: startInfo });

      // * Az összes kliens sikeresen betöltötte a játékot
      gameCycle = new GameCycle(game.state[roomName]);
      gameCycle.start(client);
    }
    callback({ status: "ok" });
  });

  client.on(ClientEvents.actionPressed, (input: number) => {
    if (!isValidClient(client)) return;
    gameCycle?.input.new(input, "pressed", client);
  });

  client.on(ClientEvents.actionReleased, (input: number) => {
    if (!isValidClient(client)) return;
    gameCycle?.input.new(input, "released", client);
  });
});
