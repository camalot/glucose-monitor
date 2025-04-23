import config from '../config/env';
import LogsMongoClient from '../libs/mongo/Logs';
import { Request, Response, NextFunction } from 'express';

const logger = new LogsMongoClient();
const MODULE = 'UiMiddleware';

async function allow(req: Request, res: Response, next: NextFunction): Promise<void> {
  const METHOD = 'allow';
  if (!config.ui.enabled) {
    await logger.warn(`${MODULE}.${METHOD}`, 'UI is disabled.');
    res.status(404).end();

    return;
  }

  const allowList: string[] = config.ui.allow || ['*'];
  if (allowList.includes('*')) {
    await logger.debug(`${MODULE}.${METHOD}`, 'Allowing all requests.');
    next();
    return
  }

  const requestHostName: string = req.hostname;
  if (allowList.includes(requestHostName)) {
    next();
    return;
  }

  // Loop through the allow list and create a regex to match the host name
  const regex = new RegExp(
    allowList.join('|').replace(/\./g, '\\.').replace(/\*/g, '.*')
  );
  if (regex.test(requestHostName)) {
    next();
    return;
  }

  await logger.warn(`${MODULE}.${METHOD}`, `Blocked request to ${requestHostName}`);
  res.status(404).end();

  return;
}

export default {
  allow,
};

// const config = require('../config/env');
// const LogsMongoClient = require('../libs/mongo/Logs');

// const logger = new LogsMongoClient();
// const MODULE = 'UiMiddleware';

// async function allow(req, res, next) {
//   const METHOD = 'allow';
//   if (!config.ui.enabled) {
//     await logger.warn(`${MODULE}.${METHOD}`, 'UI is disabled.');
//     return res.status(404).end();
//   }

//   const allowList = config.ui.allow || ['*'];
//   if (allowList.includes('*')) {
//     await logger.debug(`${MODULE}.${METHOD}`, 'Allowing all requests.');
//     return next();
//   }

//   const reqestHostName = req.hostname;
//   if (allowList.includes(reqestHostName)) {
//     return next();
//   }

//   // loop allow list and create a regex to match the host name
//   const regex = new RegExp(allowList.join('|').replace(/\./g, '\\.').replace(/\*/g, '.*'));
//   if (regex.test(reqestHostName)) {
//     return next();
//   }

//   await logger.warn(`${MODULE}.${METHOD}`, `Blocked request to ${reqestHostName}`);
//   return res.status(404).end();
// }

// module.exports = {
//   allow,
// };
