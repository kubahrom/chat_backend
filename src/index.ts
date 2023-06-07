import "dotenv/config";

import app from "./app";
import { createWebSocketServer } from "./websockets";

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

createWebSocketServer(server);
