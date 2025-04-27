"use strict";
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
const Database_1 = __importDefault(require("./Database"));
const env_1 = __importDefault(require("../../config/env"));
const cli_color_1 = __importDefault(require("cli-color"));
class LogsMongoClient extends Database_1.default {
    constructor() {
        super();
        this.collectionName = 'logs';
    }
    debug(source, message, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.write('DEBUG', source, message, data);
        });
    }
    info(source, message, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.write('INFO', source, message, data);
        });
    }
    warn(source, message, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.write('WARN', source, message, data);
        });
    }
    error(source, message, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.write('ERROR', source, message, data);
        });
    }
    fatal(source, message, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.write('FATAL', source, message, data);
        });
    }
    _consoleWriter(level, source, message, data) {
        const msg = `[${level.toUpperCase()}] [${source}] ${message}`;
        let mData = null;
        if (data) {
            if (typeof data === 'object') {
                mData = JSON.stringify(data, null, 2);
            }
            else {
                mData = data;
            }
        }
        switch (level.toLowerCase()) {
            case 'fatal':
            case 'error':
                console.error(cli_color_1.default.red(msg));
                if (mData)
                    console.error(cli_color_1.default.red(mData));
                break;
            case 'warn':
                console.warn(cli_color_1.default.yellow(msg));
                if (mData)
                    console.warn(cli_color_1.default.yellow(mData));
                break;
            case 'info':
                console.info(cli_color_1.default.cyanBright(msg));
                if (mData)
                    console.info(cli_color_1.default.cyanBright(mData));
                break;
            case 'debug':
                console.debug(cli_color_1.default.green(msg));
                if (mData)
                    console.debug(cli_color_1.default.green(mData));
                break;
            default:
                console.log(msg);
                if (mData)
                    console.log(mData);
                break;
        }
    }
    write(level, source, message, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connect();
                const timestamp = Math.floor(Date.now() / 1000);
                if (!this.db)
                    throw new Error('Database connection is not initialized.');
                const dbLogLevel = this._logLevels()[env_1.default.log.level.db];
                const consoleLogLevel = this._logLevels()[env_1.default.log.level.console];
                const reqLogLevel = this._logLevels()[level];
                var result;
                if (reqLogLevel >= dbLogLevel) {
                    if (typeof data === 'object') {
                        result = yield this.collection.insertOne(Object.assign({ timestamp,
                            level,
                            source,
                            message }, data));
                    }
                    else {
                        result = yield this.collection.insertOne({
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
            }
            catch (err) {
                this._consoleWriter('FATAL', 'LogsMongoClient.write', err.message, { stack: err.stack });
                return false;
            }
            finally {
                yield this.close();
            }
        });
    }
    _logLevels() {
        return { FATAL: 1000, ERROR: 30, WARN: 20, INFO: 10, DEBUG: 0 };
    }
}
exports.default = LogsMongoClient;
// // const { MongoClient } = require('mongodb');
// const DatabaseMongoClient = require('./Database');
// const config = require('../../config/env');
// const clc = require('cli-color');
// class LogsMongoClient extends DatabaseMongoClient {
//   constructor() {
//     super();
//     this.collection = 'logs';
//   }
//   async debug(source, message, data) {
//     return this.write('DEBUG', source, message, data);
//   }
//   async info(source, message, data) {
//     return this.write('INFO', source, message, data);
//   }
//   async warn(source, message, data) {
//     return this.write('WARN', source, message, data);
//   }
//   async error(source, message, data) {
//     return this.write('ERROR', source, message, data);
//   }
//   async fatal(source, message, data) {
//     return this.write('FATAL', source, message, data);
//   }
//   _consoleWriter(level, source, message, data) {
//     const msg = `[${level.toUpperCase()}] [${source}] ${message}`;
//     let mData = null;
//     if (data) {
//       if (typeof data === 'object') {
//         mData = JSON.stringify(data, null, 2);
//       } else {
//         mData = data;
//       }
//     }
//     switch (level.toLowerCase()) {
//       case 'fatal':
//         console.error(clc.red(msg));
//         if (mData) {
//           console.error(clc.red(mData));
//         } 
//         break;
//       case 'error':
//         console.error(clc.red(msg));
//         if (mData) {
//           console.error(clc.red(mData));
//         }
//         break;
//       case 'warn':
//         console.warn(clc.yellow(msg));
//         if (mData) {
//           console.warn(clc.yellow(mData));
//         }
//         break;
//       case 'info':
//         console.info(clc.cyanBright(msg));
//         if (mData) {
//           console.info(clc.cyanBright(mData));
//         }
//         break;
//       case 'debug':
//         console.debug(clc.green(msg));
//         if (mData) {
//           console.debug(clc.green(mData));
//         }
//         break;
//       default:
//         console.log(msg);
//         if (mData) {
//           console.log(mData);
//         }
//         break;
//     }
//   }
//   async write(level, source, message, data) {
//     try {
//       await this.connect();
//       const timestamp = Math.floor(Date.now() / 1000);
//       const collection = this.db.collection(this.collection);
//       const dbLogLevel = this._logLevels()[config.log.level.db];
//       const consoleLogLevel = this._logLevels()[config.log.level.console];
//       const reqLogLevel = this._logLevels()[level];
//       let result = null;
//       if (reqLogLevel >= dbLogLevel) {
//         if (typeof data === 'object') {
//           result = await collection.insertOne({
//             timestamp, level, message, ...data,
//           });
//         } else {
//           result = await collection.insertOne({
//             timestamp, level, message, data,
//           });
//         }
//       }
//       if (reqLogLevel >= consoleLogLevel) {
//         this._consoleWriter(level, source, message, data);
//       }
//       if (result && (!result.acknowledged || !result.insertedId)) {
//         return false;
//       }
//       return true;
//     } catch (err) {
//       this._consoleWriter('FATAL', 'LogsMongoClient.write', err.message, { stack: err.stack });
//       return false;
//     } finally {
//       await this.close();
//     }
//   }
//   _logLevels() {
//     return { 'FATAL': 1000, 'ERROR': 30, 'WARN': 20, 'INFO': 10, 'DEBUG': 0 };
//   }
// }
// module.exports = LogsMongoClient;
