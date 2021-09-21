import { NextFunction, Request, Response } from 'express';
import * as okta from '@okta/okta-sdk-nodejs';
import { environment } from '../../environments/environment';
import HttpException from '../exceptions/HttpException';
import { logger } from '../utilities/loggerHandlers';

const oktaClient = new okta.Client({
  orgUrl: environment.ORG_URL,
  token: environment.API_TOKEN,
});

const registerUserPage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.render('register');
};

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug(req.body);
  const { email, password, firstName, lastName, login } = req.body;
  const newUserData = {
    profile: { firstName, lastName, email, login },
    credentials: { password: { value: password } },
  };
  try {
    await oktaClient.createUser(newUserData);
    res.send(
      `Registered Successfully. Please click <a href='/login'> here</a> to login.`
    );
  } catch (err) {
    next(new HttpException(400, err.message, err.type));
  }
};

export default {
  registerUserPage,
  registerUser
};
