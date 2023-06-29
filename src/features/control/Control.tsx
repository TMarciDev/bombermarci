import { useEffect } from "react";
import { ControlEnum } from "../_shared_constants/controlInpoutTypes";
import {
  useSendActionPressedMutation,
  useSendActionReleasedMutation,
} from "../../app/services/control";

const Control = () => {
  const [sendActionPressed] = useSendActionPressedMutation();
  const [sendActionReleased] = useSendActionReleasedMutation();

  useEffect(() => {
    let keysPressed = {
      left: { code: ControlEnum.LEFT, state: false },
      right: { code: ControlEnum.RIGHT, state: false },
      up: { code: ControlEnum.UP, state: false },
      down: { code: ControlEnum.DOWN, state: false },
      bomb: { code: ControlEnum.BOMB, state: false },
    };

    const desktopKeyMap = {
      KeyA: "left",
      KeyD: "right",
      KeyW: "up",
      KeyS: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
      Space: "bomb",
      Enter: "bomb",
    };
    const handleKeyMovement = (code: string, down: boolean) => {
      if (!(code in desktopKeyMap)) return;

      const keyAttribute = desktopKeyMap[code as keyof typeof desktopKeyMap];

      if (keysPressed[keyAttribute as keyof typeof keysPressed].state === down)
        return;

      keysPressed[keyAttribute as keyof typeof keysPressed].state = down;

      const toSend = keysPressed[keyAttribute as keyof typeof keysPressed].code;

      down ? sendActionPressed(toSend) : sendActionReleased(toSend);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyMovement(e.code, true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      handleKeyMovement(e.code, false);
    };

    document.addEventListener("keydown", handleKeyDown);

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [sendActionPressed, sendActionReleased]);

  return <></>;
};

export default Control;
