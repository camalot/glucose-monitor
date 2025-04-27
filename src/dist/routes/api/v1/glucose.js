"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GlucoseController_1 = __importDefault(require("../../../api/v1/controllers/GlucoseController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
const glucoseController = new GlucoseController_1.default();
router.route('/api/v1/glucose')
    .get(glucoseController.get);
router.route('/api/v1/glucose/chart')
    .get(glucoseController.chart);
router.route('/api/v1/glucose/last')
    .get(glucoseController.last);
router.route('/api/v1/glucose/a1c')
    .get(glucoseController.a1c);
exports.default = router;
