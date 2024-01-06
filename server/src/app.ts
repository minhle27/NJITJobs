import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./utils/config";
import helmet from "helmet";
import morgan from "morgan";
import 'express-async-errors';
import errorHandler from "./middleware/errorHandler";

import requestLogger from "./middleware/requestLogger";
import unknownEndpoint from "./middleware/unknownEndpoints";

const app = express();

// MONGODB connection
mongoose.set("strictQuery", false);
console.log("connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI as string)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error: unknown) => {
    let errorMessage = "Something went wrong: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.error("error connecting to MongoDB:", errorMessage);
  });

app.use(express.json());
app.use(cors());
app.use(helmet());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(morgan("common"));
app.use(requestLogger);

// Routes
app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});


app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
