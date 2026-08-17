export const getArticleCategories = (req, res) => {
  res.status(200).json({
    categories: ["popular", "general"],
  });
};
