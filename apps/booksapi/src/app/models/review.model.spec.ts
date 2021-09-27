import db from '../../tests/db';
import { Review } from './review.model';
import { mockReview } from '../../tests/mockData';


describe('Book Schema', () => {
  beforeAll(async () => await db.connect());
  afterEach(async () => await db.clearDatabase());
  afterAll(async () => await db.closeDatabase());

  it('Should create new book review with test data and validate', async () => {
    const review = new Review(mockReview);
    const newBookReview = await review.save();
    expect(newBookReview._id).toBeDefined();
    expect(newBookReview.reviewer).toBe(mockReview.reviewer);
    expect(newBookReview.message).toBe(mockReview.message);
  });

  it('Should throw error when any one of the field is not passed', async () => {
    const review = new Review({
      reviewer: 'Vidyasagar',
    });
    try {
      await review.save();
    } catch (err) {
      expect(err.message).toContain('Review validation failed');
    }
  });
});
