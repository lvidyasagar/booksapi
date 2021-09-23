import Joi = require('Joi');

export const bookSchema = Joi.object({
  book: {
    book_id: Joi.string().optional(),
    name: Joi.string().required(),
    author: Joi.array().items(Joi.string().required()),
    price: Joi.string().required(),
    reviews: Joi.array().optional(),
    publisher: Joi.object({
      publisher_id: Joi.string().optional(),
      name: Joi.string().required(),
      location: Joi.string().required(),
    }).required(),
  },
});

export const reviewSchema = Joi.object({
  review_id: Joi.string().optional(),
  reviewer: Joi.string().required(),
  message: Joi.string().required(),
});

export const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  login: Joi.string().required(),
  password: Joi.string().required(),
});
