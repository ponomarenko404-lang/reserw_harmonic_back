import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { connectToMongoDB } from "./db/connectToMongoDB.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

import { logger } from "./middleware/logger.js";
import { errors } from "celebrate";
import cookieParser from "cookie-parser";

import { authRouter } from "./routes/authRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import { articlesRouter } from "./routes/articlesRouter.js";
import { categoriesRouter } from "./routes/categoriesRouter.js";
import avatarRouter from "./routes/avatarRouter.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

const app = express();

const port = Number(process.env.PORT) || 3000;

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  "http://localhost:3000",
].filter(Boolean);

app.use(logger);
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isAllowed =
        allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");

      callback(null, isAllowed);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options(/.*/, cors());

app.use(helmet());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", avatarRouter);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectToMongoDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
