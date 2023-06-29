import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

const initialState = {
  number: -1,
  pos: { x: 0, y: 0 },
};

const slice = createSlice({
  name: "currentPlayer",
  initialState: initialState,
  reducers: {
    updateCurrentPlayer: (
      state,
      { payload: { number } }: PayloadAction<{ number: number }>
    ) => {
      state.number = number;
    },
    updatePos: (
      state,
      { payload: { pos } }: PayloadAction<{ pos: { x: number; y: number } }>
    ) => {
      state.pos = pos;
    },
  },
});

export const { updateCurrentPlayer, updatePos } = slice.actions;

export default slice.reducer;

export const selectCurrentPlayer = (state: RootState) => state.currentPlayer;
