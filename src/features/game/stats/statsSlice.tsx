import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store";
import { PlayerInfo } from "@backend/types/ClientSliceTypes";
import { PossibleColors } from "../../../types/Colors";

const initialState: PlayerInfo[] = [];

const slice = createSlice({
  name: "stats",
  initialState: initialState,
  reducers: {
    updateStats: (
      _, // STATE is not modified but being overriden
      { payload: { stats } }: PayloadAction<{ stats: PlayerInfo[] }>
    ) => {
      return stats;
    },
  },
});

export const { updateStats } = slice.actions;

export default slice.reducer;

export const selectStats = (state: RootState) => state.stats;
export const selectColors = (state: RootState): PossibleColors[] => {
  return state.stats.map((s) => {
    return s.color;
  }) as PossibleColors[];
};
export const selectInvincbles = (state: RootState) => {
  return state.stats.map((p) => {
    return p.invincible;
  });
};
export const selectALiveArray = (state: RootState) => {
  return state.stats.map((p) => {
    return p.health > 0;
  });
};
