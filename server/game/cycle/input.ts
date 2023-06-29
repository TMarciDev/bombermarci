import { ControlEnum } from "../../sharedConstants/controlInpoutTypes";
import { MySocket } from "../../types/MySocketType";
import { sendInfo } from "../sendToast";
import { removeItem } from "../utils";
import { GameHandler } from "../gameBaseClasses";
import { GameInstance } from "../initializer/gameInstance";

export class Input extends GameHandler {
  new: (
    code: number,
    keyMovement: "pressed" | "released",
    client: MySocket
  ) => void;

  constructor(public state: GameInstance) {
    super(state);
    this.new = (
      code: number,
      keyMovement: "pressed" | "released",
      client: MySocket
    ) => {
      const number: number = client.number as number;
      if (this.state.players.infos[number].isDead) return;
      if (code === ControlEnum.STAY) {
        removeAllDirections(number);
      } else if (
        code === ControlEnum.LEFT ||
        code === ControlEnum.RIGHT ||
        code === ControlEnum.UP ||
        code === ControlEnum.DOWN
      ) {
        keyMovement === "pressed"
          ? addDirection(code, client)
          : removeDirection(number, code);
      } else if (code === ControlEnum.BOMB) {
        keyMovement === "pressed" ? addBombing(client) : removeBombing(number);
      }
    };

    /**
     * Handles the keydown event down
     * @param code The direction to calculate
     * @param client The connected socket
     */
    const addDirection = (code: number, client: MySocket) => {
      const number: number = client.number as number;
      this.state.players.directions[number].unshift(code);

      if (this.state.tutorial && !this.state?.tutorialSteps?.game.bomb.done) {
        sendInfo(client, this.state?.tutorialSteps?.game.bomb.text as string);
        this.state.tutorialSteps!.game.bomb.done = true;
      }
    };
    /**
     * Handles the keydown event up
     * @param code The direction to calculate
     * @param client The connected socket
     */
    const removeDirection = (number: number, code: number) => {
      const arr = this.state.players.directions[number];
      this.state.players.directions[number] = removeItem(arr, code);
    };

    /**
     * It makes a player stop. It handles the stay event
     * @param number The palyer number to be stopped
     */
    const removeAllDirections = (number: number) => {
      this.state.players.directions[number] = [];
    };

    /**
     * Switching a client so it puts down bombs until release
     * @param client The connected client to be set as a bomber
     */
    const addBombing = (client: MySocket) => {
      const number: number = client.number as number;
      setBomber(number, true);
      if (
        this.state.tutorial &&
        this.state?.tutorialSteps?.game.allHealth.done
      ) {
        sendInfo(
          client,
          this.state?.tutorialSteps?.game.allHealth.text as string
        );
        this.state.tutorialSteps!.game.allHealth.done = true;
      }
    };

    /**
     * Switching a client so it stops generating bombs
     * @param client The connected client to be set as a NOT bomber
     */
    const removeBombing = (number: number) => {
      setBomber(number, false);
    };

    /**
     * Sets a player to a specific bombing value
     * @param number The player to be changed
     * @param isBombing True if the player we set is bombing
     */
    const setBomber = (number: number, isBombing: boolean) => {
      this.state.players.bombers[number] = isBombing;
    };
  }
}
