import { Book } from '../models/book.model';
import * as express from 'express';
import { Review } from '../models/review.model';
import HttpException from '../exceptions/HttpException';

const createBook = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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
    await book.save();
    return res.status(201).json({
      statusCode: 201,
      message: 'Book successfully created',
    });
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const getBooks = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const getBookById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const bookId = req.params.book_id;
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
      res.json(book);
    }
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

const deleteBookById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const bookId = req.params.book_id;
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
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!req.body.book) {
      res.status(400).json({
        statusCode: 400,
        message: 'update data should not be empty',
      });
    }
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
        reviews = [...reviews];
      }
    }
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
      res.status(200).json({
        statusCode: 200,
        message: 'Successfully Updated.',
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
};
