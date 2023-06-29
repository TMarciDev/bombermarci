"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const controlInpoutTypes_1 = require("../../sharedConstants/controlInpoutTypes");
const sendToast_1 = require("../sendToast");
const utils_1 = require("../utils");
const gameBaseClasses_1 = require("../gameBaseClasses");
class Input extends gameBaseClasses_1.GameHandler {
    constructor(state) {
        super(state);
        this.state = state;
        this.new = (code, keyMovement, client) => {
            const number = client.number;
            if (this.state.players.infos[number].isDead)
                return;
            if (code === controlInpoutTypes_1.ControlEnum.STAY) {
                removeAllDirections(number);
            }
            else if (code === controlInpoutTypes_1.ControlEnum.LEFT ||
                code === controlInpoutTypes_1.ControlEnum.RIGHT ||
                code === controlInpoutTypes_1.ControlEnum.UP ||
                code === controlInpoutTypes_1.ControlEnum.DOWN) {
                keyMovement === "pressed"
                    ? addDirection(code, client)
                    : removeDirection(number, code);
            }
            else if (code === controlInpoutTypes_1.ControlEnum.BOMB) {
                keyMovement === "pressed" ? addBombing(client) : removeBombing(number);
            }
        };
        /**
         * Handles the keydown event down
         * @param code The direction to calculate
         * @param client The connected socket
         */
        const addDirection = (code, client) => {
            var _a, _b, _c, _d;
            const number = client.number;
            this.state.players.directions[number].unshift(code);
            if (this.state.tutorial && !((_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.tutorialSteps) === null || _b === void 0 ? void 0 : _b.game.bomb.done)) {
                (0, sendToast_1.sendInfo)(client, (_d = (_c = this.state) === null || _c === void 0 ? void 0 : _c.tutorialSteps) === null || _d === void 0 ? void 0 : _d.game.bomb.text);
                this.state.tutorialSteps.game.bomb.done = true;
            }
        };
        /**
         * Handles the keydown event up
         * @param code The direction to calculate
         * @param client The connected socket
         */
        const removeDirection = (number, code) => {
            const arr = this.state.players.directions[number];
            this.state.players.directions[number] = (0, utils_1.removeItem)(arr, code);
        };
        /**
         * It makes a player stop. It handles the stay event
         * @param number The palyer number to be stopped
         */
        const removeAllDirections = (number) => {
            this.state.players.directions[number] = [];
        };
        /**
         * Switching a client so it puts down bombs until release
         * @param client The connected client to be set as a bomber
         */
        const addBombing = (client) => {
            var _a, _b, _c, _d;
            const number = client.number;
            setBomber(number, true);
            if (this.state.tutorial &&
                ((_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.tutorialSteps) === null || _b === void 0 ? void 0 : _b.game.allHealth.done)) {
                (0, sendToast_1.sendInfo)(client, (_d = (_c = this.state) === null || _c === void 0 ? void 0 : _c.tutorialSteps) === null || _d === void 0 ? void 0 : _d.game.allHealth.text);
                this.state.tutorialSteps.game.allHealth.done = true;
            }
        };
        /**
         * Switching a client so it stops generating bombs
         * @param client The connected client to be set as a NOT bomber
         */
        const removeBombing = (number) => {
            setBomber(number, false);
        };
        /**
         * Sets a player to a specific bombing value
         * @param number The player to be changed
         * @param isBombing True if the player we set is bombing
         */
        const setBomber = (number, isBombing) => {
            this.state.players.bombers[number] = isBombing;
        };
    }
}
exports.Input = Input;
