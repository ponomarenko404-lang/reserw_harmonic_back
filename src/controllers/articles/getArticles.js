import { ArticleModel } from "../../models/article.js";

export const getArticles = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 12,
      category,
      sortBy = "date",
      sortOrder = "desc",
    } = req.query;

    const currentPage = Number(page);
    const itemsPerPage = Number(perPage);

    const skip = (currentPage - 1) * itemsPerPage;

    const filter = {};

    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const sort =
      category === "popular"
        ? { rate: -1, _id: -1 }
        : { [sortBy]: sortDirection, _id: sortDirection };

    const [articles, totalItems] = await Promise.all([
      ArticleModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),

      ArticleModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const articlesData = articles.map((article) => ({
      _id: article._id.toString(),
      img: article.img,
      title: article.title,
      desc: article.desc,
      article: article.article,
      rate: article.rate,
      ownerId: article.ownerId,
      date: article.date,
    }));

    res.status(200).json({
      data: articlesData,
      page: currentPage,
      perPage: itemsPerPage,
      totalItems,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};