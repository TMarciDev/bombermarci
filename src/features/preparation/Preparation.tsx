import { PrepInfos } from "@backend/types/ClientSliceTypes";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getResult, isLoaded } from "../_socket_utils/dataHandler";
import { LoadedData } from "../../types/DataHandleType";
import {
  useGetPreparationQuery,
  useSendLoadedMutation,
  useStartGameMutation,
} from "../../app/services/preparation";
import { useAppDispatch } from "../../app/hooks";
import { updateStats } from "../game/stats/statsSlice";
import { updateCurrentPlayer } from "../currentPlayerSlice";
import ColorPicker from "./ColorPicker";
import { PossibleColors } from "../../types/Colors";
import styles from "./style.module.scss";
import CopyButton from "../../components/CopyButton";
import { loadImages } from "../../assets/assetHandler";
import { nanoid } from "@reduxjs/toolkit";
import { useSmartSession } from "../../storageHook";

const Preparation = () => {
  useSmartSession();
  const navigate = useNavigate();
  const { data } = useGetPreparationQuery();
  const dispatch = useAppDispatch();
  const [sendLoaded] = useSendLoadedMutation();
  const [startGame] = useStartGameMutation();

  const ready = isLoaded(data);
  const result = getResult(data as LoadedData<PrepInfos>);

  useEffect(() => {
    sendLoaded();
  }, [sendLoaded]);

  useEffect(() => {
    if (ready && result.stage === "game") {
      navigate("/game", { replace: true });
    }
  }, [navigate, ready, result]);

  useEffect(() => {
    if (ready) {
      dispatch(updateStats({ stats: result.playerInfos }));
      dispatch(updateCurrentPlayer({ number: result.number }));
    }
  }, [dispatch, ready, result]);

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div>
      {ready ? (
        <div className={styles.outterContainer}>
          <div className={styles.topContainer}>
            <span className={styles.roomName}>
              Room name: <b id="room-code">{result.roomName}</b>{" "}
              <CopyButton text={result.roomName} />
            </span>
            {result.isAdmin && (
              <button onClick={() => startGame()}>Start game room</button>
            )}
          </div>
          <span className={styles.selectRoom}>Select your hero</span>
          <ColorPicker
            selected={
              result.playerInfos[result.number].color as PossibleColors | ""
            }
          />
          <br />
          {result.playerInfos.map((player) => {
            return (
              <div key={nanoid()} style={{ color: player.color }}>
                <span className={styles.playerName}>
                  {result.number === player.number ? (
                    <b>{player.name}</b>
                  ) : (
                    player.name
                  )}{" "}
                  ({player.number + 1}) is ready{" "}
                  {player.isAdmin && " (room owner)"}
                </span>
                <br />
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <h1>Game not loaded</h1>
          {/* <button onClick={() => sendLoaded()}>Reload game</button> */}
          <Link to="/">Back to home</Link>
        </div>
      )}
    </div>
  );
};

export default Preparation;
