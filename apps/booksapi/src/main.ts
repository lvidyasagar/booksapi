import * as express from 'express';
import * as mongoose from 'mongoose';
import * as uuid from 'node-uuid';
import { environment } from './environments/environment';
import bookRoutes from './app/api-routes/books.route';
import { logger } from './app/utilities/loggerHandlers';
import errorHandler from './app/utilities/errorHandler';
import HttpException from './app/exceptions/HttpException';
import { setStartIncrementNumber } from './app/utilities/counterModel';

const app = express();

app.use('/', (req, res, next) => {
  const transactionId = uuid.v4();
  req.headers['transaction_id'] = transactionId;
  res.setHeader('Transaction-Id', transactionId);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.headers.transaction_id}: ${req.method} ${req.path} `);
  next();
});

app.use(bookRoutes);

app.use((req, res, next) => {
  next(new HttpException(404, 'URI path not found', 'Not found'));
});

app.use(errorHandler);

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

const server = app.listen(environment.port, () => {
  logger.info(`Server started at http://localhost:${environment.port}`);
});

server.on('error', () => {
  logger.error('Something went wrong. Server is not running');
});
