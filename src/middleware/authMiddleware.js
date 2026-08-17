import createHttpError from "http-errors";
import mongoose from "mongoose";
import { Session } from "../models/session.js";
import { UserModel } from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies;

  if (!sessionId || !accessToken) {
    throw createHttpError(401, "Missing session credentials");
  }

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw createHttpError(401, "Invalid session ID");
  }

  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();

  if (isAccessTokenExpired) {
    throw createHttpError(401, "Access token expired");
  }

  const user = await UserModel.findById(session.userId);

  if (!user) {
    throw createHttpError(401, "User not found");
  }

  req.user = user;
  next();
};

export default authMiddleware;
