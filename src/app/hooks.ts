import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import {
  selectALiveArray,
  selectColors,
  selectInvincbles,
  selectStats,
} from "../features/game/stats/statsSlice";
import { useMemo } from "react";
import { selectPlayerFrames } from "../features/game/player/frameSlice";
import { PossibleColors } from "../types/Colors";
import { selectCurrentPlayer } from "../features/currentPlayerSlice";
import { selectMapInfo } from "../features/game/gameMap/mapSlice";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * @returns The stats
 */
export const useGetStats = () => {
  const stats = useAppSelector(selectStats);
  return useMemo(() => stats, [stats]);
};

/**
 * @returns All the colors of the palyers
 */
export const useGetColors = () => {
  const color: PossibleColors[] = useAppSelector(selectColors);
  return useMemo(() => color, [color]);
};

/**
 * @returns The boolean array of invincible palyers
 */
export const useGetInvincibility = () => {
  const invincibles = useAppSelector(selectInvincbles);
  return useMemo(() => invincibles, [invincibles]);
};

/**
 * @returns The alive players boolean array
 */
export const useGetAliveArray = () => {
  const aliveArray = useAppSelector(selectALiveArray);
  return useMemo(() => aliveArray, [aliveArray]);
};

/**
 * @returns The current players data
 */
export const useGetCurrentPlayer = () => {
  const player = useAppSelector(selectCurrentPlayer);
  return useMemo(() => player, [player]);
};

/**
 * @returns The animation frame for the palyers
 */
export const useGetFrames = () => {
  const frames = useAppSelector(selectPlayerFrames).playerFrames;
  return useMemo(() => frames, [frames]);
};

/**
 * @returns The map dymensions
 */
export const useGetMapInfo = () => {
  const mapInfo = useAppSelector(selectMapInfo);
  return useMemo(() => mapInfo, [mapInfo]);
};
