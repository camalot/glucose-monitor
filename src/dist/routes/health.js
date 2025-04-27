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
const express_1 = require("express");
const Settings_1 = __importDefault(require("../libs/mongo/Settings"));
const router = (0, express_1.Router)();
function getHealth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let settingsClient = new Settings_1.default();
            yield settingsClient.connect();
            yield settingsClient.list();
            yield settingsClient.close();
            res.status(200).json({ status: 'ok' });
        }
        catch (err) {
            res.status(500).json({ status: 'error', message: err.message });
        }
    });
}
router.get('/health', getHealth);
router.get('/healthz', getHealth);
router.get('/livez', getHealth);
router.get('/readyz', getHealth);
exports.default = router;
// const config = require('../config');
// const { Router } = require('express');
// const SettingsMongoClient = require('../libs/mongo/Settings')
// const router = Router();
// // create db call to check if can talk to db before giving OK
// async function getHealth(req, res) {
//   try {
//     let settingsClient = new SettingsMongoClient();
//     await settingsClient.connect();
//     await settingsClient.list();
//     await settingsClient.close();
//     res.status(200).json({ status: 'ok' });
//   } catch (err) {
//     res.status(500).json({ status: 'error', message: err.message });
//   }
// }
// router.get('/health', getHealth);
// router.get('/healthz', getHealth);
// router.get('/livez', getHealth);
// router.get('/readyz', getHealth);
// module.exports = router;
