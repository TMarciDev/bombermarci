"use strict";
// import { CreateRoomBody, JoinRoomBody } from "../types/RoomBodyType";
// import { ClientEvents } from "../socketEvents/clientEvents";
// import { PlayerPositions, PlayerStats } from "./initializer/player";
// import shortid from "shortid";
// import { MySocket } from "../types/MySocketType";
// import { game } from "./game";
// import { ServerEvents } from "../socketEvents/serverEvents";
// import { PrepInfos } from "../types/ClientSliceTypes";
// import { sendError, sendInfo } from "./sendToast";
// import { ALONE_START } from "../sharedConstants/constants";
// import { ControlEnum } from "../sharedConstants/controlInpoutTypes";
// import { tutorialSkeleton } from "./tutorial";
// import { GameInstance } from "./initializer/gameInstance";
// import { myServer } from "../server";
// export const createRoom = (client: MySocket, args: CreateRoomBody) => {
//   const roomName: string = shortid.generate().slice(0, 3);
//   game.state[roomName] = new GameInstance();
//   joinRoom(client, { ...args, roomName: roomName });
//   if (game.state[roomName].tutorial) {
//     game.state[roomName].tutorialSteps = JSON.parse(
//       JSON.stringify(tutorialSkeleton)
//     );
//     sendInfo(
//       client,
//       game.state[roomName]?.tutorialSteps?.preparation.selectHero.text as string
//     );
//   }
// };
// export const joinRoom = (client: MySocket, args: JoinRoomBody) => {
//   const roomName = args.roomName;
//   game.rooms[client.id] = roomName;
//   client.join(roomName);
//   game.state[roomName].connectedClientIds.push(client.id);
//   const playerNumber = game.state[roomName].freePlayerNumbers.shift();
//   client.number = playerNumber;
//   const newPlayerInfo = new PlayerStats(playerNumber as number, args.name);
//   game.state[roomName].players.infos.push(newPlayerInfo);
//   game.state[roomName].players.positions.push(
//     new PlayerPositions(playerNumber as number)
//   );
//   if (args.test) {
//     const testPlayerNumber = game.state[roomName].freePlayerNumbers.shift();
//     game.state[roomName].availableColors = ["green", "pink", "teal"];
//     game.state[roomName].players.infos.push(
//       new PlayerStats(testPlayerNumber as number, "Bomber Dummy", "yellow")
//     );
//     game.state[roomName].players.positions.push(
//       new PlayerPositions(testPlayerNumber as number)
//     );
//     game.state[roomName].gameLoadedClients.push("dummy");
//     game.state[roomName].players.infos[0].health = 5;
//     game.state[roomName].players.infos[1].health = 1;
//     game.state[roomName].tutorial = true;
//     game.state[roomName].players.directions[1] = [ControlEnum.LEFT];
//     // game.state[roomName].players.positions[1] = {
//     //   number: 1,
//     //   pos: { x: 2 * density, y: 1 * density },
//     // };
//   }
//   const clientPrepInfos: PrepInfos = {
//     isAdmin: playerNumber === 0,
//     number: newPlayerInfo.number,
//     roomName: roomName,
//     stage: "preparation",
//     playerInfos: game.state[roomName].players.infos,
//     availableColors: game.state[roomName].availableColors,
//     serverTimestamp: Date.now(),
//   };
//   client.on(ClientEvents.pageLoaded, (page) => {
//     if (page === "preparation") {
//       //* Only current client gets it
//       client.emit(ServerEvents.gamePrepInfo, { result: clientPrepInfos });
//     }
//   });
//   //* All room members except the current client gets it
//   myServer.io.sockets
//     .to(roomName)
//     .emit(ServerEvents.addJoinedPlayer, { result: newPlayerInfo });
// };
// export const pickColor = (client: MySocket, color: string) => {
//   const roomName = game.rooms[client.id];
//   const availableColors = game.state[roomName].availableColors;
//   if (!availableColors.includes(color)) return;
//   game.state[roomName].availableColors = availableColors.filter(
//     (item) => item !== color
//   );
//   const prevColor =
//     game.state[roomName].players.infos[client.number as number].color;
//   game.state[roomName].availableColors.push(prevColor);
//   game.state[roomName].players.infos[client.number as number].color = color;
//   myServer.io.sockets.in(roomName).emit(ServerEvents.availableColors, {
//     result: game.state[roomName].availableColors,
//   });
//   myServer.io.sockets.in(roomName).emit(ServerEvents.updateJoinedPlayers, {
//     result: game.state[roomName].players.infos,
//   });
//   if (game.state[roomName].tutorial) {
//     sendInfo(
//       client,
//       game.state[roomName]?.tutorialSteps?.preparation.startGame.text as string
//     );
//   }
// };
// export const startRoom = (client: MySocket) => {
//   const roomName = game.rooms[client.id];
//   let allPicked = true;
//   game.state[roomName].players.infos.forEach((p) => {
//     if (p.color === "") {
//       allPicked = false;
//       return;
//     }
//   });
//   if (!allPicked) {
//     sendError(client, "ERROR: someone didn't pick hero");
//     return;
//   }
//   if (game.state[roomName].players.infos.length === 1 && !ALONE_START) {
//     sendError(client, "ERROR: you can't start alone");
//     return;
//   }
//   //* All room members recive it
//   myServer.io.sockets
//     .in(roomName)
//     .emit(ServerEvents.changeStage, { result: "game" });
// };
