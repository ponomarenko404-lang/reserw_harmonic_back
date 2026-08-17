import createHttpError from "http-errors";
import { ArticleModel } from "../../models/article.js";

export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const ownerId = req.user._id; // Assuming you have user authentication and the user ID is available in req.user

    const updatedArticle = await ArticleModel.findOneAndUpdate(
      { _id: id, ownerId: ownerId }, // Ensure the article belongs to the authenticated user
      updateData,
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!updatedArticle) {
      throw createHttpError(404, `Article with id ${id} not found`);
    }

    res.status(200).json({
      status: 200,
      message: `Article with id ${id} updated successfully`,
      data: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
};
