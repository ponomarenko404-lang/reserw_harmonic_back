import { Session } from "../models/session.js";
import crypto from "crypto";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/time.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

const setSessionCookies = (res, session) => {
  res.cookie("sessionId", session._id.toString(), {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });
  res.cookie("accessToken", session.accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie("refreshToken", session.refreshToken, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });
};
async function createSession(userId) {
  return Session.create({
    userId,
    accessToken: crypto.randomUUID(),
    refreshToken: crypto.randomUUID(),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
}

const clearSessionCookies = (res) => {
  res.clearCookie("sessionId", { ...cookieOptions });
  res.clearCookie("refreshToken", { ...cookieOptions });
  res.clearCookie("accessToken", { ...cookieOptions });
};

export { setSessionCookies, createSession, clearSessionCookies };
