import express from "express";
import "dotenv/config";

import api from "./api";
import * as middlewares from "./middlewares";

const app = express();

app.use(express.json());

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
