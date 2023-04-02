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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
// eslint-disable-next-line @typescript-eslint/require-await
const run = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    core.info('hello');
    // load insputs
    const dd_api_key = inputs.dd_api_key;
    const magicpod_api_key = inputs.magicpod_api_key;
    const magicpod_organization_name = inputs.magicpod_organization_name;
    const magicpod_project_name = inputs.magicpod_project_name;
    const count = 100;
    // Get response from magicpod
    sendHttpRequest(magicpod_api_key, magicpod_organization_name, magicpod_project_name, count);
    // parse response
    // calcurate duration
    // build metrics for datadog
    // send metric to datadog
});
exports.run = run;
function sendHttpRequest(magicpod_api_key, magicpod_organization_name, magicpod_project_name, count) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://app.magicpod.com/api/v1.0/${magicpod_organization_name}/${magicpod_project_name}/batch-runs/?count=${count}`;
        const headers = {
            accept: 'application/json',
            Authorization: `Token ${magicpod_api_key}`
        };
        try {
            const response = yield axios_1.default.get(url, { headers });
            console.log(response.data);
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
