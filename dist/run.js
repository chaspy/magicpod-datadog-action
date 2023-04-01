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
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const magicpod_1 = require("./magicpod");
// eslint-disable-next-line @typescript-eslint/require-await
const run = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    // Load insputs
    const magicpod_api_token = inputs.magicpod_api_token;
    const magicpod_organization_name = inputs.magicpod_organization_name;
    const magicpod_project_name = inputs.magicpod_project_name;
    const count = 10;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield (0, magicpod_1.getBatchRuns)(magicpod_api_token, magicpod_organization_name, magicpod_project_name, count);
        if (data) {
            (0, magicpod_1.processBatchRunsData)(data);
        }
        else {
            console.log('Error occurred, no data received');
        }
    }))();
});
exports.run = run;
