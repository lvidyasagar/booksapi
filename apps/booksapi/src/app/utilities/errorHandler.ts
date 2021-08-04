import * as express from 'express';
import HttpException from '../exceptions/HttpException';
import { logger } from './loggerHandlers';

function errorHandler(
  error: HttpException,
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const type = error.type || 'System Error';
  logger.error(
    `${request.headers.transaction_id}: ${request.method} ${request.path} throws ${status} -${type} : with message - ${message} `
  );
  response.status(status).json({
    statusCode: status,
    message,
    errorType: type,
  });
}

export default errorHandler;
