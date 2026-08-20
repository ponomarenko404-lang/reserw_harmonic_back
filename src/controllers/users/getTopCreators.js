import { UserModel } from "../../models/user.js";

export const getTopCreators = async (req, res, next) => {
  try {
    // 1. ЗАВАНТАЖЕННЯ: Беремо всіх авторів з бази безпосередньо у форматі сирих об'єктів
    const rawAuthors = await UserModel.find().lean();

    if (!rawAuthors || rawAuthors.length === 0) {
      return res.status(200).json({ success: true, data: [], authors: [] });
    }

    // 2. АНАЛІЗ ТА ПОРІВНЯННЯ: Конвертуємо поле у справжнє число та сортуємо за спаданням
    const sortedCreators = rawAuthors
      .map((author) => ({
        id: author._id.toString(),
        _id: author._id.toString(),
        name: author.name,
        avatarUrl: author.avatarUrl || "",
        // Перетворюємо поле на число (навіть якщо там записано рядок, воно стане числом)
        parsedAmount: Number(author.articlesAmount || 0)
      }))
      // Порівнюємо значення: автори з найбільшою кількістю статей стають першими
      .sort((a, b) => b.parsedAmount - a.parsedAmount);

    // 3. РЕНДЕРИНГ: Залишаємо виключно ТОП-6 лідерів сайту
    const topCreators = sortedCreators.slice(0, 6).map((author) => ({
      id: author.id,
      _id: author._id,
      name: author.name,
      avatarUrl: author.avatarUrl
    }));

    res.status(200).json({
      success: true,
      data: topCreators,       
      authors: topCreators 
    });

  } catch (error) {
    next(error); 
  }
};