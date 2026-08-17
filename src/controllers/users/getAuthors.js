import createHttpError from "http-errors";
import { UserModel } from "../../models/user.js";

export const getAuthors = async (req, res, next) => {
  try {
    // 1. ПАГІНАЦІЯ: за замовчуванням сторінка 1
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      throw createHttpError(400, "Invalid page or limit parameters");
    }

    // 2. ЗАПИТИ ДО БД: пошук авторів та рахунок їх загальної кількісті
    const [authors, totalAuthors] = await Promise.all([
      UserModel.find()
        .select("_id name avatarUrl articlesAmount email")
        .sort({ name: 1 }) // сортування авторів за алфавітом
        .skip(skip)
        .limit(limit)
        .lean(), // Оптимізація для миттєвої відповіді

      UserModel.countDocuments(), // підрахунок загальної кількісті користувачів у базі
    ]);

    const totalPages = Math.ceil(totalAuthors / limit);

    // 3. ВІДПОВІДЬ: повернення даних для майбутнього фронтенду
    res.status(200).json({
      success: true,
      authors,
      pagination: {
        totalAuthors,
        totalPages,
        currentPage: page,
        perPage: limit,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error); // Помилка летить у глобальний errorHandler.js
  }
};
