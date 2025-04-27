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
const mongodb_1 = require("mongodb");
const env_1 = __importDefault(require("../../config/env"));
class DatabaseMongoClient {
    constructor() {
        this.database = env_1.default.mongo.database;
        this.url = env_1.default.mongo.url;
        this.client = null;
        this.db = null;
        this.collection = null;
        this.collectionName = '';
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client && this.db) {
                return;
            }
            console.log("Connecting to MongoDB...");
            this.client = yield mongodb_1.MongoClient.connect(this.url, {});
            console.log("Connected to MongoDB");
            this.db = this.client.db(this.database);
            this.collection = this.db.collection(this.collectionName);
            console.log("Database selected:", this.database);
            console.log("Connection established successfully.");
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                return;
            }
            yield this.client.close();
            this.client = null;
            this.db = null;
        });
    }
}
exports.default = DatabaseMongoClient;
// const { MongoClient } = require('mongodb');
// const config = require('../../config');
// class DatabaseMongoClient {
//   constructor() {
//     this.database = config.mongo.database;
//     this.url = config.mongo.url;
//     this.client = null;
//     this.db = null;
//   }
//   async connect() {
//     if (this.client && this.db) {
//       return;
//     }
//     this.client = await MongoClient.connect(this.url, {});
//     this.db = this.client.db(this.database);
//   }
//   async close() {
//     if (!this.client) {
//       return;
//     }
//     await this.client.close();
//     this.client = null;
//     this.db = null;
//   }
// }
// module.exports = DatabaseMongoClient;
