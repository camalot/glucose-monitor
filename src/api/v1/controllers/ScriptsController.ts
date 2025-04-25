import configs from '../../../config';
import * as fs from 'fs';
import LogsMongoClient from '../../../libs/mongo/Logs';
import { Request, Response } from 'express';

const logger = new LogsMongoClient();
const MODULE = 'ScriptsController';

async function config(req: Request, res: Response): Promise<void> {
  const METHOD = 'config';
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
    await logger.error(`${MODULE}.${METHOD}`, err.message, {
      stack: err.stack,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
    });
    res.status(500).end();
  }
}

async function scripts(req: Request, res: Response): Promise<void> {
  const METHOD = 'scripts';
  try {
    // Combine scripts into one file and send
    const scripts = [
      'form-validator.js',
      'weight-chart.js',
      'on-ready.js',
    ];

    res.setHeader('Content-Type', 'application/javascript');

    // Read all scripts and combine them
    let script = '';
    scripts.forEach((s) => {
      script += fs.readFileSync(`assets/javascript/${s}`, 'utf-8');
    });

    res.status(200).send(script).end();
  } catch (err: any) {
    await logger.error(`${MODULE}.${METHOD}`, err.message, {
      stack: err.stack,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
    });
    res.status(500).end();
  }
}

export default {
  config,
  scripts,
};

// const configs = require('../../../config');
// const fs = require('fs');
// const LogsMongoClient = require('../../../libs/mongo/Logs');

// const logger = new LogsMongoClient();
// const MODULE = 'ScriptsController';

// async function config(req, res) {
//   const METHOD = 'config';
//   try {
//     // copy to another object and remove sensitive data
//     let settings = JSON.parse(JSON.stringify(configs));
//     delete settings.mongo;
//     delete settings.ui.allow;
//     res.setHeader('Content-Type', 'application/javascript');
//     return res.status(200).send(`window.GM_CONFIG = ${JSON.stringify(settings)};`).end();
//   } catch (err) {
//     await logger.error(
//       `${MODULE}.${METHOD}`,
//       err.message,
//       { stack: err.stack, headers: req.headers, body: req.body, query: req.query, params: req.params },
//     );
//     return res.status(500).end();
//   }
// }

// async function scripts(req, res) {
//   const METHOD = 'scripts';
//   try {
//     // // combine scripts to one file and send
//     let scripts = [
//       'form-validator.js',
//     ];

//     res.setHeader('Content-Type', 'application/javascript');

//     // read all scripts and combine them
//     let script = '';
//     scripts.forEach((s) => {
//       script += fs.readFileSync(`assets/javascript/${s}`);
//     });

//     return res.status(200).send(script).end();
//   } catch (err) {
//     await logger.error(
//       `${MODULE}.${METHOD}`,
//       err.message,
//       { stack: err.stack, headers: req.headers, body: req.body, query: req.query, params: req.params },
//     );
//     return res.status(500).end();
//   }
// }

// module.exports = {
//   config, scripts,
// };