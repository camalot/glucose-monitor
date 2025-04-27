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
const Weight_1 = __importDefault(require("../../../libs/mongo/Weight"));
class WeightController {
    constructor() {
        this.logger = new Logs_1.default();
        this.db = new Weight_1.default();
        this.MODULE = 'WeightController';
    }
    getChartData(req, resp, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'getChartData';
            try {
                yield this.db.connect();
                const data = yield this.db.getLimit(10);
                const mapped = data.map(entry => (Object.assign(Object.assign({}, entry), { time: new Date(entry.timestamp * 1000).toISOString() })));
                resp.json(mapped);
            }
            catch (error) {
                this.logger.error(`${this.MODULE}.${METHOD}`, error.message, error);
                next(error);
            }
        });
    }
}
exports.default = WeightController;
