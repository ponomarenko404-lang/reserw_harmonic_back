import multer from "multer";

export const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "Photo must not exceed 1 MB",
      });
    }

    return res.status(400).json({
      message: err.message,
    });
  }

  next(err);
};
