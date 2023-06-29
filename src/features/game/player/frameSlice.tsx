import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store";

export interface PlayerMovement {
  offsetX: number;
  offsetY: number;
}

interface PlayerFrame {
  number: number;
  isMoving: boolean;
  frame: number;
  flipped: boolean;
}

interface FrameInfo {
  lastTime: number;
  playerFrames: PlayerFrame[];
}
const initialState: FrameInfo = {
  lastTime: 0,
  playerFrames: [
    {
      flipped: false,
      frame: 0,
      isMoving: false,
      number: 0,
    },
    {
      flipped: false,
      frame: 0,
      isMoving: false,
      number: 1,
    },
    {
      flipped: false,
      frame: 0,
      isMoving: false,
      number: 2,
    },
    {
      flipped: false,
      frame: 0,
      isMoving: false,
      number: 3,
    },
  ],
};
const FPS = 24;

const slice = createSlice({
  name: "frames",
  initialState: initialState,
  reducers: {
    updateFrames: (
      state,
      {
        payload: { playerMovements },
      }: PayloadAction<{ playerMovements: PlayerMovement[] }>
    ) => {
      const time = Date.now();
      let nextFrame = false;

      if (time - state.lastTime > 1000 / FPS) {
        nextFrame = true;
        state.lastTime = time;
      }

      playerMovements.forEach((p, number) => {
        //* completely still
        if (p.offsetX === 0 && p.offsetY === 0) {
          state.playerFrames[number].isMoving = false;
          state.playerFrames[number].frame = 0;
        } else {
          //* not still
          state.playerFrames[number].isMoving = true;
          nextFrame && state.playerFrames[number].frame++;

          //* if moving left flip the image. If moving Y keeps orientation
          if (p.offsetX > 0) {
            state.playerFrames[number].flipped = false;
          } else if (p.offsetX < 0) {
            state.playerFrames[number].flipped = true;
          }
        }
      });
      return state;
    },
  },
});

export const { updateFrames } = slice.actions;

export default slice.reducer;

export const selectPlayerFrames = (state: RootState) => state.frames;
