import React, { useEffect } from "react";
import {
  getPrevResult,
  getResult,
  isLoaded,
} from "../../_socket_utils/dataHandler";
import { useGetPlayersPosQuery } from "../../../app/services/playersPos";
import { LoadedData, LoadedDataWithPrev } from "../../../types/DataHandleType";
import { PlayerPos } from "@backend/types/ClientSliceTypes";
import {
  useAppDispatch,
  useGetColors,
  useGetFrames,
  useGetInvincibility,
  useGetCurrentPlayer,
  useGetAliveArray,
} from "../../../app/hooks";
import AnimatedBlock from "../../../components/game/animated/AnimatedBlock";

import { PlayerMovement, updateFrames } from "./frameSlice";
import { selectColoredAsset } from "../../../assets/assetHandler";
import { updatePos } from "../../currentPlayerSlice";
import { useOptionalRender } from "../../renderHook";

const PlayersPos = () => {
  const isVisible = useOptionalRender();
  const dispatch = useAppDispatch();
  const aliveArray = useGetAliveArray();
  const frames = useGetFrames();
  const currentPlayer = useGetCurrentPlayer();
  const invincibles = useGetInvincibility();
  const { data } = useGetPlayersPosQuery();
  const ready = isLoaded(data);
  const result = getResult(data as LoadedData<PlayerPos[]>);
  const prevResult = getPrevResult(data as LoadedDataWithPrev<PlayerPos[]>);

  const colors = useGetColors();
  const FRAMES = 12;

  useEffect(() => {
    if (ready && prevResult) {
      let playerMovements: PlayerMovement[] = [];
      result.forEach((_, idx) => {
        playerMovements.push({
          offsetX: result[idx].pos.x - prevResult[idx].pos.x,
          offsetY: result[idx].pos.y - prevResult[idx].pos.y,
        });
      });
      dispatch(updateFrames({ playerMovements: playerMovements }));
    }
  }, [dispatch, currentPlayer.number, prevResult, ready, result]);

  useEffect(() => {
    if (ready) {
      dispatch(updatePos({ pos: result[currentPlayer.number].pos }));
    }
  }, [dispatch, currentPlayer.number, ready, result]);
  return (
    <div>
      {ready &&
        result.map((player, number) => {
          return isVisible(player.pos) ? (
            <AnimatedBlock
              imgSrc={selectColoredAsset("run", colors[number])}
              frame={frames[number].frame % FRAMES}
              flipped={frames[number].flipped}
              pos={player.pos}
              key={number}
              invincible={invincibles[number]}
              isAlive={aliveArray[number]}
            />
          ) : null;
        })}
    </div>
  );
};

export default React.memo(PlayersPos);
