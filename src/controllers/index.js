import { getArticleById } from "./articles/getArticleById.js";
import { getArticles } from "./articles/getArticles.js";
import { getArticleCategories } from "./articles/getArticleCategories.js";
import { updateArticle } from "./articles/updateArticle.js";
import { deleteArticle } from "./articles/deleteArticle.js";
import { registerUser } from "./auth/registerUser.js";
import { logoutUser } from "./auth/logoutUser.js";
import { refreshUserSession } from "./auth/refreshUser.js";
import { getUserById } from "./users/getUserById.js";
import { getAuthors } from "./users/getAuthors.js";
import { updateCurrentUser } from "./users/updateCurrentUser.js";
import { getUserArticles } from "./users/getUserArticles.js";
import { getSavedArticles } from "./users/getSavedArticles.js";
import { addSavedArticle } from "./users/addSavedArticle.js";
import { currentUser } from "./auth/currentUser.js";
import { removeSavedArticle } from "./users/removeSavedArticle.js";
import { getCurrentUser } from "./users/getCurrentUser.js";

export const auth = {
  registerUser,
  logoutUser,
  refreshUserSession,
  currentUser,
};
export const articles = {
  getArticleById,
  getArticles,
  getArticleCategories,
  updateArticle,
  deleteArticle,
};

export const users = {
  getUserById,
  getUserArticles,
  getSavedArticles,
  addSavedArticle,
  removeSavedArticle,
  updateCurrentUser,
  getAuthors,
  getCurrentUser,
};

