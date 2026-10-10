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
    // Get response from magicpod
    ;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield (0, magicpod_1.getBatchRuns)(inputs);
        if (data) {
            (0, magicpod_1.processBatchRunsData)(data, inputs);
        }
        else {
            console.log('Error occurred, no data received');
        }
    }))();
});
exports.run = run;
