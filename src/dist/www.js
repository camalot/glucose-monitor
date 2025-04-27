"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const bodyParser = __importStar(require("body-parser"));
const express_handlebars_1 = require("express-handlebars");
const Logs_1 = __importDefault(require("./libs/mongo/Logs"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const ui = __importStar(require("./middleware/ui"));
const app = (0, express_1.default)();
const logger = new Logs_1.default();
app.engine('hbs', (0, express_handlebars_1.engine)({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials'),
    helpers: {
        section: function (name, context) {
            if (!this._sections) {
                this._sections = {};
            }
            if (!this._sections[name]) {
                this._sections[name] = [];
            }
            this._sections[name].push(context.fn(this));
            return null;
        },
        block: function (name) {
            if (!this._sections) {
                this._sections = {};
            }
            const val = (this._sections[name] || []).join('\n');
            this._sections[name] = [];
            return val;
        },
    },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(path.resolve(), 'views'));
console.log('View engine set to hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_1.default.static(path.join(__dirname, 'assets')));
app.get('/', ui.default.allow, (req, res) => {
    return res.render('index', { title: 'Glucose Monitor', config: config_1.default });
});
app.get('/', (req, res, next) => {
    //return res.sendStatus(404);
    return next();
});
app.use('/', routes_1.default);
// app.use(FileNotFoundHandler('Page Not Found', 404));
// 500 error handler
// app.use(ErrorHandler());
function normalizePort(value) {
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
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Attempting to log server start");
    try {
        yield logger.info('glucose_monitor.www', `glucose_monitor listening → ':${port}'`);
    }
    catch (error) {
        console.error('Error logging server start:', error);
    }
    console.log(`Server is running on port: ${port}`);
}));
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
process.on('uncaughtException', (error) => __awaiter(void 0, void 0, void 0, function* () {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    // Handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            yield logger.error('glucose_monitor.bin.www', `${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            yield logger.error('glucose_monitor.bin.www', `${bind} is already in use`);
            process.exit(1);
            break;
        case 'ECONNREFUSED':
            yield logger.error('glucose_monitor.bin.www', `${bind} connection refused`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}));
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
exports.default = app;
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
