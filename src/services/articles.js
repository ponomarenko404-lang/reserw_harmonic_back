import { ArticleModel } from "../models/article.js";

export const createArticle = async (payload) => {
  const article = await ArticleModel.create(payload);

  return article;
};
