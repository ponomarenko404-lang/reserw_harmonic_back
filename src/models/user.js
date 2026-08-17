import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 64,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 64,
    },
    avatarUrl: {
      type: String,
      default: "https://goit.global",
    },
    articlesAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    savedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: "articles",
      },
    ],
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function () {
  console.log("userSchema.methods.toJSON");
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UserModel = model("user", userSchema);
