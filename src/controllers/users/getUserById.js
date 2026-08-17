import createHttpError from "http-errors";

import { ArticleModel } from "../../models/article.js";
import { UserModel } from "../../models/user.js";

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page);
  const perPage = parseInt(req.query.perPage);
  const skip = (page - 1) * perPage;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw createHttpError(404, "Такий користувач відсутній");
  }

  const [totalItems, articles] = await Promise.all([
    ArticleModel.countDocuments({ ownerId: userId }),
    ArticleModel.find({ ownerId: userId })
      .select("img title ownerId")
      .populate("ownerId", "name savedArticles")
      .skip(skip)
      .limit(perPage),
  ]);
  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    user,
    articles,
    pagination: {
      page,
      perPage,
      totalItems,
      totalPages,
    },
  });
};
