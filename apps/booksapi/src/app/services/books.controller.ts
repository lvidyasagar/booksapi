import { Book } from '../models/book.model';
import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/review.model';
import HttpException from '../exceptions/HttpException';
import { logger } from '../utilities/loggerHandlers';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.book) {
    next(
      new HttpException(
        400,
        'Request Body data should not be empty',
        'Bad Request'
      )
    );
  }

  const book = new Book(req.body);
  try {
    logger.debug('Create book Api invoked');
    await book.save();
    logger.info('Successfully created the book');
    return res.status(201).json({
      statusCode: 201,
      message: 'Book successfully created',
    });
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debug('Get books Api invoked');
    const books = await Book.find();
    logger.info('Get books Api response sent');
    res.json(books);
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.book_id;
    logger.debug('get book details by book Id Api invoked');
    const book = await Book.findOne({ 'book.book_id': bookId });
    if (!book) {
      next(
        new HttpException(
          404,
          `Book details not found with book Id ${bookId}.`,
          'Not Found'
        )
      );
    } else {
      logger.info('get book details by book Id Api response sent');
      res.json(book);
    }
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const deleteBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.book_id;
    logger.debug('Delete book details by book Id Api invoked');
    const book = await Book.findOneAndDelete({ 'book.book_id': bookId });
    if (!book) {
      next(
        new HttpException(
          404,
          `Cannot delete book with book Id ${bookId}. Book Id not found.`,
          'Not Found'
        )
      );
    } else {
      logger.info(`Book with bookId ${bookId} deleted Successfully`);
      res.status(200).json({
        statusCode: 200,
        message: 'Successfully deleted.',
      });
    }
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const updateBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.book_id;
    const updatedBook = {
      'book.name': req.body.book.name,
      'book.author': req.body.book.author,
      'book.price': req.body.book.price,
      'book.publisher.name': req.body.book.publisher.name,
      'book.publisher.location': req.body.book.publisher.location,
    };
    let reviews = [];
    const reqBodyReviews = req.body.book.reviews || [];
    if (Array.isArray(reqBodyReviews) && reqBodyReviews.length > 0) {
      for (let i = 0; i < reqBodyReviews.length; i++) {
        const newReview = new Review({
          reviewer: reqBodyReviews[i].reviewer,
          message: reqBodyReviews[i].message,
        });
        await newReview.save();
        reviews = [...reviews, newReview];
      }
    }
    logger.debug('Update book details Api invoked');
    const book = await Book.findOneAndUpdate(
      { 'book.book_id': bookId },
      {
        $set: updatedBook,
        'book.reviews': reviews,
      },
      { new: true }
    );

    if (!book) {
      next(
        new HttpException(
          404,
          `Cannot update book with book Id ${bookId}. Book Id not found.`,
          'Not Found'
        )
      );
    } else {
      logger.info(`Book with bookId ${bookId} details updated successfully.`);
      res.status(200).json({
        statusCode: 200,
        message: 'Successfully Updated.',
      });
    }
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const getBookReviewsByBookId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.book_id;
    logger.debug('Get book reviews Api invoked');
    const book = await Book.findOne({ 'book.book_id': bookId });
    if (!book) {
      next(
        new HttpException(
          404,
          `Book details not found with book Id ${bookId}.`,
          'Not Found'
        )
      );
    } else {
      logger.info('Book reviews Api response sent');
      res.json({
        'book-id': bookId,
        reviews: book.book.reviews,
      });
    }
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const createBookReviewByBookId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.book_id;
  const review = new Review(req.body);
  await review.save();
  try {
    logger.debug('Create book review Api invoked');
    const book = await Book.findOneAndUpdate(
      { 'book.book_id': bookId },
      { $push: { 'book.reviews': review } }
    );
    if (!book) {
      const message = `Book details not found with book Id ${bookId}.`;
      next(new HttpException(404, message, 'Not Found'));
    } else {
      logger.info(`Book review is created for book with bookId ${bookId}`);
      return res.status(201).json({
        statusCode: 201,
        message: 'Review successfully created',
      });
    }
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const getBookReviewsByReviewId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.book_id;
    const reviewId = parseInt(req.params.review_id);
    logger.debug('Get book review with bookId and reviewId Api invoked');
    const book = await Book.findOne({ 'book.book_id': bookId });
    const review = book.book.reviews.find(
      (review) => review.review_id === reviewId
    );
    if (!book) {
      const message = `Book details not found with book Id ${bookId}.`;
      next(new HttpException(404, message, 'Not Found'));
    } else if (book && !review) {
      const message = `Reviews not found with book Id ${bookId} and review Id ${reviewId}.`;
      next(new HttpException(404, message, 'Not Found'));
    } else {
      logger.info('Get book review with bookId and reviewId Api response sent');
      res.json(review);
    }
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const updateBookReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.book_id;
    const reviewId = req.params.review_id;
    logger.debug('Update book review Api invoked');
    const book = await Book.findOneAndUpdate(
      { 'book.reviews': { $elemMatch: { review_id: reviewId } } },
      {
        $set: {
          'book.reviews.$.reviewer': req.body.reviewer,
          'book.reviews.$.message': req.body.message,
        },
      }
    );
    if (!book) {
      next(
        new HttpException(
          404,
          `Cannot update book review with book Id ${bookId} and review Id ${reviewId}. Book Id or review Id not found.`,
          'Not Found'
        )
      );
    } else {
      logger.info(`Updated book reviews for bookId ${bookId}`);
      res.status(200).json({
        statusCode: 200,
        message: 'Successfully Updated.',
      });
    }
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const deleteReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.book_id;
    const reviewId = req.params.review_id;
    logger.debug('Delete book review Api invoked');
    const book = await Book.findOneAndUpdate(
      { 'book.book_id': bookId },
      { $pull: { 'book.reviews': { review_id: reviewId } } }
    );
    if (!book) {
      next(
        new HttpException(
          404,
          `Cannot delete book review with book Id ${bookId} and review Id ${reviewId}. Book Id or review Id not found.`,
          'Not Found'
        )
      );
    } else {
      logger.info(
        `"Successfully deleted book review with bookId ${bookId} and reviewId ${reviewId} `
      );
      res.status(200).json({
        statusCode: 200,
        message: 'Successfully deleted.',
      });
    }
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

export default {
  createBook,
  getBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  getBookReviewsByBookId,
  createBookReviewByBookId,
  getBookReviewsByReviewId,
  updateBookReviewById,
  deleteReviewById,
};
