import createHttpError from "http-errors";
import { ArticleModel } from "../../models/article.js";
import { UserModel } from "../../models/user.js";

export const addSavedArticle = async (req, res) => {
  const { articleId } = req.params;
  const user = req.user;

  const article = await ArticleModel.findById(articleId);

  if (!article) {
    throw createHttpError(404, "Article not found");
  }

  if (user.savedArticles.includes(articleId)) {
    throw createHttpError(409, "Article already saved");
  }

  user.savedArticles.push(articleId);
  await user.save();

  res.status(200).json({
    message: "Article added to saved articles",
  });
};