import { configure, getLogger } from 'log4js';
import { environment } from '../../environments/environment';

configure({
  appenders: {
    console: { type: 'stdout', layout: { type: 'colored' } },
    dateFile: {
      type: 'dateFile',
      filename: `${environment.logDir}/${environment.logFile}`,
      layout: { type: 'basic' },
      compress: true,
      daysToKeep: 14,
      keepFileExt: true
    }
  },
  categories: {
    default: { appenders: ['console', 'dateFile'], level: environment.logLevel }
  }
});

export const logger = getLogger();