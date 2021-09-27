import * as express from 'express';
import * as uuid from 'node-uuid';
import { environment } from './environments/environment';
import bookRoutes from './app/api-routes/books.route';
import { logger } from './app/utilities/loggerHandlers';
import errorHandler from './app/utilities/errorHandler';
import HttpException from './app/exceptions/HttpException';
import { ExpressOIDC } from '@okta/oidc-middleware';
import { authHeaderValidator } from './app/utilities/auth.validator';
import * as session from 'express-session';
import { mongoConnect } from './app/utilities/mongoose.connect';

const app = express();

const oidc = new ExpressOIDC({
  issuer: environment.ISSUER,
  client_id: environment.CLIENT_ID,
  client_secret: environment.CLIENT_SECRET,
  appBaseUrl: environment.APP_BASE_URL,
  scope: environment.SCOPE,
});

app.set('view engine', 'pug');

app.use(
  session({
    secret: 'letmeshare',
    resave: true,
    saveUninitialized: false,
  })
);

app.use(oidc.router);

app.get('/', (req: any, res) => {
  if(environment.enableAuthentication){
    if (req.userContext) {
      res.render('profile', { user: req.userContext });
    } else {
      res.render('login');
    }
  }else{
    res.redirect('/books');
  }
  
});

app.use('/', (req, res, next) => {
  const transactionId = uuid.v4();
  req.headers['transaction_id'] = transactionId;
  res.setHeader('transaction-Id', transactionId);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.headers.transaction_id}: ${req.method} ${req.path} `);
  next();
});

app.use('/books', authHeaderValidator);
app.use(bookRoutes);


app.use((req, res, next) => {
  next(new HttpException(404, 'URI path not found', 'Not found'));
});

app.use(errorHandler);

const server = app.listen(environment.port, () => {
  logger.info(`Server started at http://localhost:${environment.port}`);
  mongoConnect();
});

server.on('error', () => {
  logger.error('Something went wrong. Server is not running');
});


export default server;