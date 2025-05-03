import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { engine as hbsEngine } from 'express-handlebars';
import LogsMongoClient from './libs/mongo/Logs';
import config from './config';
import routes from './routes';
import * as ui from './middleware/ui';
import * as FileNotFoundHandler from './libs/express/handlers/FileNotFoundHandler';
import * as ErrorHandler from './libs/express/handlers/ErrorHandler';
import MigrationRunner from './libs/migrations';

const app = express();
const logger = new LogsMongoClient();

app.engine(
  'hbs',
  hbsEngine({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
      section: function (this: any, name: string, context: any): null {
        if (!this._sections) {
          this._sections = {};
        }

        if (!this._sections[name]) {
          this._sections[name] = [];
        }
        this._sections[name].push(context.fn(this));
        return null;
      },
      block: function (this: any, name: string): string {
        if (!this._sections) {
          this._sections = {};
        }
        const val = (this._sections[name] || []).join('\n');
        this._sections[name] = [];
        return val;
      },
    },
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
console.log('View engine set to hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', ui.allow, (req: Request, res: Response) => {
  return res.render('index', { title: 'Glucose Monitor', config });
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  //return res.sendStatus(404);
  return next();
});

app.use('/', routes);

// setup the MigrationRunner
const migrationRunner = new MigrationRunner();
migrationRunner.initialize();

// app.use(FileNotFoundHandler('Page Not Found', 404));

// 500 error handler
// app.use(ErrorHandler());

function normalizePort(value: string): number | string | false {
  const port = parseInt(value, 10);
  if (isNaN(port)) {
    return value;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

const port = normalizePort(process.env.PORT || '3000') || 3000;
console.log("begin listen action");
app.listen(port, async () => {
  console.log("Attempting to log server start");
  try {
    await logger.info('glucose_monitor.www', `glucose_monitor listening → ':${port}'`);
  } catch(error) {
    console.error('Error logging server start:', error);
  }
  console.log(`Server is running on port: ${port}`);
});

// app.on("error", async (error) => {
//   if (error. !== 'listen') {
//     throw error;
//   }

//   const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

//   // Handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       await logger.error('glucose_monitor.www', `${bind} requires elevated privileges`);
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       await logger.error('glucose_monitor.www', `${bind} is already in use`);
//       process.exit(1);
//       break;
//     case 'ECONNREFUSED':
//       await logger.error('glucose_monitor.www', `${bind} connection refused`);
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// });

process.on('uncaughtException', async (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      await logger.error('glucose_monitor.bin.www', `${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      await logger.error('glucose_monitor.bin.www', `${bind} is already in use`);
      process.exit(1);
      break;
    case 'ECONNREFUSED':
      await logger.error('glucose_monitor.bin.www', `${bind} connection refused`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});



// app.on('error', async (error: NodeJS.ErrnoException) => {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }

//   const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

//   // Handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       await logger.error('glucose_monitor.bin.www', `${bind} requires elevated privileges`);
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       await logger.error('glucose_monitor.bin.www', `${bind} is already in use`);
//       process.exit(1);
//       break;
//     case 'ECONNREFUSED':
//       await logger.error('glucose_monitor.bin.www', `${bind} connection refused`);
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// });

export default app;

// require('dotenv').config();

// // const hbs = require('hbs');
// const hbs = require('express-handlebars');
// const LogsMongoClient = require('../libs/mongo/Logs');
// const config = require('../config');
// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
// const routes = require('../routes/index');
// const ui = require('../middleware/ui');

// const app = express();
// const logger = new LogsMongoClient();

// app.engine('hbs', hbs.engine({
//   extname: 'hbs',
//   layoutsDir: __dirname + '/../views/layouts',
//   partialsDir: __dirname + '/../views/partials', // Ensure this matches your directory structure

//   helpers: {
//     section: function (name, context) {
//       console.log(name);
//       if (!this._sections) {
//         this._sections = {};
//       }

//       if (!this._sections[name]) {
//         this._sections[name] = [];
//       }
//       this._sections[name].push(context.fn(this));
//       console.log(this._sections[name]);
//       return null;
//     },
//     block: function (name) {
//       if (!this._sections) {
//         this._sections = {};
//       }
//       let val = (this._sections[name] || []).join('\n');
//       this._sections[name] = [];
//       return val;
//     }
//   }
// }));
// app.set('view engine', 'hbs');
// app.set('views', path.join(path.resolve(), 'views'));
// // require('../templates/xif');
// // require('../templates/sections');
// // 
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(path.resolve(), 'assets')));

// app.get('/', ui.allow, (req, res) => {
//   return res.render('index', { title: 'Glucose Monitor', config });
// })

// app.get('/', (req, res) => {
//   return res.sendStatus(404);
// });

// app.use('/', routes);

// app.use(
//   require('../libs/express/handlers/FileNotFoundHandler')("Page Not Found", 404)
// );

// // 500 error handler
// app.use(
//   require('../libs/express/handlers/ErrorHandler')()
// );

// module.exports = app;

// function normalizePort(value) {
//   const port = parseInt(value, 10);
//   if (isNaN(port)) {
//     return value;
//   }
//   if (port >= 0) {
//     return port;
//   }
//   return false;
// }

// // const port = parseInt(process.env.PORT || '3000', 10) || 3000;
// const port = normalizePort(process.env.PORT || '3000') || 3000;
// app.listen(port, async () => {
//   await logger.info('glucose_monitor.bin.www', `glucose_monitor listening → ':${port}'`);
// });
// app.on("error", async (error) => {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }

//   let bind = typeof port === 'string'
//     ? 'Pipe ' + port
//     : 'Port ' + port;

//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       logger.error('glucose_monitor.bin.www', bind + ' requires elevated privileges');
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       logger.error('glucose_monitor.bin.www', bind + ' is already in use');
//       process.exit(1);
//       break;
//     case 'ECONNREFUSED':
//       logger.error('glucose_monitor.bin.www', bind + ' connection refused');
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// });
