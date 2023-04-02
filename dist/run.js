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
exports.run = void 0;
const axios_1 = __importDefault(require("axios"));
// eslint-disable-next-line @typescript-eslint/require-await
const run = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    // load insputs
    const dd_api_key = inputs.dd_api_key;
    const magicpod_api_key = inputs.magicpod_api_key;
    const magicpod_organization_name = inputs.magicpod_organization_name;
    const magicpod_project_name = inputs.magicpod_project_name;
    const count = 100;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield getBatchRuns(magicpod_api_key, magicpod_organization_name, magicpod_project_name, count);
        if (data) {
            console.log(data);
        }
        else {
            console.log('Error occurred, no data received');
        }
    }))();
    // parse response
    // calcurate duration
    // build metrics for datadog
    // send metric to datadog
});
exports.run = run;
function getBatchRuns(magicpod_api_key, magicpod_organization_name, magicpod_project_name, count) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://app.magicpod.com/api/v1.0/${magicpod_organization_name}/${magicpod_project_name}/batch-runs/?count=${count}`;
        const headers = {
            accept: 'application/json',
            Authorization: `Token ${magicpod_api_key}`
        };
        try {
            const response = yield axios_1.default.get(url, { headers });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(`Error: ${error}`);
            return null;
        }
    });
}
