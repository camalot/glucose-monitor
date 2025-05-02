import config from '../config/env';
import LogsMongoClient from '../libs/mongo/Logs';
import { Request, Response, NextFunction } from 'express';
import Reflection from '../libs/Reflection';

const logger = new LogsMongoClient();
const MODULE = 'UiMiddleware';

export async function allow(req: Request, res: Response, next: NextFunction): Promise<void> {
  const METHOD = Reflection.getCallingMethodName();
  if (!config.ui.enabled) {
    await logger.warn(`${MODULE}.${METHOD}`, 'UI is disabled.');
    res.status(404).end();

    return;
  }

  const allowList: string[] = config.ui.allow || ['*'];
  if (allowList.includes('*')) {
    await logger.debug(`${MODULE}.${METHOD}`, 'Allowing all requests.');
    next();
    return;
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