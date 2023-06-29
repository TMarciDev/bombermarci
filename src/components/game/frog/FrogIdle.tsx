import React, { useState, useEffect } from "react";

import { selectColoredAsset } from "../../../assets/assetHandler";
import { PossibleColors } from "../../../types/Colors";
//import styles from "./style.module.scss";

interface Props {
  color: PossibleColors;
  size: number;
  selected?: boolean;
  available?: boolean;
  handleClick?: ((color: string) => void) | null;
  border?: boolean;
}

const FrogIdle = ({
  color,
  size,
  selected = false,
  available = true,
  handleClick = null,
  border = true,
}: Props) => {
  const FRAMES = 11;
  const FPS = 20;
  const [frame, setFrame] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame < FRAMES - 1 ? prevFrame + 1 : 0));
    }, 1000 / FPS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        border: !border
          ? "none"
          : `20px ${selected ? "solid" : "dashed"} ${color}`,
        position: "relative",
        overflow: "hidden",
        width: `${size + "px"}`,
        height: `${size + "px"}`,
        filter: `brightness(${!selected && !available ? "10%" : "100%"})`,
      }}
      onClick={() => {
        if (handleClick) handleClick(color);
      }}
      className="pickable"
    >
      <div
        style={{
          position: "absolute",
          backgroundColor: "#ffffff",
          top: "35%",
          left: "40%",
          width: "40%",
          height: "20%",
        }}
      />
      <div style={{ position: "absolute", left: `-${size * frame}px` }}>
        <img
          src={selectColoredAsset("idle", color)}
          alt="frog"
          style={{
            height: `${size}px`,
            width: "auto",
            imageRendering: "pixelated",
          }}
        />
      </div>
    </div>
  );
};

export default FrogIdle;
