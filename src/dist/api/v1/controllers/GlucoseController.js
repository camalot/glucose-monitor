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
const Logs_1 = __importDefault(require("../../../libs/mongo/Logs"));
const Glucose_1 = __importDefault(require("../../../libs/mongo/Glucose"));
const GlucoseEntry_1 = __importDefault(require("../../../models/GlucoseEntry"));
const glucose_1 = __importDefault(require("../../../libs/glucose"));
class GlucoseController {
    constructor() {
        this.logger = new Logs_1.default();
        this.MODULE = 'GlucoseController';
    }
    chart(req, resp, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'chart';
            try {
                const db = new Glucose_1.default();
                yield db.connect();
                let data = yield db.getLimit(10);
                // loop data array and convert time from unixtime to iso string
                data = data.map(entry => (Object.assign(Object.assign({}, entry), { time: new Date(entry.timestamp * 1000).toISOString() })));
                yield resp.json(data);
            }
            catch (error) {
                yield this.logger.error(`${this.MODULE}.${METHOD}`, error.message, {
                    stack: error.stack,
                    headers: req.headers,
                    body: req.body,
                });
                yield next(error);
            }
        });
    }
    a1c(req, resp, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'a1c';
            try {
                const db = new Glucose_1.default();
                yield db.connect();
                const reduced = [];
                const entries = yield db.getAll();
                entries.forEach(entry => {
                    reduced.push(entry.value);
                });
                const a1cValue = glucose_1.default.calculateA1C(reduced).toFixed(2);
                // set as ISO 8601 string
                const currentTime = new Date().toISOString();
                resp.json({ time: currentTime, value: a1cValue });
            }
            catch (error) {
                yield this.logger.error(`${this.MODULE}.${METHOD}`, error.message, {
                    stack: error.stack,
                    headers: req.headers,
                    body: req.body,
                });
                yield next(error);
            }
        });
    }
    last(req, resp, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'last';
            try {
                const db = new Glucose_1.default();
                yield db.connect();
                let data = yield db.getLatest();
                let entry = null;
                if (data) {
                    entry = {
                        id: data ? data.id : null,
                        time: data ? new Date(data.timestamp * 1000).toISOString() : null,
                        value: data ? data.value : null
                    };
                }
                else {
                    entry = null;
                }
                yield resp.json(entry);
            }
            catch (error) {
                yield this.logger.error(`${this.MODULE}.${METHOD}`, error.message, {
                    stack: error.stack,
                    headers: req.headers,
                    body: req.body,
                });
                yield next(error);
            }
        });
    }
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'get';
            try {
                const glucose = new Glucose_1.default();
                console.log("get all");
                const entries = yield glucose.getAll();
                console.log("return entries");
                yield res.status(200).json(entries);
                return;
            }
            catch (err) {
                yield this.logger.error(`${this.MODULE}.${METHOD}`, err.message, {
                    stack: err.stack,
                    headers: req.headers,
                    body: req.body,
                });
                yield next(err);
                return;
            }
        });
    }
    record(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'record';
            try {
                const glucose = new Glucose_1.default();
                const { bloodGlucose, recordedAt } = req.body;
                if (!bloodGlucose || !recordedAt) {
                    res.status(400).json({ error: 'Missing required fields: bloodGlucose or recordedAt' });
                    return;
                }
                const entry = new GlucoseEntry_1.default(bloodGlucose, recordedAt);
                yield glucose.record(entry);
                yield res.status(201).json({ message: 'Glucose entry recorded successfully.' });
                return;
            }
            catch (err) {
                yield this.logger.error(`${this.MODULE}.${METHOD}`, err.message, {
                    stack: err.stack,
                    headers: req.headers,
                    body: req.body,
                });
                yield next(err);
                return;
            }
        });
    }
}
exports.default = GlucoseController;
