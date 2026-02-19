import type { Server } from "http";
import { createServer } from "http";
import express from "express";

const app = express();
const server: Server = createServer(app);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});