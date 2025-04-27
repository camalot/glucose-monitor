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
const env_1 = __importDefault(require("../config/env"));
const Logs_1 = __importDefault(require("../libs/mongo/Logs"));
const logger = new Logs_1.default();
const MODULE = 'UiMiddleware';
function allow(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const METHOD = 'allow';
        if (!env_1.default.ui.enabled) {
            yield logger.warn(`${MODULE}.${METHOD}`, 'UI is disabled.');
            res.status(404).end();
            return;
        }
        const allowList = env_1.default.ui.allow || ['*'];
        if (allowList.includes('*')) {
            yield logger.debug(`${MODULE}.${METHOD}`, 'Allowing all requests.');
            next();
            return;
        }
        const requestHostName = req.hostname;
        if (allowList.includes(requestHostName)) {
            next();
            return;
        }
        // Loop through the allow list and create a regex to match the host name
        const regex = new RegExp(allowList.join('|').replace(/\./g, '\\.').replace(/\*/g, '.*'));
        if (regex.test(requestHostName)) {
            next();
            return;
        }
        yield logger.warn(`${MODULE}.${METHOD}`, `Blocked request to ${requestHostName}`);
        res.status(404).end();
        return;
    });
}
exports.default = {
    allow,
};
// const config = require('../config/env');
// const LogsMongoClient = require('../libs/mongo/Logs');
// const logger = new LogsMongoClient();
// const MODULE = 'UiMiddleware';
// async function allow(req, res, next) {
//   const METHOD = 'allow';
//   if (!config.ui.enabled) {
//     await logger.warn(`${MODULE}.${METHOD}`, 'UI is disabled.');
//     return res.status(404).end();
//   }
//   const allowList = config.ui.allow || ['*'];
//   if (allowList.includes('*')) {
//     await logger.debug(`${MODULE}.${METHOD}`, 'Allowing all requests.');
//     return next();
//   }
//   const reqestHostName = req.hostname;
//   if (allowList.includes(reqestHostName)) {
//     return next();
//   }
//   // loop allow list and create a regex to match the host name
//   const regex = new RegExp(allowList.join('|').replace(/\./g, '\\.').replace(/\*/g, '.*'));
//   if (regex.test(reqestHostName)) {
//     return next();
//   }
//   await logger.warn(`${MODULE}.${METHOD}`, `Blocked request to ${reqestHostName}`);
//   return res.status(404).end();
// }
// module.exports = {
//   allow,
// };
