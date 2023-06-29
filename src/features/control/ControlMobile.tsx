import React, { useEffect, useState } from "react";
import {
  useSendActionPressedMutation,
  useSendActionReleasedMutation,
} from "../../app/services/control";
import { ControlEnum } from "../_shared_constants/controlInpoutTypes";
import CakeSlice from "./CakeSlice";

const getWindowSize = () => {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
};

const ControlMobile = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [bombing, setBombing] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize());
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  const width = windowSize.innerWidth;
  const height = windowSize.innerHeight;
  const containerWidth = 0.5;
  const top = height - containerWidth * width - 40;
  const left = width - containerWidth * width - 40;
  const center = (containerWidth * width) / 2;

  const [active, setActive] = useState(ControlEnum.STAY);
  const [moveTouchIndex, setMoveTouchIndex] = useState(0);
  const [sendActionPressed] = useSendActionPressedMutation();
  const [sendActionReleased] = useSendActionReleasedMutation();

  function rotatePoint(
    x: number,
    y: number,
    rx: number,
    ry: number,
    angle: number
  ) {
    // convert angle to radians
    const radians = (angle * Math.PI) / 180;

    // translate the point and the point of rotation
    const translatedX = x - rx;
    const translatedY = y - ry;

    // apply the rotation transformation
    const rotatedX =
      translatedX * Math.cos(-radians) - translatedY * Math.sin(-radians);
    const rotatedY =
      translatedX * Math.sin(-radians) + translatedY * Math.cos(-radians);

    // translate the point back to its original position
    const xPrime = rotatedX + rx;
    const yPrime = rotatedY + ry;

    return { x: xPrime, y: yPrime };
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setMoveTouchIndex(e.touches.length - 1);
    handleTouchMove(e);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = Array.from(e.touches).find(
      (touch) => touch.identifier === moveTouchIndex
    );
    if (!touch) return;
    const x = touch.clientX - left;
    const y = touch.clientY - top;

    const newPoint = rotatePoint(x, y, center, center, 45);

    if (newPoint.x > center && newPoint.y > center) {
      setDirection(ControlEnum.DOWN);
    } else if (newPoint.x > center && newPoint.y < center) {
      setDirection(ControlEnum.RIGHT);
    } else if (newPoint.x < center && newPoint.y > center) {
      setDirection(ControlEnum.LEFT);
    } else if (newPoint.x < center && newPoint.y < center) {
      setDirection(ControlEnum.UP);
    } else {
      setDirection(ControlEnum.STAY);
    }
  };

  const setDirection = (dir: number) => {
    if (dir === active) return;
    //sendActionReleased(active);
    for (let i = 0; i < 4; ++i) {
      if (i !== dir) sendActionReleased(i);
    }
    sendActionPressed(dir);
    setActive(dir);
  };

  return (
    <div style={{ opacity: "0.8" }}>
      <div
        style={{
          position: "absolute",
          width: `${(containerWidth * width) / 2}px`,
          height: `${containerWidth * width}px`,
          top: `${top}px`,
          left: `0px`,
          backgroundColor: `${bombing ? "#ff0000" : "#4d0101"}`,
        }}
        onTouchStart={() => {
          sendActionPressed(ControlEnum.BOMB);
          setBombing(true);
        }}
        onTouchEnd={() => {
          sendActionReleased(ControlEnum.BOMB);
          setBombing(false);
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          width: `${containerWidth * width}px`,
          height: `${containerWidth * width}px`,
          display: "flex",
          flexWrap: "wrap",
          top: `${top}px`,
          left: `${left}px`,
          transform: "rotate(45deg)",
          overflow: "hidden",
          borderRadius: "50%",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => {
          handleTouchMove(e);
        }}
        onTouchEnd={() => {
          setDirection(ControlEnum.STAY);
        }}
      >
        <CakeSlice active={active} color="#930000" direction={ControlEnum.UP} />
        <CakeSlice
          active={active}
          color="green"
          direction={ControlEnum.RIGHT}
        />
        <CakeSlice
          active={active}
          color="#0a6ea4"
          direction={ControlEnum.LEFT}
        />
        <CakeSlice
          active={active}
          color="#c0ca00"
          direction={ControlEnum.DOWN}
        />
      </div>
    </div>
  );
};

export default React.memo(ControlMobile);
