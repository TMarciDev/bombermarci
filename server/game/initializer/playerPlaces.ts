import { DENSITY } from "../../sharedConstants/density";
import { CanvasObject } from "../../types/BaseTypes";

export const PLAYER_CREATE_PLACES: CanvasObject[] = [
  { pos: { x: 1 * DENSITY, y: 1 * DENSITY } },
  { pos: { x: 13 * DENSITY, y: 13 * DENSITY } },
  { pos: { x: 1 * DENSITY, y: 13 * DENSITY } },
  { pos: { x: 13 * DENSITY, y: 1 * DENSITY } },
];

export const PLAYER_SPAWN_AREA: CanvasObject[] = [
  { pos: { x: 2 * DENSITY, y: 1 * DENSITY } },
  { pos: { x: 1 * DENSITY, y: 2 * DENSITY } },

  { pos: { x: 2 * DENSITY, y: 13 * DENSITY } },
  { pos: { x: 1 * DENSITY, y: 12 * DENSITY } },

  { pos: { x: 12 * DENSITY, y: 1 * DENSITY } },
  { pos: { x: 13 * DENSITY, y: 2 * DENSITY } },

  { pos: { x: 12 * DENSITY, y: 13 * DENSITY } },
  { pos: { x: 13 * DENSITY, y: 12 * DENSITY } },
];
