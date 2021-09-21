import Joi = require('Joi');
import * as express from 'express';
import { logger } from './loggerHandlers';
import HttpException from '../exceptions/HttpException';

export const JoiValidation = (schema: Joi.ObjectSchema) => 
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      logger.error('error', message);
      next(new HttpException(400, message, 'Bad Request'));
    }
  };
