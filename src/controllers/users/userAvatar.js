import createHttpError from 'http-errors';

import { UserModel } from '../../models/user.js';
import { saveFileToCloudinary } from '../../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  const user = await UserModel.findById(req.user._id);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const result = await saveFileToCloudinary(req.file.buffer, {
    folder: 'avatars',
    publicId: `user-${user._id}`,
    overwrite: true,
    uniqueFilename: false,
  });

  user.avatarUrl = result.secure_url;

  await user.save();

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  });
};