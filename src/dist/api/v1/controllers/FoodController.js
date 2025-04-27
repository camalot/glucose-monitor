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
const FatSecret = __importStar(require("../../../libs/FatSecret"));
const Logs_1 = __importDefault(require("../../../libs/mongo/Logs"));
class FoodController {
    constructor() {
        this.logger = new Logs_1.default();
        this.MODULE = 'FoodController';
    }
    list(req, resp, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'list';
            const count = req.params.count || 3;
            try {
                let data = [
                    {
                        time: new Date().toISOString(),
                        food: {
                            name: 'Sample Food Name',
                            calories: 100,
                            carbohydrates: 20
                        }
                    },
                    {
                        time: new Date().toISOString(),
                        food: {
                            name: 'Another Food Name',
                            calories: 200,
                            carbohydrates: 30
                        }
                    },
                    {
                        time: new Date().toISOString(),
                        food: {
                            name: 'Third Food Name',
                            calories: 230,
                            carbohydrates: 5
                        }
                    }
                ];
                yield resp.json(data);
            }
            catch (error) {
                yield this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
                yield next(error);
            }
        });
    }
    createClient() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Create before promise");
            // return a Promise
            return new Promise((resolve, reject) => {
                try {
                    console.log("Creating client...");
                    const client = new FatSecret.Client({
                        credentials: {
                            clientId: config_1.default.fatsecret.clientId,
                            clientSecret: config_1.default.fatsecret.clientSecret,
                            scope: config_1.default.fatsecret.scopes, // your scopes
                        },
                    });
                    console.log("Client created");
                    return resolve(client);
                }
                catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }
    getById(req, resp, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'getById';
            const foodId = parseInt(req.params.id);
            const client = yield this.createClient();
            try {
                const response = yield client.getFood({ foodId: String(foodId) });
                yield resp.json(response);
            }
            catch (error) {
                yield this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
                yield next(error);
                return;
            }
        });
    }
    autocomplete(req, resp, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'autocomplete';
            const query = req.query.q;
            console.log("Received autocomplete request with query:", query);
            const client = yield this.createClient();
            try {
                const response = yield client.getAutocompleteV2({ expression: String(query) });
                // map array to array of objects with `{ name: 'name', source: 'fatsecret' }`
                const mappedResponse = response.map(item => ({
                    value: item,
                    source: 'fatsecret',
                    img: '/images/fatsecret-16x16.png'
                }));
                // get local items
                yield resp.json(mappedResponse);
            }
            catch (error) {
                console.log(error);
                yield this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
                yield next(error);
                return;
            }
        });
    }
    search(req, resp, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const METHOD = 'search';
            const client = yield this.createClient();
            try {
                const query = req.query.q;
                const max_results = req.query.max_results || 20;
                console.log(`query: ${query}`);
                const response = yield client.getFoodSearchV3({
                    searchExpression: String(query),
                    maxResults: Number(max_results),
                    pageNumber: req.query.page_number ? Number(req.query.page_number) : undefined,
                    language: req.query.language ? String(req.query.language) : undefined
                });
                yield resp.json(response);
            }
            catch (error) {
                // await this.logger.error(`${this.MODULE}.${METHOD}`, error.message, { stack: error.stack });
                yield next(error);
                return;
            }
        });
    }
}
exports.default = FoodController;
