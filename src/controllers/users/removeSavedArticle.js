import createHttpError from "http-errors";

export const removeSavedArticle = async (req, res) => {
  const { articleId } = req.params;
  const user = req.user;

  const isArticleSaved = user.savedArticles.some(
    (savedArticleId) => savedArticleId.toString() === articleId,
  );

  if (!isArticleSaved) {
    throw createHttpError(404, "Article is not saved");
  }

  user.savedArticles.pull(articleId);
  await user.save();

  res.status(200).json({
    message: "Article removed from saved articles",
  });
};
