import { IBook } from '../app/models/book.model';

export const mockBook = {
    author: ['Nate Murray', 'Felipe Coury', 'Ari Lerner', 'Carlos Taborda'],
    name: 'ng-book: The Complete Guide to Angular',
    price: '$59.00',
    reviews: [],
    publisher: {
      name: 'Fullstack.io',
      location: 'India',
    },
};

export const mockReview = {
  reviewer: 'Kunal Jaggi',
  message: 'Informative, accurate, and insightful.',
};

export const mockBookResponse: IBook = {
    book_id: 'B10001',
    name: mockBook.name,
    author: mockBook.author,
    reviews: [],
    publisher: {
      publisher_id: 'P1001',
      ...mockBook.publisher,
    },
    price: mockBook.price,
};

export const mockBookWithReview: IBook = {
    book_id: 'B10001',
    name: mockBook.name,
    author: mockBook.author,
    reviews: [{ ...mockReview, review_id: 1 }],
    publisher: {
      publisher_id: 'P1001',
      ...mockBook.publisher,
    },
    price: mockBook.price,
};

export const mockSuccessResponse = {
  statusCode: 201,
  message: 'Book successfully created',
};

export const mockUserData={
    email:'test@gmail.com',
    firstName:'fTest',
    lastName:'lTest',
    login:'test@gmail.com',
    password:'test@123'
}