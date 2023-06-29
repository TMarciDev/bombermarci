import { StartInfos } from "@backend/types/ClientSliceTypes";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GameMap from "./gameMap/GameMap";
import { getResult, isLoaded } from "../_socket_utils/dataHandler";
import { LoadedData } from "../../types/DataHandleType";
import {
  useGetGamOverQuery,
  useGetGameQuery,
  useSendLoadedMutation,
} from "../../app/services/game";
import { useSmartSession } from "../../storageHook";

const Game = () => {
  useSmartSession();
  const navigate = useNavigate();
  const { data } = useGetGameQuery();
  const { data: gameOverData } = useGetGamOverQuery();
  const [sendLoaded] = useSendLoadedMutation();

  useEffect(() => {
    sendLoaded();
  }, [sendLoaded]);

  const ready = isLoaded(data);
  const result = getResult(data as LoadedData<StartInfos>);

  const gameOverReady = isLoaded(gameOverData);
  const gameOverResult = getResult(gameOverData as LoadedData<number>);

  useEffect(() => {
    if (gameOverReady && Number.isInteger(gameOverResult)) {
      navigate("/gameover", { replace: true, state: `${gameOverResult}` });
    }
  }, [gameOverReady, gameOverResult, navigate]);

  return (
    <div>
      {ready ? (
        <GameMap result={result} />
      ) : (
        <div>
          <h1>Game not loaded jet</h1>
          <Link to="/">Back to home</Link>
        </div>
      )}
    </div>
  );
};

export default React.memo(Game);
