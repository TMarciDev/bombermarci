import { CanvasObject } from "@backend/types/BaseTypes";
import { useGetMapInfo } from "../../../app/hooks";

interface AnimatedSegment extends CanvasObject {
  frame: number;
  flipped: boolean;
  invincible: boolean;
  imgSrc: string;
  isAlive: boolean;
}

const AnimatedBlock = ({
  pos,
  frame,
  imgSrc,
  flipped,
  invincible,
  isAlive,
}: AnimatedSegment) => {
  const mapInfo = useGetMapInfo();
  return (
    <div
      style={{
        position: "absolute",
        overflow: "hidden",
        left: `${pos.x * mapInfo.ratio}px`,
        top: `${pos.y * mapInfo.ratio}px`,
        width: `${mapInfo.blockLen}px`,
        height: `${mapInfo.blockLen}px`,
        transform: `scaleX(${flipped ? -1 : 1})`,
        filter: `${isAlive ? "brightness(110%)" : "brightness(10000%)"}`,
        opacity: `${invincible && isAlive ? "0.6" : "1"}`,
        zIndex: `${isAlive ? "auto" : "-1"}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          backgroundColor: "#ffffff",
          top: "30%",
          left: "40%",
          width: "40%",
          height: "20%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `-${mapInfo.blockLen * frame}px`,
        }}
      >
        <img
          src={imgSrc}
          alt=""
          style={{
            height: `${mapInfo.blockLen}px`,
            width: "auto",
            imageRendering: "pixelated",
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBlock;
