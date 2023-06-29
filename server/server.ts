import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

class MyServer {
  public io: Server;
  constructor(public app = express()) {
    const server = http.createServer(app);
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    server.listen(process.env.PORT, () => {
      console.log("SERVER IS RUNNING!", process.env.PORT);
    });
  }
}

export const myServer = new MyServer();
