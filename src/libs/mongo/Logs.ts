// @ts-nocheck
import DatabaseMongoClient from './Database';
import config from '../../config/env';
import clc from 'cli-color';
import { Collection } from 'mongodb';

interface LogData {
  [key: string]: any;
}

export default class LogsMongoClient extends DatabaseMongoClient<LogData> {

  constructor() {
    super();
    this.collectionName = 'logs';
  }

  async debug(source: string, message: string, data?: LogData): Promise<boolean> {
    return this.write('DEBUG', source, message, data);
  }

  async info(source: string, message: string, data?: LogData): Promise<boolean> {
    return this.write('INFO', source, message, data);
  }

  async warn(source: string, message: string, data?: LogData): Promise<boolean> {
    return this.write('WARN', source, message, data);
  }

  async error(source: string, message: string, data?: LogData): Promise<boolean> {
    return this.write('ERROR', source, message, data);
  }

  async fatal(source: string, message: string, data?: LogData): Promise<boolean> {
    return this.write('FATAL', source, message, data);
  }

  private _consoleWriter(level: string, source: string, message: string, data?: LogData | string): void {
    const msg = `[${level.toUpperCase()}] [${source}] ${message}`;
    let mData: string | null = null;

    if (data) {
      if (typeof data === 'object') {
        mData = JSON.stringify(data, null, 2);
      } else {
        mData = data;
      }
    }

    switch (level.toLowerCase()) {
      case 'fatal':
      case 'error':
        console.error(clc.red(msg));
        if (mData) console.error(clc.red(mData));
        break;
      case 'warn':
        console.warn(clc.yellow(msg));
        if (mData) console.warn(clc.yellow(mData));
        break;
      case 'info':
        console.info(clc.cyanBright(msg));
        if (mData) console.info(clc.cyanBright(mData));
        break;
      case 'debug':
        console.debug(clc.green(msg));
        if (mData) console.debug(clc.green(mData));
        break;
      default:
        console.log(msg);
        if (mData) console.log(mData);
        break;
    }
  }

  async write(level: string, source: string, message: string, data?: LogData | string): Promise<boolean> {
    try {
      await this.connect();
      const timestamp = Math.floor(Date.now() / 1000);
      if (!this.db) throw new Error('Database connection is not initialized.');

      const dbLogLevel = this._logLevels()[config.log.level.db];
      const consoleLogLevel = this._logLevels()[config.log.level.console];
      const reqLogLevel = this._logLevels()[level];

      var result;
      if (reqLogLevel >= dbLogLevel) {
        if (typeof data === 'object') {
          result = await this.collection.insertOne({
            timestamp,
            level,
            source,
            message,
            ...data,
          });
        } else {
          result = await this.collection.insertOne({
            timestamp,
            level,
            source,
            message,
            data,
          });
        }
      }

      if (reqLogLevel >= consoleLogLevel) {
        this._consoleWriter(level, source, message, data);
      }

      // && (!result.acknowledged || !result.insertedId)

      if (!result) {
        return false;
      }
      return true;
    } catch (err: any) {
      this._consoleWriter('FATAL', 'LogsMongoClient.write', err.message, { stack: err.stack });
      return false;
    }
  }

  private _logLevels(): Record<string, number> {
    return { FATAL: 1000, ERROR: 30, WARN: 20, INFO: 10, DEBUG: 0 };
  }
}