import * as mongoose from 'mongoose';
import { ReviewSchema, IReview } from './review.model';
import { PublisherSchema, IPublisher } from './publisher.model';
import { autoIncrementModelID } from '../utilities/counterModel';

interface IBook {
  book: {
    book_id: string;
    name: string;
    author: string[];
    price: string;
    reviews: IReview[];
    publisher: IPublisher;
  };
}

const BookSchema = new mongoose.Schema<IBook>(
  {
    book: {
      book_id: {
        type: String,
        unique: true,
      },
      name: {
        type: String,
        trim: true,
        required: 'Book Name is required',
      },
      author: [{ type: String, required: 'Author Names are required' }],
      price: {
        type: String,
        required: 'Book Price is required',
      },
      reviews: [ReviewSchema],
      publisher: PublisherSchema,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

BookSchema.index({ book_id: 1 });

BookSchema.pre('save', function (next) {
  if (this.isNew) {
    autoIncrementModelID('book_id', this, next, 'B', true, 'book');
  }
});

const Book = mongoose.model<IBook>('Book', BookSchema);

export { IBook, Book };
