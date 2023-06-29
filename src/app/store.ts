import { preparationApi } from "./services/preparation";
import { configureStore, ConfigureStoreOptions } from "@reduxjs/toolkit";
import { api } from "./services/api";
import statsReducer from "../features/game/stats/statsSlice";
import currentPlayerReducer from "../features/currentPlayerSlice";
import framesReducer from "../features/game/player/frameSlice";
import mapInfoReducer from "../features/game/gameMap/mapSlice";

export const createStore = (
  options?: ConfigureStoreOptions["preloadedState"] | undefined
) =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      [preparationApi.reducerPath]: preparationApi.reducer,
      stats: statsReducer,
      currentPlayer: currentPlayerReducer,
      frames: framesReducer,
      mapInfo: mapInfoReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(api.middleware)
        .concat(preparationApi.middleware),
    ...options,
  });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
