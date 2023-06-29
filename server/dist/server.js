"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myServer = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MyServer {
    constructor(app = (0, express_1.default)()) {
        this.app = app;
        const server = http_1.default.createServer(app);
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
            },
        });
        server.listen(process.env.PORT, () => {
            console.log("SERVER IS RUNNING!", process.env.PORT);
        });
    }
}
exports.myServer = new MyServer();
