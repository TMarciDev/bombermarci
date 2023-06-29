export enum ServerEvents {
  gamePrepInfo = "gamePrepInfo",
  changeStage = "changeStage",
  addJoinedPlayer = "addJoinedPlayer",
  removeLeftPlayer = "removeLeftPlayer",
  availableColors = "availAbleColors",
  updateJoinedPlayers = "updateJoinedPlayers",
  gameStartInfo = "gameStartInfo",

  allPlayerStats = "allPlayerStats",

  allPlayersPos = "allPlayersPos",

  allSoftWalls = "allSoftWalls",
  removeSoftWalls = "removeSoftWalls",

  allBombs = "allBombs",
  addBombs = "addBombs",
  removeBombs = "removeBombs",

  addExplosionFields = "addExplosionFields",

  allPowerUps = "allPowerUps",
  addPowerUps = "addPowerUps",
  removePowerUps = "removePowerUps",

  gameOver = "gameOver",

  sendError = "sendError",
  sendInfo = "sendInfo",
}
