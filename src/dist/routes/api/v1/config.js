"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ScriptsController_1 = __importDefault(require("../../../api/v1/controllers/ScriptsController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.route('/javascript/config.js')
    .get(ScriptsController_1.default.config);
router.route('/javascript/scripts.js')
    .get(ScriptsController_1.default.scripts);
exports.default = router;
