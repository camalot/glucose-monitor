"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const time_1 = __importDefault(require("../libs/time"));
class GlucoseEntry {
    constructor(value, timestamp, id) {
        this.value = value;
        this.timestamp = timestamp || time_1.default.toUnixTime(new Date());
        this.id = id;
    }
}
exports.default = GlucoseEntry;
