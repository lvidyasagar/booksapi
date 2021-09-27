export const environment = {
  production: true,
  enableAuthentication: false,
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 3000,
  mongoUri:
    process.env.MONGODB_URI ||
    'mongodb+srv://user1:admin@cluster0.b0b4l.mongodb.net/booksapi?authSource=admin&replicaSet=atlas-u4gud8-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
  logDir: process.env.LOG_DIR || 'logs',
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || 'app.log',
  ORG_URL: process.env.ORG_URL || 'https://dev-68266919.okta.com',
  ISSUER: process.env.ISSUER || 'https://dev-68266919.okta.com/oauth2/default',
  CLIENT_ID: process.env.CLIENT_ID || '0oa1wvzk56rGwNEe65d7',
  CLIENT_SECRET:
    process.env.CLIENT_SECRET || 'XYDXuIT4Iz3HyQ5RTIfEc1bFyS0lEcrbaHEFfFK9',
  SCOPE: 'openid profile offline_access',
  API_TOKEN:
    process.env.API_TOKEN || '00KUrGmvxs6coTHKzezZ9UPRsj7NkC1bDmLCcgcABJ',
  APP_BASE_URL: 'http://localhost:3000',
};
