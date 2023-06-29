import { DENSITY, HITBOX } from "../../sharedConstants/density";
import { Position } from "../../types/BaseTypes";
import { ServerGameObject } from "../gameBaseClasses";
import { Bomb, HardWall, SoftWall } from "./../../types/ClientSliceTypes";

/**
 * Checks if a given position has a wall or not
 * @param state The current state
 * @param pos The position to look for
 * @param includeBombs To also be sensitive if it finds a bomb instead
 * @returns The result of the search: true if didn't find any
 */
export const isFreeFromWalls = (
  state: ServerGameObject,
  pos: Position,
  includeBombs: boolean = false
): boolean => {
  const walls = state.walls;
  let obsticles: (HardWall | SoftWall | Bomb)[] = [
    ...walls.hards,
    ...walls.softs.all,
  ];
  if (includeBombs) {
    obsticles = [...obsticles, ...state.bombs.all];
  }
  if (obsticles.find((p) => p.pos.x === pos.x && p.pos.y === pos.y)) {
    return false;
  }
  return true;
};

/**
 * Checks the given position and then returns it's index in the state
 * @param state The game state we search in
 * @param pos The targeted position that
 * @returns The index of the soft wall
 */
export const getSoftWallIndex = (
  state: ServerGameObject,
  pos: Position
): number => {
  return state.walls.softs.all.findIndex((p) => {
    return p.pos.x === pos.x && p.pos.y === pos.y;
  });
};

/**
 * Gets the given bomb index on a location
 * @param state The state we search in
 * @param pos The position we search for
 * @returns The idnex of the bomb
 */
export const getBombIndex = (
  state: ServerGameObject,
  pos: Position
): number => {
  return state.bombs.all.findIndex((p) => {
    return p.pos.x === pos.x && p.pos.y === pos.y;
  });
};

/**
 * Checks if a position defined rectangle is intersects with another position defined rectangle
 * @param target Target position rectangle
 * @param player Player position rectangle
 * @returns True if the two intersetcs
 */
export const isWithin = (target: Position, player: Position): boolean => {
  const xAligned = target.x === player.x;
  const yAligned = target.y === player.y;

  if (xAligned && yAligned) return true;
  if (!xAligned && !yAligned) return false;

  let newPlayerPos: Position;
  if (xAligned) {
    //* yAligned: false
    if (target.y >= player.y) {
      newPlayerPos = {
        x: player.x,
        y: player.y + DENSITY - (player.y % DENSITY),
      };
    } else {
      newPlayerPos = {
        x: player.x,
        y: player.y - (player.y % DENSITY),
      };
    }
  } else {
    if (target.x >= player.x) {
      newPlayerPos = {
        x: player.x + DENSITY - (player.x % DENSITY),
        y: player.y,
      };
    } else {
      newPlayerPos = {
        x: player.x - (player.x % DENSITY),
        y: player.y,
      };
    }
  }

  if (target.x !== newPlayerPos.x && target.y !== newPlayerPos.y) return false;

  if (
    Math.abs(target.x - player.x) + Math.abs(target.y - player.y) + HITBOX >=
    DENSITY
  )
    return false;

  return true;
};
