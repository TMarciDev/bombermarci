import { useCallback } from "react";
import {
  useGetAliveArray,
  useGetCurrentPlayer,
  useGetMapInfo,
} from "../app/hooks";
import { useWindow } from "../windowUtils";
import { isMobile } from "react-device-detect";

/**
 * An optional custom render hook to check if a position is visible
 * @returns True if the object is visble
 */
export const useOptionalRender = () => {
  const player = useGetCurrentPlayer();
  const aliveArray = useGetAliveArray();
  const window = useWindow();
  const mapInfo = useGetMapInfo();

  const additionX = isMobile ? mapInfo.blockLen / 2 : mapInfo.blockLen * 2;
  const additionY = isMobile ? mapInfo.blockLen * 1.2 : mapInfo.blockLen * 2;

  const isVisible = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (
        Math.abs(x - player.pos.x) >
          window.width / 2 + mapInfo.blockLen + additionX ||
        Math.abs(y - player.pos.y) >
          window.height / 2 + mapInfo.blockLen + additionY
      )
        return !aliveArray[player.number];
      return true;
    },
    [
      player.pos.x,
      player.pos.y,
      player.number,
      window.width,
      window.height,
      mapInfo.blockLen,
      additionX,
      additionY,
      aliveArray,
    ]
  );

  return isVisible;
};
