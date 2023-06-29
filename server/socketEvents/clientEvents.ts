export enum ClientEvents {
  //* Menu
  createRoom = "createRoom",
  joinRoom = "joinRoom",
  pickColor = "pickColor",

  pageLoaded = "pageLoaded",

  //* Preparation
  startGameRoom = "startGameRoom",
  // this two stays for the in game mode
  leaveRoom = "leaveRoom",
  sendMessage = "sendMessage",

  //* In game
  actionPressed = "actionPressed",
  actionReleased = "actionReleased",
}
