import * as express from 'express';
import BooksController from '../services/books.controller';

const router = express.Router();

router
  .route('/books')
  .get(BooksController.getBooks)
  .post(BooksController.createBook);

router
  .route('/books/:book_id')
  .get(BooksController.getBookById)
  .put(BooksController.updateBookById)
  .delete(BooksController.deleteBookById);

export default router;
