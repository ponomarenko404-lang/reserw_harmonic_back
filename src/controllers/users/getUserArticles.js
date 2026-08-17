import createHttpError from "http-errors";

import { ArticleModel } from "../../models/article.js";
import { UserModel } from "../../models/user.js";

export const getUserArticles = async (req, res) => {
  const { userId } = req.params;

  const page = parseInt(req.query.page);
  const perPage = parseInt(req.query.perPage);
  const skip = (page - 1) * perPage;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw createHttpError(404, "Такий користувач відсутній");
  }

  const totalItems = await ArticleModel.countDocuments({
    ownerId: userId,
  });

  const articles = await ArticleModel.find({
    ownerId: userId,
  })
    .select("img title desc article rate ownerId date")
    .skip(skip)
    .limit(perPage)
    .lean();

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    articles,
    pagination: {
      page,
      perPage,
      totalItems,
      totalPages,
    },
  });
};