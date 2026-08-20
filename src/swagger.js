import swaggerJsdoc from "swagger-jsdoc";
import joiToSwagger from "joi-to-swagger";
import { registerUserModel } from "./validations/authValidation.js";

const registerUserSchema = joiToSwagger(
  registerUserModel[Object.keys(registerUserModel)[0]],
).swagger;

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Articles API",
      version: "1.0.0",
      description: "API documentation for Articles application",
    },

    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:3000",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "Authentication and session management",
      },
      {
        name: "Users",
        description: "Users, profiles and saved articles",
      },
      {
        name: "Articles",
        description: "Articles management",
      },
      {
        name: "Categories",
        description: "Article categories",
      },
    ],

    components: {
      schemas: {
        RegisterUser: registerUserSchema,

        LoginUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
        },

        User: {
          type: "object",
          required: ["_id", "name", "email"],
          properties: {
            _id: {
              type: "string",
              example: "64f1a2b3c4d5e6f789012345",
            },
            name: {
              type: "string",
              minLength: 2,
              maxLength: 32,
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              maxLength: 64,
              example: "user@example.com",
            },
            avatarUrl: {
              type: "string",
              format: "uri",
              example: "https://goit.global",
            },
            articlesAmount: {
              type: "integer",
              minimum: 0,
              example: 5,
            },
            savedArticles: {
              type: "array",
              items: {
                type: "string",
                example: "64f1a2b3c4d5e6f789012345",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-08-11T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-08-11T10:30:00.000Z",
            },
          },
        },

        Article: {
          type: "object",
          required: [
            "_id",
            "img",
            "title",
            "desc",
            "article",
            "rate",
            "category",
            "ownerId",
            "date",
          ],
          properties: {
            _id: {
              type: "string",
              example: "64f1a2b3c4d5e6f789012345",
            },
            img: {
              type: "string",
              format: "uri",
              example:
                "https://res.cloudinary.com/example/image/upload/article.jpg",
            },
            title: {
              type: "string",
              minLength: 3,
              maxLength: 48,
              example: "The Future of Technology",
            },
            desc: {
              type: "string",
              minLength: 100,
              maxLength: 4000,
              example:
                "Technology continues to transform the way we live and work...",
            },
            article: {
              type: "string",
              minLength: 100,
              example: "Full article content goes here...",
            },
            rate: {
              type: "number",
              minimum: 0,
              example: 4.5,
            },
            category: {
              type: "string",
              enum: ["popular", "general"],
              example: "general",
            },
            ownerId: {
              type: "string",
              example: "64f1a2b3c4d5e6f789012345",
            },
            date: {
              type: "string",
              format: "date-time",
              example: "2026-08-11T10:30:00.000Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-08-11T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-08-11T10:30:00.000Z",
            },
          },
        },

        ArticleOwner: {
          type: "object",
          nullable: true,
          properties: {
            _id: {
              type: "string",
              example: "64f1a2b3c4d5e6f789012345",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            avatarUrl: {
              type: "string",
              format: "uri",
              example: "https://example.com/avatar.jpg",
            },
          },
        },

        ArticleDetails: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64f1a2b3c4d5e6f789012345",
            },
            img: {
              type: "string",
              format: "uri",
              example:
                "https://res.cloudinary.com/example/image/upload/article.jpg",
            },
            title: {
              type: "string",
              example: "The Future of Technology",
            },
            desc: {
              type: "string",
              example:
                "Technology continues to transform the way we live and work...",
            },
            article: {
              type: "string",
              example: "Full article content goes here...",
            },
            rate: {
              type: "number",
              example: 4.5,
            },
            date: {
              type: "string",
              format: "date-time",
              example: "2026-08-11T10:30:00.000Z",
            },
            owner: {
              $ref: "#/components/schemas/ArticleOwner",
            },
          },
        },

        ArticlesResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Article",
              },
            },
            page: {
              type: "integer",
              example: 1,
            },
            perPage: {
              type: "integer",
              example: 12,
            },
            totalItems: {
              type: "integer",
              example: 25,
            },
            totalPages: {
              type: "integer",
              example: 3,
            },
          },
        },

        CreateArticleResponse: {
          type: "object",
          properties: {
            status: {
              type: "integer",
              example: 201,
            },
            message: {
              type: "string",
              example: "Successfully created an article!",
            },
            data: {
              $ref: "#/components/schemas/Article",
            },
          },
        },

        UpdateArticleResponse: {
          type: "object",
          properties: {
            status: {
              type: "integer",
              example: 200,
            },
            message: {
              type: "string",
              example:
                "Article with id 64f1a2b3c4d5e6f789012345 updated successfully",
            },
            data: {
              $ref: "#/components/schemas/Article",
            },
          },
        },

        SavedArticlesResponse: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Article",
              },
            },
            pagination: {
              $ref: "#/components/schemas/Pagination",
            },
          },
        },

        UserArticlesResponse: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Article",
              },
            },
            pagination: {
              $ref: "#/components/schemas/Pagination",
            },
          },
        },

        UserWithArticlesResponse: {
          type: "object",
          properties: {
            user: {
              $ref: "#/components/schemas/User",
            },
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                    example: "64f1a2b3c4d5e6f789012345",
                  },
                  img: {
                    type: "string",
                    format: "uri",
                    example:
                      "https://res.cloudinary.com/example/image/upload/article.jpg",
                  },
                  title: {
                    type: "string",
                    example: "The Future of Technology",
                  },
                  ownerId: {
                    type: "object",
                  },
                },
              },
            },
            pagination: {
              $ref: "#/components/schemas/Pagination",
            },
          },
        },

        AuthorsResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            authors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                    example: "64f1a2b3c4d5e6f789012345",
                  },
                  name: {
                    type: "string",
                    example: "John Doe",
                  },
                  avatarUrl: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com/avatar.jpg",
                  },
                  articlesAmount: {
                    type: "integer",
                    example: 5,
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },
                },
              },
            },
            pagination: {
              type: "object",
              properties: {
                totalAuthors: {
                  type: "integer",
                  example: 50,
                },
                totalPages: {
                  type: "integer",
                  example: 3,
                },
                currentPage: {
                  type: "integer",
                  example: 1,
                },
                perPage: {
                  type: "integer",
                  example: 20,
                },
                hasNextPage: {
                  type: "boolean",
                  example: true,
                },
              },
            },
          },
        },

        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            perPage: {
              type: "integer",
              example: 12,
            },
            totalItems: {
              type: "integer",
              example: 25,
            },
            totalPages: {
              type: "integer",
              example: 3,
            },
          },
        },

        UpdateUserResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example:
                "User profile and contact information updated successfully",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },

        MessageResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Article added to saved articles",
            },
          },
        },
      },

      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
