import { PossibleColors } from "../types/Colors";
import empty from "./block/empty.png";

import blueBomb from "./bomb/blue-bomb.png";
import brownBomb from "./bomb/brown-bomb.png";
import greenBomb from "./bomb/green-bomb.png";
import orangeBomb from "./bomb/orange-bomb.png";
import pinkBomb from "./bomb/pink-bomb.png";
import redBomb from "./bomb/red-bomb.png";
import tealBomb from "./bomb/teal-bomb.png";
import whiteBomb from "./bomb/white-bomb.png";
import yellowBomb from "./bomb/yellow-bomb.png";

import blueExp from "./exp/blue-exp.png";
import brownExp from "./exp/brown-exp.png";
import greenExp from "./exp/green-exp.png";
import orangeExp from "./exp/orange-exp.png";
import pinkExp from "./exp/pink-exp.png";
import redExp from "./exp/red-exp.png";
import tealExp from "./exp/teal-exp.png";
import whiteExp from "./exp/white-exp.png";
import yellowExp from "./exp/yellow-exp.png";

import blueIdle from "./idle/blue-idle.png";
import brownIdle from "./idle/brown-idle.png";
import greenIdle from "./idle/green-idle.png";
import orangeIdle from "./idle/orange-idle.png";
import pinkIdle from "./idle/pink-idle.png";
import redIdle from "./idle/red-idle.png";
import tealIdle from "./idle/teal-idle.png";
import whiteIdle from "./idle/white-idle.png";
import yellowIdle from "./idle/yellow-idle.png";

import blueRun from "./run/blue-run.png";
import brownRun from "./run/brown-run.png";
import greenRun from "./run/green-run.png";
import orangeRun from "./run/orange-run.png";
import pinkRun from "./run/pink-run.png";
import redRun from "./run/red-run.png";
import tealRun from "./run/teal-run.png";
import whiteRun from "./run/white-run.png";
import yellowRun from "./run/yellow-run.png";

const imagePaths = [
  blueBomb,
  brownBomb,
  greenBomb,
  orangeBomb,
  pinkBomb,
  redBomb,
  tealBomb,
  whiteBomb,
  yellowBomb,
  blueExp,
  brownExp,
  greenExp,
  orangeExp,
  pinkExp,
  redExp,
  tealExp,
  whiteExp,
  yellowExp,
  blueIdle,
  brownIdle,
  greenIdle,
  orangeIdle,
  pinkIdle,
  redIdle,
  tealIdle,
  whiteIdle,
  yellowIdle,
  blueRun,
  brownRun,
  greenRun,
  orangeRun,
  pinkRun,
  redRun,
  tealRun,
  whiteRun,
  yellowRun,
];

const loadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve();
    };
    image.onerror = (error) => {
      reject(error);
    };
    image.src = src;
  });
};

export const loadImages = (): Promise<void[]> => {
  const imagePromises: Promise<void>[] = [];
  imagePaths.forEach((path) => {
    imagePromises.push(loadImage(path));
  });
  return Promise.all(imagePromises);
};

export const selectColoredAsset = (
  asset: "bomb" | "explosion" | "idle" | "run",
  color: PossibleColors
): string => {
  if (asset === "bomb") {
    switch (color) {
      case "blue":
        return blueBomb;
      case "brown":
        return brownBomb;
      case "green":
        return greenBomb;
      case "orange":
        return orangeBomb;
      case "pink":
        return pinkBomb;
      case "red":
        return redBomb;
      case "teal":
        return tealBomb;
      case "white":
        return whiteBomb;
      case "yellow":
        return yellowBomb;
      default:
        return empty;
    }
  } else if (asset === "explosion") {
    switch (color) {
      case "blue":
        return blueExp;
      case "brown":
        return brownExp;
      case "green":
        return greenExp;
      case "orange":
        return orangeExp;
      case "pink":
        return pinkExp;
      case "red":
        return redExp;
      case "teal":
        return tealExp;
      case "white":
        return whiteExp;
      case "yellow":
        return yellowExp;
      default:
        return empty;
    }
  } else if (asset === "idle") {
    switch (color) {
      case "blue":
        return blueIdle;
      case "brown":
        return brownIdle;
      case "green":
        return greenIdle;
      case "orange":
        return orangeIdle;
      case "pink":
        return pinkIdle;
      case "red":
        return redIdle;
      case "teal":
        return tealIdle;
      case "white":
        return whiteIdle;
      case "yellow":
        return yellowIdle;
      default:
        return empty;
    }
  } else if (asset === "run") {
    switch (color) {
      case "blue":
        return blueRun;
      case "brown":
        return brownRun;
      case "green":
        return greenRun;
      case "orange":
        return orangeRun;
      case "pink":
        return pinkRun;
      case "red":
        return redRun;
      case "teal":
        return tealRun;
      case "white":
        return whiteRun;
      case "yellow":
        return yellowRun;
      default:
        return empty;
    }
  } else {
    return empty;
  }
};
