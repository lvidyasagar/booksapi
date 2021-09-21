import * as express from 'express';
import BooksController from '../services/books.controller';
import UserController from '../services/user.controller';
import { JoiValidation } from '../utilities/joi.validation';
import { bookSchema, reviewSchema, userSchema } from '../utilities/joi.schema';

const router = express.Router();

router
  .route('/register')
  .get(UserController.registerUserPage)
  .post(JoiValidation(userSchema), UserController.registerUser);

router
  .route('/books')
  .get(BooksController.getBooks)
  .post(JoiValidation(bookSchema), BooksController.createBook);

router
  .route('/books/:book_id')
  .get(BooksController.getBookById)
  .put(JoiValidation(bookSchema), BooksController.updateBookById)
  .delete(BooksController.deleteBookById);

router
  .route('/books/:book_id/reviews')
  .get(BooksController.getBookReviewsByBookId)
  .post(JoiValidation(reviewSchema), BooksController.createBookReviewByBookId);

router
  .route('/books/:book_id/reviews/:review_id')
  .get(BooksController.getBookReviewsByReviewId)
  .put(JoiValidation(reviewSchema), BooksController.updateBookReviewById)
  .delete(BooksController.deleteReviewById);

export default router;
