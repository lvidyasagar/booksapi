import * as mongoose from 'mongoose';
import { logger } from '../utilities/loggerHandlers';

const Schema = mongoose.Schema;

interface Counter {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<Counter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

counterSchema.index({ _id: 1, seq: 1 });

const counterModel = mongoose.model<Counter>('counters', counterSchema);

const setStartIncrementNumber = (modelName: string, startNumber: number) => {
  counterModel.findById(modelName, async (err, doc) => {
    if (!doc) {
      console.log('Not Doc', doc);
      doc = new counterModel({ _id: modelName, seq: 1 });
      await doc.save();
    }
    if (err) logger.error(err.message);
    if (doc.seq <= startNumber) {
      doc.seq = startNumber;
      await doc.save();
    }
  });
};

const autoIncrementModelID = function (
  modelName,
  doc,
  next,
  prefix?,
  isNested?,
  parent?
) {
  counterModel.findByIdAndUpdate(
    modelName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
    function (error, counter) {
      if (error) return next(error);
      if (isNested) {
        doc[parent][modelName] = prefix ? prefix + counter.seq : counter.seq;
      } else {
        doc[modelName] = prefix ? prefix + counter.seq : counter.seq;
      }
      next();
    }
  );
};

export { setStartIncrementNumber, autoIncrementModelID };
