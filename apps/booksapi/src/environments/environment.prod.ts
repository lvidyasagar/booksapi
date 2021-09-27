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
  logFile: process.env.LOG_FILE || 'app.log'
};
