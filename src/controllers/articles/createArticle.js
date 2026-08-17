import createHttpError from "http-errors";

import { createArticle } from "../../services/articles.js";
import { saveFileToCloudinary } from "../../utils/saveFileToCloudinary.js";

export const createArticleController = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, "Article image is required");
  }

  const uploadResult = await saveFileToCloudinary(req.file.buffer, {
    folder: "articles",
  });

  const articleText = req.body.article.trim();

  const article = await createArticle({
    title: req.body.title.trim(),

    // Якщо frontend передав desc — використовуємо його.
    // Якщо ні — беремо article.
    desc: req.body.desc?.trim() || articleText,

    article: articleText,

    // Дату тепер створює backend.
    date: new Date(),

    img: uploadResult.secure_url,

    rate: 0,

    // Якщо category не прийшла — general.
    category: req.body.category || "general",

    ownerId: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: "Successfully created an article!",
    data: article,
  });
};