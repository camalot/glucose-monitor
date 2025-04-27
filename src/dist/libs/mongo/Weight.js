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
class WeightMongoClient extends Database_1.default {
    constructor() {
        super();
        this.collectionName = 'weight';
        console.log("WeightMongoClient initialized");
    }
    add(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connect();
                yield this.collection.insertOne(entry);
            }
            catch (error) {
                console.error("Error adding weight entry:", error);
            }
        });
    }
    getLimit() {
        return __awaiter(this, arguments, void 0, function* (count = 10) {
            try {
                yield this.connect();
                return yield this.collection
                    .find({}, { sort: { timestamp: 1 }, limit: count }).toArray();
            }
            catch (error) {
                console.error("Error retrieving weight entries:", error);
                return [];
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connect();
                return yield this.collection.find({}, { sort: { timestamp: 1 } }).toArray();
            }
            catch (error) {
                console.error("Error retrieving weight entries:", error);
                return [];
            }
        });
    }
}
exports.default = WeightMongoClient;
