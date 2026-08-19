import bcrypt from "bcrypt";
import createHttpError from "http-errors";

import { UserModel } from "../../models/user.js";
import { createSession, setSessionCookies } from "../../services/auth.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw createHttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
    },
  });
};
