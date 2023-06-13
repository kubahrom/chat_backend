import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import api from "./api";
import * as middlewares from "./middlewares";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    // origin: (origin, callback) => {
    //   console.log({
    //     origin,
    //     env: process.env.FE_URL,
    //     node_env: process.env.NODE_ENV,
    //   });
    //   if (
    //     process.env.NODE_ENV !== "production" ||
    //     origin === process.env.FE_URL
    //   ) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error("Not allowed by CORS"));
    //   }
    // },
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
