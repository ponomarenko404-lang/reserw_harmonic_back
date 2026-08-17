import { Schema, model } from "mongoose";

const articleSchema = new Schema(
  {
    img: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 48,
      trim: true,
    },

    desc: {
      type: String,
      required: true,
      minlength: 100,
      maxlength: 4000,
      trim: true,
    },

    article: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
    },

    rate: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: String,
      enum: ["popular", "general"],
      default: "general",
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ArticleModel = model("article", articleSchema);