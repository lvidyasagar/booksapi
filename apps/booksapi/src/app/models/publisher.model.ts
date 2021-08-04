import * as mongoose from 'mongoose';
import { autoIncrementModelID } from '../utilities/counterModel';

interface IPublisher {
  publisher_id: string;
  name: string;
  location: string;
}

const PublisherSchema = new mongoose.Schema<IPublisher>(
  {
    publisher_id: {
      type: String,
      unique: true,
    },
    name: String,
    location: String,
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

PublisherSchema.index({ publisher_id: 1 });

PublisherSchema.pre('save', function (next) {
  if (this.isNew) {
    autoIncrementModelID('publisher_id', this, next, 'P');
  }
});

const Publisher = mongoose.model<IPublisher>('Publisher', PublisherSchema);

export { IPublisher, Publisher, PublisherSchema };
