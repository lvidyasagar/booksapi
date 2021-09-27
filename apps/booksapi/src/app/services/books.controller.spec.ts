import {
  mockBook,
  mockBookResponse,
  mockBookWithReview,
  mockReview,
  mockSuccessResponse,
} from '../../tests/mockData';
import { Book } from '../models/book.model';
import { getMockReq, getMockRes } from '@jest-mock/express';
import booksController from './books.controller';
import { Review } from '../models/review.model';

describe('Books Controller', () => {
  const { res, next, mockClear } = getMockRes();

  beforeEach(() => {
    mockClear();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('Should create a new book', async () => {
    const req = getMockReq({body : mockBook});
    const spy = jest.fn().mockReturnValue(Promise.resolve(mockSuccessResponse));
    Book.prototype.save = jest.fn().mockImplementationOnce(spy);
    await booksController.createBook(req, res, next);
    expect(res.json).toBeCalledWith(mockSuccessResponse);
    expect(res.status).toBeCalledWith(201);
  });
  it('Should retrieve all books', async () => {
    const req = getMockReq({});
    const spy = jest.fn().mockReturnValue(Promise.resolve([mockBookResponse]));
    Book.find = jest.fn().mockImplementationOnce(spy);
    await booksController.getBooks(req, res, next);
    expect(res.json).toBeCalledWith([mockBookResponse]);
  });

  it('Should retreive book based on bookId', async () => {
    const req = getMockReq({ params: { book_id: 'B10001' } });
    const spy = jest.fn().mockReturnValue(Promise.resolve(mockBookResponse));
    Book.findOne = jest.fn().mockImplementationOnce(spy);
    await booksController.getBookById(req, res, next);
    expect(res.json).toBeCalledWith(mockBookResponse);
  });

  it('Should delete book based on bookId', async () => {
    const req = getMockReq({ params: { book_id: 'B10001' } });
    const response = { statusCode: 200, message: 'Successfully deleted.' };
    const spy = jest.fn().mockReturnValue(Promise.resolve(response));
    Book.findOneAndDelete = jest.fn().mockImplementationOnce(spy);
    await booksController.deleteBookById(req, res, next);
    expect(res.json).toBeCalledWith(response);
    expect(res.status).toBeCalledWith(200);
  });

  it('Should update book based on bookId', async () => {
    const req = getMockReq({ params: { book_id: 'B10001' }, body: mockBook });
    const response = { statusCode: 200, message: 'Successfully Updated.' };
    const spy = jest.fn().mockReturnValue(Promise.resolve(response));
    Book.findOneAndUpdate = jest.fn().mockImplementationOnce(spy);
    await booksController.updateBookById(req, res, next);
    expect(res.json).toBeCalledWith(response);
    expect(res.status).toBeCalledWith(200);
  });

  it('Should retreive book reviews based on bookId ', async () => {
    const req = getMockReq({ params: { book_id: 'B10001' } });
    const response = {
      'book-id': 'B10001',
      reviews: mockBookWithReview.reviews,
    };
    const spy = jest.fn().mockReturnValue(Promise.resolve(mockBookWithReview));
    Book.findOne = jest.fn().mockImplementationOnce(spy);
    await booksController.getBookReviewsByBookId(req, res, next);
    expect(res.json).toBeCalledWith(response);
  });

  it('Should create a new book review based on bookId', async () => {
    const req = getMockReq({
      params: { book_id: 'B10001' },
      body: { mockReview },
    });
    const response = {
      statusCode: 201,
      message: 'Review successfully created',
    };
    const reviewSaveSpy = jest
      .fn()
      .mockReturnValue(Promise.resolve({ ...mockReview, reviewer_id: 1 }));
    Review.prototype.save = jest.fn().mockImplementationOnce(reviewSaveSpy);
    const spy = jest.fn().mockReturnValue(Promise.resolve(response));
    Book.findOneAndUpdate = jest.fn().mockImplementationOnce(spy);
    await booksController.createBookReviewByBookId(req, res, next);
    expect(res.json).toBeCalledWith(response);
    expect(res.status).toBeCalledWith(201);
  });

  it('Should retreive book review based on bookId and reviewId', async () => {
    const req = getMockReq({ params: { book_id: 'B10001', review_id: 1 } });
    const spy = jest.fn().mockReturnValue(Promise.resolve(mockBookWithReview));
    Book.findOne = jest.fn().mockImplementationOnce(spy);
    await booksController.getBookReviewsByReviewId(req, res, next);
    expect(res.json).toBeCalledWith(mockBookWithReview.reviews[0]);
  });

  it('Should update book review based on bookId and reviewId', async () => {
    const req = getMockReq({
      params: { book_id: 'B10001', review_id: 1 },
      body: { mockReview },
    });
    const response = { statusCode: 200, message: 'Successfully Updated.' };
    const spy = jest.fn().mockReturnValue(Promise.resolve(response));
    Book.findOneAndUpdate = jest.fn().mockImplementationOnce(spy);
    await booksController.updateBookReviewById(req, res, next);
    expect(res.json).toBeCalledWith(response);
    expect(res.status).toBeCalledWith(200);
  }, 15000);

  it('Should delete book review based on bookId and reviewId', async () => {
    const req = getMockReq({ params: { book_id: 'B10001', review_id: 1 } });
    const response = { statusCode: 200, message: 'Successfully deleted.' };
    const spy = jest.fn().mockReturnValue(Promise.resolve(response));
    Book.findOneAndUpdate = jest.fn().mockImplementationOnce(spy);
    await booksController.deleteReviewById(req, res, next);
    expect(res.json).toBeCalledWith(response);
    expect(res.status).toBeCalledWith(200);
  });
});

describe('Books Controller Failure cases', () => {
  const { res, next, mockClear } = getMockRes();

  beforeEach(() => {
    mockClear();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('Should create a book', async () => {
    const req = getMockReq();
    const spy = jest.fn().mockRejectedValue(new Error());
    Book.prototype.save = jest.fn().mockImplementationOnce(spy);
    await booksController.createBook(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('Should retrieve the books', async () => {
    const req = getMockReq();
    const spy = jest.fn().mockRejectedValue(new Error());
    Book.find = jest.fn().mockImplementationOnce(spy);
    await booksController.getBooks(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('Should retrieve the book based on bookId', async () => {
    const req = getMockReq();
    const spy = jest.fn().mockRejectedValue(new Error());
    Book.findOne = jest.fn().mockImplementationOnce(spy);
    await booksController.getBookById(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('Should delete the book based on bookId', async () => {
    const req = getMockReq();
    const spy = jest.fn().mockRejectedValue(new Error());
    Book.findOneAndDelete = jest.fn().mockImplementationOnce(spy);
    await booksController.deleteBookById(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('Should update the book data based on bookId', async () => {
    const req = getMockReq();
    const spy = jest.fn().mockRejectedValue(new Error());
    Book.findOneAndUpdate = jest.fn().mockImplementationOnce(spy);
    await booksController.updateBookById(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('Should retrieve the book reviews based on bookId', async () => {
    const req = getMockReq();
    const spy = jest.fn().mockRejectedValue(new Error());
    Book.findOne = jest.fn().mockImplementationOnce(spy);
    await booksController.getBookReviewsByBookId(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('Should create review for book based on bookId', async () => {
    const req = getMockReq();
    const spy = jest.fn().mockRejectedValue(new Error());
    Book.findOneAndUpdate = jest.fn().mockImplementationOnce(spy);
    await booksController.createBookReviewByBookId(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('Should retrieve book review based on bookId and reviewId', async () => {
    const req = getMockReq();
    const spy = jest.fn().mockRejectedValue(new Error());
    Book.findOne = jest.fn().mockImplementationOnce(spy);
    await booksController.getBookReviewsByReviewId(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  it('Should update the book review data based on bookId and reviewId', async () => {
    const req = getMockReq();
    const spy = jest.fn().mockRejectedValue(new Error());
    Book.findOneAndUpdate = jest.fn().mockImplementationOnce(spy);
    await booksController.updateBookReviewById(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('Should delete book review based on bookId and reviewId', async () => {
    const req = getMockReq();
    const spy = jest.fn().mockRejectedValue(new Error());
    Book.findOneAndUpdate = jest.fn().mockImplementationOnce(spy);
    await booksController.deleteReviewById(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
