import { NextFunction, Request, Response } from 'express';
import * as OktaJwtVerifier from '@okta/jwt-verifier';
import HttpException from '../exceptions/HttpException';
import { environment } from '../../environments/environment';

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: environment.ISSUER,
});

export const authHeaderValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization)
      throw new HttpException(
        400,
        'Authorization header Bearer token is missing',
        'Bad Request'
      );
    const [authType, token] = authorization.split(' ');
    if (authType !== 'Bearer')
      throw new Error('Authorization Header Type should be Bearer');
    await oktaJwtVerifier.verifyAccessToken(token, 'api://default');
    next();
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};
