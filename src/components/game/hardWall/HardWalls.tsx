import { HardWall } from "@backend/types/ClientSliceTypes";
import React from "react";
import Block from "../block/Block";

import hardWall from "../../../assets/block/hard.png";
import { useOptionalRender } from "../../../features/renderHook";

interface HardWallWrapper {
  hardWalls: HardWall[];
}

const HardWalls = ({ hardWalls }: HardWallWrapper) => {
  const isVisible = useOptionalRender();
  return (
    <>
      {hardWalls.map((wall) => {
        return isVisible(wall.pos) ? (
          <Block pos={wall.pos} imgSrc={hardWall} key={JSON.stringify(wall)} />
        ) : null;
      })}
    </>
  );
};

export default React.memo(HardWalls);
