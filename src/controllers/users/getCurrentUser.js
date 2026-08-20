import createHttpError from "http-errors";
import { UserModel } from "../../models/user.js";

export const getCurrentUser = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw createHttpError(401, "Unauthorized");
  }

  const user = await UserModel.findById(userId)
    .select("-password")
    .lean();

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  res.status(200).json({
    user,
  });
};
