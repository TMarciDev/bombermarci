import { StartInfos } from "@backend/types/ClientSliceTypes";
import { useEffect, useState } from "react";
import { DENSITY } from "../../_shared_constants/density";
import SoftWalls from "../SoftWalls";
import HardWalls from "../../../components/game/hardWall/HardWalls";
import PlayersPos from "../player/PlayersPos";
import Control from "../../control/Control";
import Boms from "../Boms";
import Explosions from "../Explosions";
import PowerUps from "../PowerUps";
import { isMobile } from "react-device-detect";
import ControlMobile from "../../control/ControlMobile";
import {
  useAppDispatch,
  useGetAliveArray,
  useGetCurrentPlayer,
} from "../../../app/hooks";
import Stats from "../stats/Stats";
import { useWindow } from "../../../windowUtils";
import { createMapInfo, setBlockLen, updateMapPos } from "./mapSlice";
import styles from "./style.module.scss";
interface MapInfoWrapper {
  result: StartInfos;
}

const GameMap = ({ result }: MapInfoWrapper) => {
  const dispatch = useAppDispatch();
  const windowSize = useWindow();
  const player = useGetCurrentPlayer();
  const aliveArray = useGetAliveArray();
  const [magnify, setMagnify] = useState(isMobile ? 3 : 2);
  const mapHeight = isMobile ? windowSize.width : windowSize.height;
  const blockLen = ((mapHeight * magnify) / result.mapInfo.height) * DENSITY;
  const ratio = blockLen / DENSITY;

  const getOffset = (size: number, pos: number) => {
    return size / 2 - pos * ratio - blockLen / 2;
  };

  const getMapPos = () => {
    if (aliveArray[player.number])
      return {
        x: getOffset(windowSize.width, player.pos.x),
        y: getOffset(windowSize.height, player.pos.y),
      };
    return { x: 0, y: 0 };
  };

  const mapPos = getMapPos();

  useEffect(() => {
    if (player.number < 0) return;
    dispatch(
      createMapInfo({
        mapInfo: { blockLen: blockLen, ratio: ratio, mapPos: mapPos },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, player.number]);

  useEffect(() => {
    if (player.number < 0) return;
    dispatch(updateMapPos(getMapPos()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    windowSize.width,
    windowSize.height,
    player.pos.x,
    player.pos.y,
  ]);

  useEffect(() => {
    if (!aliveArray[player.number] && magnify !== 1) {
      setMagnify(1);
      const newBlockLen = (mapHeight / result.mapInfo.height) * DENSITY;
      dispatch(
        setBlockLen({
          blockLen: newBlockLen,
          ratio: newBlockLen / DENSITY,
        })
      );
    }
  }, [
    aliveArray,
    blockLen,
    dispatch,
    magnify,
    mapHeight,
    player.number,
    result.mapInfo.height,
  ]);
  return (
    <>
      <Stats />
      <div
        className={styles.gameWrapper}
        style={{
          height: `${windowSize.height}px`,
          width: `${windowSize.width}px`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${mapPos.x}px`,
            top: `${mapPos.y}px`,
          }}
        >
          <div
            className={styles.mainMap}
            style={{
              width: `${mapHeight * magnify}px`,
              height: `${mapHeight * magnify}px`,
            }}
          >
            <HardWalls hardWalls={result.hardWalls} />
            <SoftWalls />
            <PowerUps />
            <Boms />
            <PlayersPos />
            <Explosions />
          </div>
        </div>
        {aliveArray[player.number] ? (
          isMobile ? (
            <ControlMobile />
          ) : (
            <Control />
          )
        ) : (
          <span className={styles.gameOver}>
            Game over
            <br />
            You died
          </span>
        )}
      </div>
    </>
  );
};

export default GameMap;
