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
Object.defineProperty(exports, "__esModule", { value: true });
const math = __importStar(require("mathjs"));
class Serving {
    constructor(options) {
        // assign options to own properties
        Object.assign(this, options);
        // if metric units provided, set serving size
        if (options.metricServingAmount && options.metricServingUnit) {
            this.metricServingAmount = math.unit(options.metricServingAmount, options.metricServingUnit);
        }
        // create function to convert provided nutrition number to units
        const toUnit = (unit, n) => n ? math.unit(n, unit) : null;
        // TODO: Make this look cleaner :3
        // convert nutritional information as math.js units
        this.calories = toUnit("kcal", options.calories);
        this.carbohydrate = toUnit("g", options.carbohydrate);
        this.protein = toUnit("g", options.protein);
        this.fat = toUnit("g", options.fat);
        this.saturatedFat = toUnit("g", options.saturatedFat);
        this.polyunsaturatedFat = toUnit("g", options.polyunsaturatedFat);
        this.monounsaturatedFat = toUnit("g", options.monounsaturatedFat);
        this.transFat = toUnit("g", options.transFat);
        this.cholesterol = toUnit("mg", options.cholesterol);
        this.sodium = toUnit("mg", options.sodium);
        this.potassium = toUnit("mg", options.potassium);
        this.fiber = toUnit("g", options.fiber);
        this.sugar = toUnit("g", options.sugar);
        this.addedSugars = toUnit("g", options.addedSugars);
        this.vitaminD = toUnit("ug", options.vitaminD);
        this.vitaminA = toUnit("ug", options.vitaminA);
        this.vitaminC = toUnit("mg", options.vitaminC);
        this.calcium = toUnit("mg", options.calcium);
        this.iron = toUnit("mg", options.iron);
    }
    /**
    * @param {number} roundN - The number of decimals to round values to.
    **/
    computeServing(amount, roundN) {
        // ensure serving has amount in metric units
        if (!this.metricServingAmount)
            return;
        // compute factor to multiply values by
        const multiplyFactor = amount.divide(this.metricServingAmount);
        // create function for multiplying units to fit factor
        const factorUnit = (unit) => {
            // if no unit, return undefined
            if (!unit)
                return;
            // compute unit multiplied by factor
            const computedUnit = math.multiply(multiplyFactor, unit);
            // if should round return rounded unit
            if (roundN)
                return math.round(computedUnit.toNumber(), roundN);
            // else, return computed unit as number
            return computedUnit.toNumber();
        };
        return new Serving({
            metricServingAmount: amount.toNumber(),
            metricServingUnit: amount.formatUnits(),
            numberOfUnits: 1,
            calories: factorUnit(this.calories),
            carbohydrate: factorUnit(this.carbohydrate),
            protein: factorUnit(this.protein),
            fat: factorUnit(this.fat),
            saturatedFat: factorUnit(this.saturatedFat),
            polyunsaturatedFat: factorUnit(this.polyunsaturatedFat),
            monounsaturatedFat: factorUnit(this.monounsaturatedFat),
            transFat: factorUnit(this.transFat),
            cholesterol: factorUnit(this.cholesterol),
            sodium: factorUnit(this.sodium),
            potassium: factorUnit(this.potassium),
            fiber: factorUnit(this.fiber),
            sugar: factorUnit(this.sugar),
            addedSugars: factorUnit(this.addedSugars),
            vitaminD: factorUnit(this.vitaminD),
            vitaminA: factorUnit(this.vitaminA),
            vitaminC: factorUnit(this.vitaminC),
            calcium: factorUnit(this.calcium),
            iron: factorUnit(this.iron),
        });
    }
    // serialize
    toJSON() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        console.log(this);
        return {
            id: this.id,
            description: this.description,
            url: this.url,
            measurementDescription: this.measurementDescription,
            metricServingAmount: this.metricServingAmount ? (_a = this.metricServingAmount) === null || _a === void 0 ? void 0 : _a.toNumber() : null,
            metricServingUnit: this.metricServingAmount ? (_b = this.metricServingAmount) === null || _b === void 0 ? void 0 : _b.formatUnits() : null,
            numberOfUnits: this.numberOfUnits,
            calories: (_c = this.calories) === null || _c === void 0 ? void 0 : _c.toNumber(),
            carbohydrate: (_d = this.carbohydrate) === null || _d === void 0 ? void 0 : _d.toNumber(),
            protein: (_e = this.protein) === null || _e === void 0 ? void 0 : _e.toNumber(),
            fat: (_f = this.fat) === null || _f === void 0 ? void 0 : _f.toNumber(),
            saturatedFat: (_g = this.saturatedFat) === null || _g === void 0 ? void 0 : _g.toNumber(),
            polyunsaturatedFat: (_h = this.polyunsaturatedFat) === null || _h === void 0 ? void 0 : _h.toNumber(),
            monounsaturatedFat: (_j = this.monounsaturatedFat) === null || _j === void 0 ? void 0 : _j.toNumber(),
            transFat: (_k = this.transFat) === null || _k === void 0 ? void 0 : _k.toNumber(),
            cholesterol: (_l = this.cholesterol) === null || _l === void 0 ? void 0 : _l.toNumber(),
            sodium: (_m = this.sodium) === null || _m === void 0 ? void 0 : _m.toNumber(),
            potassium: (_o = this.potassium) === null || _o === void 0 ? void 0 : _o.toNumber(),
            fiber: (_p = this.fiber) === null || _p === void 0 ? void 0 : _p.toNumber(),
            sugar: (_q = this.sugar) === null || _q === void 0 ? void 0 : _q.toNumber(),
            addedSugars: (_r = this.addedSugars) === null || _r === void 0 ? void 0 : _r.toNumber(),
            vitaminD: (_s = this.vitaminD) === null || _s === void 0 ? void 0 : _s.toNumber(),
            vitaminA: (_t = this.vitaminA) === null || _t === void 0 ? void 0 : _t.toNumber(),
            vitaminC: (_u = this.vitaminC) === null || _u === void 0 ? void 0 : _u.toNumber(),
            calcium: (_v = this.calcium) === null || _v === void 0 ? void 0 : _v.toNumber(),
            iron: (_w = this.iron) === null || _w === void 0 ? void 0 : _w.toNumber(),
        };
    }
    // deserialize
    static fromJSON(object) {
        // ensure object isn't null or undefined
        object = object || {};
        // extract properties & convert strings to floats
        const id = object["id"];
        const description = object["description"];
        const url = object["url"];
        const measurementDescription = object["description"];
        const metricServingAmount = object["metricServingAmount"];
        const metricServingUnit = object["metricServingUnit"];
        const numberOfUnits = object["numberOfUnits"];
        const calories = object["calories"];
        const carbohydrate = object["carbohydrate"];
        const protein = object["protein"];
        const fat = object["fat"];
        const saturatedFat = object["saturatedFat"];
        const polyunsaturatedFat = object["polyunsaturatedFat"];
        const monounsaturatedFat = object["monounsaturatedFat"];
        const transFat = object["transFat"];
        const cholesterol = object["cholesterol"];
        const sodium = object["sodium"];
        const potassium = object["potassium"];
        const fiber = object["fiber"];
        const sugar = object["sugar"];
        const addedSugars = object["addedSugars"];
        const vitaminD = object["vitaminD"];
        const vitaminA = object["vitaminA"];
        const vitaminC = object["vitaminC"];
        const calcium = object["calcium"];
        const iron = object["iron"];
        // return instance of Food
        return new Serving({
            id,
            description,
            url,
            measurementDescription: measurementDescription,
            metricServingAmount: metricServingAmount,
            metricServingUnit: metricServingUnit,
            numberOfUnits: numberOfUnits,
            calories: calories,
            carbohydrate: carbohydrate,
            protein: protein,
            fat: fat,
            saturatedFat: saturatedFat,
            polyunsaturatedFat: polyunsaturatedFat,
            monounsaturatedFat: monounsaturatedFat,
            transFat: transFat,
            cholesterol: cholesterol,
            sodium: sodium,
            potassium: potassium,
            fiber: fiber,
            sugar: sugar,
            addedSugars: addedSugars,
            vitaminD: vitaminD,
            vitaminA: vitaminA,
            vitaminC: vitaminC,
            calcium: calcium,
            iron: iron,
        });
    }
    static fromResponse(object) {
        // ensure object isn't null or undefined
        object = object || {};
        // extract properties & convert strings to floats
        const id = object["serving_id"];
        const description = object["serving_description"];
        const url = object["serving_url"];
        const measurementDescription = object["measurement_description"];
        const metricServingAmount = parseFloat(object["metric_serving_amount"]);
        const metricServingUnit = object["metric_serving_unit"];
        const numberOfUnits = parseFloat(object["number_of_units"]);
        const calories = parseFloat(object["calories"]);
        const carbohydrate = parseFloat(object["carbohydrate"]);
        const protein = parseFloat(object["protein"]);
        const fat = parseFloat(object["fat"]);
        const saturatedFat = parseFloat(object["saturated_fat"]);
        const polyunsaturatedFat = parseFloat(object["polyunsaturated_fat"]);
        const monounsaturatedFat = parseFloat(object["monounsaturated_fat"]);
        const transFat = parseFloat(object["trans_fat"]);
        const cholesterol = parseFloat(object["cholesterol"]);
        const sodium = parseFloat(object["sodium"]);
        const potassium = parseFloat(object["potassium"]);
        const fiber = parseFloat(object["fiber"]);
        const sugar = parseFloat(object["sugar"]);
        const addedSugars = parseFloat(object["added_sugars"]);
        const vitaminD = parseFloat(object["vitamin_d"]);
        const vitaminA = parseFloat(object["vitamin_a"]);
        const vitaminC = parseFloat(object["vitamin_c"]);
        const calcium = parseFloat(object["calcium"]);
        const iron = parseFloat(object["iron"]);
        // return instance of Food
        return new Serving({
            id,
            description,
            url,
            measurementDescription,
            metricServingAmount: metricServingAmount,
            metricServingUnit,
            numberOfUnits: numberOfUnits,
            calories: calories,
            carbohydrate: carbohydrate,
            protein: protein,
            fat: fat,
            saturatedFat: saturatedFat,
            polyunsaturatedFat: polyunsaturatedFat,
            monounsaturatedFat: monounsaturatedFat,
            transFat: transFat,
            cholesterol: cholesterol,
            sodium: sodium,
            potassium: potassium,
            fiber: fiber,
            sugar: sugar,
            addedSugars: addedSugars,
            vitaminD: vitaminD,
            vitaminA: vitaminA,
            vitaminC: vitaminC,
            calcium: calcium,
            iron: iron,
        });
    }
    debugLog() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        console.table({
            id: this.id,
            description: this.description,
            url: this.url,
            measurementDescription: this.measurementDescription,
            metricServingAmount: (_a = this.metricServingAmount) === null || _a === void 0 ? void 0 : _a.format({}),
            numberOfUnits: this.numberOfUnits,
            calories: (_b = this.calories) === null || _b === void 0 ? void 0 : _b.format({}),
            carbohydrate: (_c = this.carbohydrate) === null || _c === void 0 ? void 0 : _c.format({}),
            protein: (_d = this.protein) === null || _d === void 0 ? void 0 : _d.format({}),
            fat: (_e = this.fat) === null || _e === void 0 ? void 0 : _e.format({}),
            saturatedFat: (_f = this.saturatedFat) === null || _f === void 0 ? void 0 : _f.format({}),
            polyunsaturatedFat: (_g = this.polyunsaturatedFat) === null || _g === void 0 ? void 0 : _g.format({}),
            monounsaturatedFat: (_h = this.monounsaturatedFat) === null || _h === void 0 ? void 0 : _h.format({}),
            transFat: (_j = this.transFat) === null || _j === void 0 ? void 0 : _j.format({}),
            cholesterol: (_k = this.cholesterol) === null || _k === void 0 ? void 0 : _k.format({}),
            sodium: (_l = this.sodium) === null || _l === void 0 ? void 0 : _l.format({}),
            potassium: (_m = this.potassium) === null || _m === void 0 ? void 0 : _m.format({}),
            fiber: (_o = this.fiber) === null || _o === void 0 ? void 0 : _o.format({}),
            sugar: (_p = this.sugar) === null || _p === void 0 ? void 0 : _p.format({}),
            addedSugars: (_q = this.addedSugars) === null || _q === void 0 ? void 0 : _q.format({}),
            vitaminD: (_r = this.vitaminD) === null || _r === void 0 ? void 0 : _r.format({}),
            vitaminA: (_s = this.vitaminA) === null || _s === void 0 ? void 0 : _s.format({}),
            vitaminC: (_t = this.vitaminC) === null || _t === void 0 ? void 0 : _t.format({}),
            calcium: (_u = this.calcium) === null || _u === void 0 ? void 0 : _u.format({}),
            iron: (_v = this.iron) === null || _v === void 0 ? void 0 : _v.format({}),
        });
    }
}
exports.default = Serving;
