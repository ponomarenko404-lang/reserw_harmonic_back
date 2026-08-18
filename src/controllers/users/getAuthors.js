import createHttpError from "http-errors";
import { UserModel } from "../../models/user.js";

export const getAuthors = async (req, res, next) => {
  try {
    // 1. ПАГІНАЦІЯ
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      throw createHttpError(400, "Invalid page or limit parameters");
    }

    // 2. ЗАПИТИ ДО БД
    const [rawAuthors, totalAuthors] = await Promise.all([
      UserModel.find()
        .select("_id name avatarUrl articlesAmount email")
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Повертає сирі JS об'єкти, щоб точно прочитати _id

      UserModel.countDocuments(),
    ]);

    // Мапінг під інтерфейс IAuthor (id як string, avatarUrl захищений)
    const authors = rawAuthors.map((author) => ({
     id: author._id.toString(),   
     _id: author._id.toString(),  
     name: author.name,
     avatarUrl: author.avatarUrl || "", 
     articlesAmount: author.articlesAmount,
     email: author.email,
   }));

    const totalPages = Math.ceil(totalAuthors / limit);
    const hasNextPage = page < totalPages;

    // 3. ВІДПОВІДЬ: Віддаємо поля на самому верху об'єкта під очікування React Query!
    res.status(200).json({
    success: true,
    data: authors,       // Дублюємо як data для flatMap((page) => page.data)
    authors: authors,    // Дублюємо як authors для старого коду та проксі-сервера
    page,                
    perPage: limit,
    totalItems: totalAuthors,
    totalPages,
    hasNextPage,         
  });
  } catch (error) {
    next(error); 
  }
};
