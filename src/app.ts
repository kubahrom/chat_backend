import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import api from "./api";
import * as middlewares from "./middlewares";

const app = express();

const whitelist = [process.env.FE_URL];

app.use(
  cors({
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE"],
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
