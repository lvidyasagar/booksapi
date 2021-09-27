import { getMockReq, getMockRes } from '@jest-mock/express';
import { mockUserData } from '../../tests/mockData';
import userController from './user.controller';
import * as okta from '@okta/okta-sdk-nodejs';

jest.mock('@okta/okta-sdk-nodejs');
describe('User Controller', () => {
  const { res, next, mockClear } = getMockRes();

  const oktaClient = new okta.Client({
    orgUrl: 'testUrl',
    token: 'TeStToKen',
  });

  beforeEach(() => {
    mockClear();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('Should redirect to register page for new okta user', async ()=>{
    const req = getMockReq();
    await userController.registerUserPage(req, res, next);
    expect(res.render).toBeCalledWith('register');
  })

  it('Should create a new okta user', async ()=>{
    const req = getMockReq({body: mockUserData });
    const spy = jest.fn().mockReturnValue(Promise.resolve('success'));
    oktaClient.createUser = jest.fn().mockImplementationOnce(spy);
    await userController.registerUser(req, res, next);
    expect(res.send).toBeCalledWith(`Registered Successfully. Please click <a href='/login'> here</a> to login.`);
  })
});
