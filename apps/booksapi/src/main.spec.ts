import * as request from 'supertest';
import server from './main';
import * as mongoose from 'mongoose';
import { mockBook, mockReview } from './tests/mockData';

describe('Express Application', () => {
  const accessToken =
    'Bearer eyJraWQiOiJlSGVQeVBBTXV3RUQxN1FEMUFiNVJIbkw4bXZvVUZzOHpHWV81VmNsS0R3IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULm9hamVBRWR2MTNrUmpndjAxdXp6SEluWHIwbVNfU0kycHVQcVN0NWFWT2siLCJpc3MiOiJodHRwczovL2Rldi02ODI2NjkxOS5va3RhLmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2MzI3NDQ4NjAsImV4cCI6MTYzMjc0ODQ2MCwiY2lkIjoiMG9hMXd2ems1NnJHd05FZTY1ZDciLCJ1aWQiOiIwMHUxd3djbmNudVZkUms0RTVkNyIsInNjcCI6WyJvcGVuaWQiLCJwcm9maWxlIl0sInN1YiI6InNhZ2FyLjEwdHYwNTdAZ21haWwuY29tIn0.jnkeUgbjD6G-Oo_xI6xnpuzA-dCdLzgPaA8bkDcy8O8sVjt1qfNz69H7MDvDRByFmGS8-QLFFsOp6s_Pj6SDnDlnW0Xwe1mNR_8GDWM9CsaTTSU2pkH-wIuG22dIKj0U_Oku5Cdx1iwz34HGKupiW7cnLHYTqo4Flf4z5ueJM0wfd0s4k7f0g-nlV7Tw77S1w4lbv0pP-991U5Wtae4VdSBlTm8e3AiMIVrVWm-9KHH_Ke3Ek4lZokwuUIsHYphb1uhhu-evXuZbm-t5lT71FfFEmhgvnFvIGWCNxlqPy0ED0WvanQTwT3N_9kuQ02sPsVGCI_2msazSjPO93-eWsQ';
  afterAll((done) => {
    mongoose.connection.close();
    done();
  });
  it('should throw error not found', (done) => {
    request(server).get('/api').expect(404, done);
  });

  it('should redirect app to login page if user not loggged in', (done) => {
    request(server)
      .get('/')
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.text.includes('login')).toBeTruthy();
        done();
      });
  });

  it('responds to /books', (done) => {
    request(server)
      .get('/books')
      .set({ Authorization: accessToken })
      .expect(200, done);
  });

  it('should validate request body not empty', (done) => {
    request(server)
      .post('/books')
      .send()
      .set({ Authorization: accessToken })
      .then((data) => {
        expect(data.body.message).toContain('"name" is required');
        done();
      });
  });

  it('should validate schema ', (done) => {
    request(server)
      .post('/books')
      .send({})
      .set({ Authorization: accessToken })
      .then((data) => {
        expect(data.body.message).toContain('"name" is required');
        done();
      });
  });

  it('should get error when Authorization is not provided', (done) => {
    request(server)
      .get('/books')
      .then((data) => {
        expect(data.body).toEqual({
          statusCode: 400,
          errorType: "Bad Request",
            message: "Authorization header Bearer token is missing",
        });
        done();
      });
  });

  it('should get error when Authorization token type is not Bearer', (done) => {
    request(server)
      .get('/books')
      .set({ Authorization: 'accessToken' })
      .then((data) => {
        expect(data.body).toEqual({
          statusCode: 400,
          errorType: "System Error",
          message: "Authorization Header Type should be Bearer",
        });
        done();
      });
  });

  it('should throw error when book id is invalid for retriving books', (done) => {
    request(server)
      .get('/books/546')
      .set({ Authorization: accessToken })
      .then((data) => {
        expect(data.body.message).toBe('Book details not found with book Id 546.');
        done();
      });
  });
  it('should throw error when book id is invalid for update', (done) => {
    request(server)
      .put('/books/546')
      .send(mockBook)
      .set({ Authorization: accessToken })
      .then((data) => {
        expect(data.body.message).toBe('Cannot update book with book Id 546. Book Id not found.');
        done();
      });
  });

  it('should throw error when book id is invalid for delete', (done) => {
    request(server)
      .delete('/books/546')
      .set({ Authorization: accessToken })
      .then((data) => {
        expect(data.body.message).toBe('Cannot delete book with book Id 546. Book Id not found.');
        done();
      });
  });

  it('should throw error when book id is invalid for reviews', (done) => {
    request(server)
      .get('/books/546/reviews')
      .set({ Authorization: accessToken })
      .then((data) => {
        expect(data.body.message).toBe('Book details not found with book Id 546.');
        done();
      });
  });
  it('should throw error when book id is invalid for review to create', (done) => {
    request(server)
      .post('/books/546/reviews')
      .send(mockReview)
      .set({ Authorization: accessToken })
      .then((data) => {
        expect(data.body.message).toBe('Book details not found with book Id 546.');
        done();
      });
  });
  it('should throw error when bookId is invalid for to get review based on bookId and reviewId.', (done) => {
    request(server)
      .get('/books/546/reviews/324')
      .set({ Authorization: accessToken })
      .then((data) => {
        expect(data.body.message).toBe(
          'Book details not found with book Id 546.'
        );
        done();
      });
  });

  it('should throw error when reviewId is invalid for to get review based on bookId and reviewId. ', (done) => {
    request(server)
      .get('/books/B10002/reviews/324')
      .set({ Authorization: accessToken })
      .then((data) => {
        expect(data.body.message).toBe(
          'Reviews not found with book Id B10002 and review Id 324.'
        );
        done();
      });
  });

  it('should throw error when bookId or reviewId is invalid to update review', (done) => {
    request(server)
      .put('/books/546/reviews/324')
      .send(mockReview)
      .set({ Authorization: accessToken })
      .then((data) => {
        expect(data.body.message).toBe(
          'Cannot update book review with book Id 546 and review Id 324. Book Id or review Id not found.'
        );
        done();
      });
  });
  it('should throw error when bookId or reviewId is invalid to delete review', (done) => {
    request(server)
      .delete('/books/546/reviews/324')
      .set({ Authorization: accessToken })
      .then((data) => {
        expect(data.body.message).toBe(
          'Cannot delete book review with book Id 546 and review Id 324. Book Id or review Id not found.'
        );
        done();
      });
  });
});
