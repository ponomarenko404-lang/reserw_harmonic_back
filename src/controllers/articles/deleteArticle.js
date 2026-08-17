import createHttpError from "http-errors";
import { ArticleModel } from "../../models/article.js";

export const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id; // Assuming you have user authentication and the user ID is available in req.user
    const article = await ArticleModel.findById(id);
    if (!article) {
      throw createHttpError(404, `Article with id ${id} not found`);
    }

    if (article.ownerId.toString() !== ownerId.toString()) {
      throw createHttpError(
        403,
        `You are not authorized to delete this article`,
      );
    }
    await ArticleModel.deleteOne({ _id: id });
    res.status(200).json({
      status: 200,
      message: `Article with id ${id} deleted successfully`,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};
