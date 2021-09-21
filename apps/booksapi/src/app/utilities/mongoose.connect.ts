import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { setStartIncrementNumber } from './counterModel';
import { logger } from './loggerHandlers';

export const mongoConnect = async () => {
  mongoose.connect(environment.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  mongoose.connection.on('error', () => {
    logger.error(`unable to connect to database: ${environment.mongoUri}`);
  });

  mongoose.connection.once('open', function () {
    logger.info('Mongo db is connected');
    setStartIncrementNumber('book_id', 10000);
    setStartIncrementNumber('publisher_id', 1000);
  });
};
