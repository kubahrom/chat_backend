import express from "express";
import "dotenv/config";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import api from "./api";
import * as middlewares from "./middlewares";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(middlewares.loadUserId);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
