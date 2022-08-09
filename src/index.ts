import { createServer } from "http";
import App from "./app";
import "dotenv/config";
import AuthController from "./resources/controllers/auth.controller";
import validateEnv from "./utils/validateEnv";
import ApiController from "./resources/controllers/api.controller";
import WebSocketService from "./websocket";

validateEnv();

const app = new App(
  [
    new ApiController(),
    new AuthController()
  ],
  Number(process.env.PORT),
  process.env.BASE_URL
);

const httpServer = createServer(app.express);
const io = new WebSocketService(httpServer);

httpServer.listen(app.port, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${app.port}`
  );
});
// app.listen();