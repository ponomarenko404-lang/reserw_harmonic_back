import createHttpError from "http-errors";
import { UserModel } from "../../models/user.js";

export const updateCurrentUser = async (req, res, next) => {
  try {
    // 1. Отримується ID авторизованого користувача з прошарку автентифікації
    // (той. хто робить auth middleware, запише дані юзера в req.user)
    const userId = req.user?._id;

    if (!userId) {
      throw createHttpError(401, "Unauthorized - Missing token");
    }

    // 2. Береться з тіла запиту дані для оновлення профілю та контактної інформації
    const { name, contactInfo } = req.body;

    // Перевіряється, чи передано хоча б одне поле для оновлення
    if (!name && !contactInfo) {
      throw createHttpError(
        400,
        "At least one field (name or contactInfo) must be provided",
      );
    }

    // Збирається об'єкт оновлення
    const updateData = {};
    if (name) updateData.name = name;

    // РЕАЛІЗАЦІЯ ПУНКТУ ЧЕК-ЛІСТА: Оновлення поля контактної інформації
    if (contactInfo) updateData.contactInfo = contactInfo;

    // 3. Оновлюється інформацію про користувача в базі даних MongoDB
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true, // Повертає вже оновлений документ клієнту
        runValidators: true, // Запускає валідацію схеми (наприклад, довжину імені)
      },
    )
      .select("-password")
      .lean(); // Вирізається пароль з відповіді задля безпеки

    if (!updatedUser) {
      throw createHttpError(404, "User not found");
    }

    // 4. Повертається успішну відповідь з оновленими даними
    res.status(200).json({
      success: true,
      message: "User profile and contact information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error); // Помилка летить у глобальний errorHandler.js
  }
};
