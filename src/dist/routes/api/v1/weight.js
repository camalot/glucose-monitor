"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WeightController_1 = __importDefault(require("../../../api/v1/controllers/WeightController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
const weightController = new WeightController_1.default();
// requires premier scope.
router.route('/api/v1/weight/chart')
    .get((req, resp, next) => {
    weightController.getChartData(req, resp, next);
});
exports.default = router;
