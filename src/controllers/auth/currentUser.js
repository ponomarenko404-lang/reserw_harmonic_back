export const currentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { name, email, avatarUrl, articlesAmount } = req.user;

  res.status(200).json({ name, email, avatarUrl, articlesAmount });
};
