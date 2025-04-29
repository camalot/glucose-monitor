import configs from '../../../config';
import * as fs from 'fs';
import LogsMongoClient from '../../../libs/mongo/Logs';
import Reflection from '../../../libs/Reflection';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

export default class ScriptsController {

  private logger = new LogsMongoClient();
  private MODULE = this.constructor.name;

  async config(req: Request, res: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      // Copy to another object and remove sensitive data
      const settings = JSON.parse(JSON.stringify(configs));
      delete settings.mongo;
      delete settings.ui.allow;

      res.setHeader('Content-Type', 'application/javascript');
      res
        .status(200)
        .send(`window.GM_CONFIG = ${JSON.stringify(settings)};`)
        .end();
    } catch (err: any) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, err.message, {
        stack: err.stack,
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next(err);
    }
  }

  async scripts(req: Request, res: Response, next: NextFunction): Promise<void> {
    const METHOD = Reflection.getCallingMethodName();
    try {
      // Combine scripts into one file and send
      const scripts = [
        'form-validator.js',
        'weight-chart.js',
        'templates.js',
        'on-ready.js',
      ];

      res.setHeader('Content-Type', 'application/javascript');

      // Read all scripts and combine them
      let script = '';
      const basePath = path.resolve(__dirname, '../../../assets/javascript/');

      scripts.forEach((s) => {
        script += fs.readFileSync(path.join(basePath, s), 'utf-8');
      });

      res.status(200).send(script).end();
    } catch (err: any) {
      await this.logger.error(`${this.MODULE}.${METHOD}`, err.message, {
        stack: err.stack,
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next(err);
    }
  }
}