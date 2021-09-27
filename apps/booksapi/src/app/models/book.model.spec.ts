import db from '../../tests/db';
import { Book } from './book.model';
import { mockBook } from '../../tests/mockData';


describe('Book Schema', () => {
  beforeAll(async () => await db.connect());
  afterEach(async () => await db.clearDatabase());
  afterAll(async () => await db.closeDatabase());

  it('Should create new book with test data and validate', async () => {
    const book = new Book(mockBook);
    const newBook = await book.save();

    expect(newBook._id).toBeDefined();
    expect(newBook.name).toBe(mockBook.name);
    expect(newBook.author.length).toBe(mockBook.author.length);
    expect(newBook.publisher.publisher_id).toBeDefined();
    expect(newBook.publisher.name).toEqual(mockBook.publisher.name);
    expect(newBook.publisher.location).toEqual(mockBook.publisher.location);
    expect(newBook.price).toEqual(mockBook.price);
  });

  it('Should throw error when any one of the field is not passed', async () => {
    const book = new Book({
      book:{
          name:'Sample Book'
      }
    });
    try {
      await book.save();
    } catch (err) {
      expect(err.message).toContain('Book validation failed');
    }
  });
});
