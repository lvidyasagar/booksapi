export const environment = {
  production: false,
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri:
    process.env.MONGODB_URI ||
    'mongodb+srv://user1:admin@cluster0.b0b4l.mongodb.net/booksapi?authSource=admin&replicaSet=atlas-u4gud8-shard-0&readPreference=primary&ssl=true',
  logDir: process.env.LOG_DIR || 'logs',
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || 'app.log',
};
