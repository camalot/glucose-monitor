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
const config_1 = __importDefault(require("../../../config"));
const fs = __importStar(require("fs"));
const Logs_1 = __importDefault(require("../../../libs/mongo/Logs"));
const logger = new Logs_1.default();
const MODULE = 'ScriptsController';
function config(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const METHOD = 'config';
        try {
            // Copy to another object and remove sensitive data
            const settings = JSON.parse(JSON.stringify(config_1.default));
            delete settings.mongo;
            delete settings.ui.allow;
            res.setHeader('Content-Type', 'application/javascript');
            res
                .status(200)
                .send(`window.GM_CONFIG = ${JSON.stringify(settings)};`)
                .end();
        }
        catch (err) {
            yield logger.error(`${MODULE}.${METHOD}`, err.message, {
                stack: err.stack,
                headers: req.headers,
                body: req.body,
                query: req.query,
                params: req.params,
            });
            res.status(500).end();
        }
    });
}
function scripts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const METHOD = 'scripts';
        try {
            // Combine scripts into one file and send
            const scripts = [
                'form-validator.js',
                'weight-chart.js',
                'templates.js',
                'on-ready.js',
            ];
            res.setHeader('Content-Type', 'application/javascript');
            // Read all scripts and combine them
            let script = '';
            scripts.forEach((s) => {
                script += fs.readFileSync(`assets/javascript/${s}`, 'utf-8');
            });
            res.status(200).send(script).end();
        }
        catch (err) {
            yield logger.error(`${MODULE}.${METHOD}`, err.message, {
                stack: err.stack,
                headers: req.headers,
                body: req.body,
                query: req.query,
                params: req.params,
            });
            res.status(500).end();
        }
    });
}
exports.default = {
    config,
    scripts,
};
// const configs = require('../../../config');
// const fs = require('fs');
// const LogsMongoClient = require('../../../libs/mongo/Logs');
// const logger = new LogsMongoClient();
// const MODULE = 'ScriptsController';
// async function config(req, res) {
//   const METHOD = 'config';
//   try {
//     // copy to another object and remove sensitive data
//     let settings = JSON.parse(JSON.stringify(configs));
//     delete settings.mongo;
//     delete settings.ui.allow;
//     res.setHeader('Content-Type', 'application/javascript');
//     return res.status(200).send(`window.GM_CONFIG = ${JSON.stringify(settings)};`).end();
//   } catch (err) {
//     await logger.error(
//       `${MODULE}.${METHOD}`,
//       err.message,
//       { stack: err.stack, headers: req.headers, body: req.body, query: req.query, params: req.params },
//     );
//     return res.status(500).end();
//   }
// }
// async function scripts(req, res) {
//   const METHOD = 'scripts';
//   try {
//     // // combine scripts to one file and send
//     let scripts = [
//       'form-validator.js',
//     ];
//     res.setHeader('Content-Type', 'application/javascript');
//     // read all scripts and combine them
//     let script = '';
//     scripts.forEach((s) => {
//       script += fs.readFileSync(`assets/javascript/${s}`);
//     });
//     return res.status(200).send(script).end();
//   } catch (err) {
//     await logger.error(
//       `${MODULE}.${METHOD}`,
//       err.message,
//       { stack: err.stack, headers: req.headers, body: req.body, query: req.query, params: req.params },
//     );
//     return res.status(500).end();
//   }
// }
// module.exports = {
//   config, scripts,
// };
