"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = void 0;
const shortid_1 = __importDefault(require("shortid"));
const gameInstance_1 = require("./initializer/gameInstance");
const tutorial_1 = require("./tutorial");
const sendToast_1 = require("./sendToast");
const gameBaseClasses_1 = require("./gameBaseClasses");
class Game extends gameBaseClasses_1.GameObject {
    constructor(state = {}, rooms = {}) {
        super(state, rooms);
        this.state = state;
        this.rooms = rooms;
        /**
         * Initiates create room operation
         * @param client The connected socket
         * @param args The start game arguments, for example for tutorial game
         */
        this.createRoom = (client, args) => {
            var _a, _b;
            const roomName = shortid_1.default.generate().slice(0, 3);
            this.state[roomName] = new gameInstance_1.GameInstance(roomName);
            this.joinRoom(client, Object.assign(Object.assign({}, args), { roomName: roomName }));
            if (this.state[roomName].tutorial) {
                this.state[roomName].tutorialSteps = JSON.parse(JSON.stringify(tutorial_1.tutorialSkeleton));
                (0, sendToast_1.sendInfo)(client, (_b = (_a = this.state[roomName]) === null || _a === void 0 ? void 0 : _a.tutorialSteps) === null || _b === void 0 ? void 0 : _b.preparation.selectHero.text);
            }
        };
        /**
         * Initiates the joining to a room
         * @param client The connected socket
         * @param args The object containing room name etc
         */
        this.joinRoom = (client, args) => {
            const roomName = args.roomName;
            this.rooms[client.id] = roomName;
            this.state[roomName].joinRoom(client, args);
        };
        /**
         * Handles the color picking event
         * @param client The connected socket
         * @param color The color to be picked
         */
        this.pickColor = (client, color) => {
            const roomName = this.rooms[client.id];
            this.state[roomName].pickColor(client, color);
        };
        /**
         * Initiates the room start
         * @param client The connected socket
         */
        this.startRoom = (client) => {
            const roomName = this.rooms[client.id];
            this.state[roomName].startRoom(client);
        };
    }
}
exports.game = new Game();
