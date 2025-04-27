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
const Logs_1 = __importDefault(require("./Logs"));
const logger = new Logs_1.default();
const MODULE = 'SettingsMongoClient';
class SettingsMongoClient extends Database_1.default {
    constructor() {
        super();
        this.collectionName = 'settings';
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const method = 'list';
            try {
                yield this.connect();
                const result = yield this.collection.find().toArray();
                return result;
            }
            catch (err) {
                yield logger.error(`${MODULE}.${method}`, err.message, { stack: err.stack });
                return [];
            }
        });
    }
    get(key, defaultValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'get';
            try {
                yield this.connect();
                if (!this.db)
                    throw new Error('Database connection is not initialized.');
                this.collection = this.db.collection(this.collectionName);
                const result = yield this.collection.findOne({ name: key });
                return result ? result.value : defaultValue;
            }
            catch (err) {
                yield logger.error(`${MODULE}.${METHOD}`, err.message, { stack: err.stack });
                return defaultValue;
            }
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'set';
            try {
                yield this.connect();
                if (!this.db)
                    throw new Error('Database connection is not initialized.');
                this.collection = this.db.collection(this.collectionName);
                const result = yield this.collection.updateOne({ name: key }, { $set: { value } }, { upsert: true });
                return result.acknowledged;
            }
            catch (err) {
                yield logger.error(`${MODULE}.${METHOD}`, err.message, { stack: err.stack });
                return false;
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
}
exports.default = SettingsMongoClient;
// // const { MongoClient, ObjectId } = require('mongodb');
// const DatabaseMongoClient = require('./Database');
// const config = require('../../config');
// const LogsMongoClient = require('./Logs');
// const logger = new LogsMongoClient();
// const MODULE = 'SettingsMongoClient';
// class SettingsMongoClient extends DatabaseMongoClient {
//   constructor() {
//     super();
//     this.collection = 'settings';
//   }
//   async list() {
//     const method = 'list';
//     try {
//       await this.connect();
//       const collection = this.db.collection(this.collection);
//       const result = await collection.find().toArray();
//       return result;
//     } catch (err) {
//       await logger.error(`${MODULE}.${method}`, err.message, { stack: err.stack });
//       return [];
//     }
//   }
//   async get(key, defaultValue) {
//     const METHOD = 'get';
//     try {
//       await this.connect();
//       const collection = this.db.collection(this.collection);
//       const result = await collection.findOne({ name: key });
//       return result ? result.value : defaultValue;
//     } catch (err) {
//       await logger.error(`${MODULE}.${METHOD}`, err.message, { stack: err.stack });
//       return defaultValue;
//     }
//   }
//   async set(key, value) {
//     const METHOD = 'set';
//     try {
//       await this.connect();
//       const collection = this.db.collection(this.collection);
//       const result = await collection.updateOne({ name: key }, { $set: {value} }, {upsert: true});
//       return result;
//     } catch (err) {
//       await logger.error(`${MODULE}.${METHOD}`, err.message, { stack: err.stack });
//       return null;
//     }
//   }
//   async save() {
//     throw new Error('Not implemented');
//   }
// }
// module.exports = SettingsMongoClient;
