import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store";

const initialState = {
  blockLen: 0,
  ratio: 0,
  mapPos: { x: 0, y: 0 },
};

const slice = createSlice({
  name: "mapInfo",
  initialState: initialState,
  reducers: {
    createMapInfo: (
      _,
      { payload: { mapInfo } }: PayloadAction<{ mapInfo: typeof initialState }>
    ) => {
      return mapInfo;
    },
    setBlockLen: (
      state,
      {
        payload: { blockLen, ratio },
      }: PayloadAction<{ blockLen: number; ratio: number }>
    ) => {
      state.blockLen = blockLen;
      state.ratio = ratio;
    },
    updateMapPos: (
      state,
      { payload: { x, y } }: PayloadAction<{ x: number; y: number }>
    ) => {
      state.mapPos.x = x;
      state.mapPos.y = y;
    },
  },
});

export const { createMapInfo, updateMapPos, setBlockLen } = slice.actions;

export default slice.reducer;

export const selectMapInfo = (state: RootState) => state.mapInfo;
