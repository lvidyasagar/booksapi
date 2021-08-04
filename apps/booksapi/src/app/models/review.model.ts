import * as mongoose from 'mongoose';
import { autoIncrementModelID } from '../utilities/counterModel';

interface IReview {
  review_id: number;
  reviewer: string;
  message: string;
}
const ReviewSchema = new mongoose.Schema<IReview>(
  {
    review_id: {
      type: Number,
      sparse: true,
    },
    reviewer: String,
    message: String,
  },
  { _id: false }
);

ReviewSchema.pre('save', function (next) {
  if (this.isNew) {
    autoIncrementModelID('review_id', this, next);
  }
});

const Review = mongoose.model<IReview>('Review', ReviewSchema);

export { IReview, Review, ReviewSchema };
