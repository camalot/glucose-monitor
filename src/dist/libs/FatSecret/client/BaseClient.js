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
const axios_1 = __importDefault(require("axios"));
const APIError_1 = require("./APIError");
class BaseClient {
    constructor(options) {
        this.OAUTH_URL = "https://oauth.fatsecret.com/connect/token";
        this.API_URL = "https://platform.fatsecret.com/rest/server.api";
        // set options 
        this.options = options;
        // create an axios client instance
        this.axios = axios_1.default.create({});
        // setup interceptor to handle refreshing token on error
        this.axios.interceptors.response.use((response) => __awaiter(this, void 0, void 0, function* () {
            // get error from response
            const originalRequest = response.config;
            const responseError = response.data.error;
            // if error attempt to handle error
            if (responseError) {
                if ([APIError_1.APIErrorCode.INVALID_TOKEN, APIError_1.APIErrorCode.MISSING_OAUTH_PARAMETERS].includes(responseError.code) && // is a token error
                    !originalRequest._retry // request hasn't already been retried
                ) {
                    // add _retry to request to prevent retrying infinitely
                    originalRequest._retry = true;
                    // attempt to re-authenticate
                    yield this.refreshToken();
                    // retry request
                    return this.axios.request(originalRequest);
                }
                // else, throw error
                console.log("Error");
                throw new APIError_1.APIError(responseError.code, responseError.message);
            }
            ;
            // else, return response
            return response;
        }));
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            // extract credentials
            const { credentials } = this.options;
            // create request form data body
            const formData = new URLSearchParams({
                "grant_type": "client_credentials",
                "scope": credentials.scope.join(" ")
            });
            // send request
            const response = yield this.axios.post(this.OAUTH_URL, formData, {
                auth: {
                    username: credentials.clientId,
                    password: credentials.clientSecret
                },
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            });
            // create access token
            const accessToken = "Bearer " + response.data["access_token"];
            // set authorization header to access token
            this.axios.defaults.headers.common.Authorization = accessToken;
            return;
        });
    }
    doRequest(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.axios.post(this.API_URL, {}, {
                params: Object.assign({ method: method, format: "json" }, params)
            });
        });
    }
}
exports.default = BaseClient;
