import createHttpError from "http-errors";
import { Session } from "../../models/session.js";
import {
  clearSessionCookies,
  createSession,
  setSessionCookies,
} from "../../services/auth.js";

export const refreshUserSession = async (req, res, next) => {
  try {
    const { refreshToken, sessionId } = req.cookies;
    const session = await Session.findOne({ _id: sessionId, refreshToken });

    if (!session) {
      clearSessionCookies(res);
      throw createHttpError(401, "Session not found");
    }

    const isSessionTokenExpired = session.refreshTokenValidUntil < new Date();
    if (isSessionTokenExpired) {
      await Session.deleteOne({ _id: session._id });
      clearSessionCookies(res);
      throw createHttpError(401, "Session token expired");
    }

    await Session.deleteOne({ _id: session._id });
    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);
    res.status(200).json({ message: "Session refreshed" });
  } catch (error) {
    next(error);
  }
};
