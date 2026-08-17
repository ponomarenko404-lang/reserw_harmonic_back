import { ArticleModel } from "../../models/article.js";
import createHttpError from "http-errors";

export const getSavedArticles = async (req, res) => {
  const user = req.user;

  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 12;
  const skip = (page - 1) * perPage;

  const totalItems = user.savedArticles.length;

  const articleIds = user.savedArticles.slice(skip, skip + perPage);

 const articles = await ArticleModel.find({
  _id: { $in: articleIds },
}).select("img title desc date ownerId");

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    articles: articles.map(article => ({
  _id: article._id,
  img: article.img,
  title: article.title,
  desc: article.desc,
  date: article.date,
  ownerId: article.ownerId,
})),
    pagination: {
      page,
      perPage,
      totalItems,
      totalPages,
    },
  });
};