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
const cli_color_1 = __importDefault(require("cli-color"));
class GlucoseMongoClient extends Database_1.default {
    constructor() {
        super();
        this.collectionName = 'glucose';
        console.log("GlucoseMongoClient initialized");
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("GlucoseMongoClient connecting");
                yield this.connect();
                console.log("get all entries from db");
                const entries = yield this.collection.find({}, { sort: { timestamp: 1 } }).toArray();
                console.log("got result");
                return entries;
            }
            catch (error) {
                console.error("Error fetching glucose entries:", error);
                throw error;
            }
        });
    }
    getLimit() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            try {
                console.log("GlucoseMongoClient connecting");
                yield this.connect();
                console.log("get only entries from db");
                const entries = yield this.collection.find({}, { sort: { timestamp: 1 } }).limit(limit).toArray();
                entries.forEach(entry => {
                    entry.id = entry._id.toString();
                    delete entry._id;
                });
                console.log("got result");
                return entries;
            }
            catch (error) {
                console.error("Error fetching glucose entries:", error);
                throw error;
            }
        });
    }
    getLatest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const latestEntry = yield this.collection.find().sort({ timestamp: -1 }).limit(1).toArray();
                if (latestEntry.length > 0) {
                    latestEntry[0].id = latestEntry[0]._id.toString();
                    delete latestEntry[0]._id;
                    return latestEntry[0];
                }
                return null;
            }
            catch (error) {
                console.error("Error fetching latest glucose entry:", error);
                throw error;
            }
        });
    }
    record(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connect();
                yield this.collection.insertOne(data);
                console.log(cli_color_1.default.green('Glucose entry recorded successfully.'));
            }
            catch (error) {
                console.error(cli_color_1.default.red('Error recording glucose entry:'), error);
                throw error;
            }
        });
    }
}
exports.default = GlucoseMongoClient;
