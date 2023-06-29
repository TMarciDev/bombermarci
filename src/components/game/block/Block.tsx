import { CanvasObject } from "@backend/types/BaseTypes";
import { useGetMapInfo } from "../../../app/hooks";

import styles from "./style.module.scss";
import React from "react";

interface BlockSegment extends CanvasObject {
  opacity?: number;
  imgSrc?: string;
}

const Block = ({ pos, opacity = 1, imgSrc }: BlockSegment) => {
  const mapInfo = useGetMapInfo();
  return (
    <div
      style={{
        position: "absolute",
        width: mapInfo.blockLen,
        height: mapInfo.blockLen,
        left: pos.x * mapInfo.ratio,
        top: pos.y * mapInfo.ratio,
        opacity: opacity,
      }}
    >
      <img src={imgSrc} alt="" className={styles.image} />
    </div>
  );
};

export default React.memo(Block);
