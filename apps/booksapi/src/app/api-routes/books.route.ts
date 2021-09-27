import * as express from 'express';
import BooksController from '../services/books.controller';
import UserController from '../services/user.controller';
import { JoiValidation } from '../utilities/joi.validation';
import { bookSchema, reviewSchema, userSchema } from '../utilities/joi.schema';

const router = express.Router();

router.get('/register', UserController.registerUserPage);
router.post(
  '/register',
  JoiValidation(userSchema),
  UserController.registerUser
);

router.get('/books', BooksController.getBooks);
router.post('/books', JoiValidation(bookSchema), BooksController.createBook);

router.get('/books/:book_id', BooksController.getBookById);
router.put(
  '/books/:book_id',
  JoiValidation(bookSchema),
  BooksController.updateBookById
);
router.delete('/books/:book_id', BooksController.deleteBookById);

router.get('/books/:book_id/reviews', BooksController.getBookReviewsByBookId);
router.post(
  '/books/:book_id/reviews',
  JoiValidation(reviewSchema),
  BooksController.createBookReviewByBookId
);

router.get(
  '/books/:book_id/reviews/:review_id',
  BooksController.getBookReviewsByReviewId
);
router.put(
  '/books/:book_id/reviews/:review_id',
  JoiValidation(reviewSchema),
  BooksController.updateBookReviewById
);
router.delete(
  '/books/:book_id/reviews/:review_id',
  BooksController.deleteReviewById
);

export default router;
