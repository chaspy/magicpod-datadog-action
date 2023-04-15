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
exports.getBatchRun = exports.isStatusRunning = exports.processBatchRunData = exports.processBatchRunsData = exports.getBatchRuns = void 0;
const axios_1 = __importDefault(require("axios"));
const datadog_1 = require("./datadog");
function getBatchRuns(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        // Load insputs
        const magicpod_api_token = inputs.magicpod_api_token;
        const magicpod_organization_name = inputs.magicpod_organization_name;
        const magicpod_project_name = inputs.magicpod_project_name;
        const magicpod_record_count = inputs.magicpod_record_count;
        const url = `https://app.magicpod.com/api/v1.0/${magicpod_organization_name}/${magicpod_project_name}/batch-runs/?count=${magicpod_record_count}`;
        const headers = {
            accept: 'application/json',
            Authorization: `Token ${magicpod_api_token}`
        };
        try {
            const response = yield axios_1.default.get(url, { headers });
            return response.data;
        }
        catch (error) {
            console.error(`Error: ${error}`);
            return null;
        }
    });
}
exports.getBatchRuns = getBatchRuns;
function processBatchRunsData(batchRunsData, inputs) {
    const organization_name = batchRunsData.organization_name;
    const project_name = batchRunsData.project_name;
    batchRunsData.batch_runs.forEach((batchRun, index) => {
        const durationSeconds = calculateTimeDifferenceSecond(batchRun.started_at, batchRun.finished_at);
        const batch_run_number = batchRun.batch_run_number;
        (() => __awaiter(this, void 0, void 0, function* () {
            const data = yield getBatchRun(inputs, batch_run_number);
            if (data) {
                processBatchRunData(data);
            }
            else {
                console.log('Error occurred, no data received');
            }
        }))();
        const test_setting_name = batchRun.test_setting_name;
        const status = batchRun.status;
        const finished_at = batchRun.finished_at;
        const timestampSeconds = getUnixTimestampSeconds(finished_at);
        (0, datadog_1.submitBatchRunsMetircs)(timestampSeconds, durationSeconds, batch_run_number, test_setting_name, status, organization_name, project_name);
    });
}
exports.processBatchRunsData = processBatchRunsData;
function processBatchRunData(batchRunData) {
    const organization_name = batchRunData.organization_name;
    const project_name = batchRunData.project_name;
    const batch_run_number = batchRunData.batch_run_number;
    const test_setting_name = batchRunData.test_setting_name;
    batchRunData.test_cases.details.forEach((details, index) => {
        const pattern_name = details.pattern_name;
        details.results.forEach((results, index) => {
            const durationSeconds = calculateTimeDifferenceSecond(results.started_at, results.finished_at);
            const finished_at = results.finished_at;
            const timestampSeconds = getUnixTimestampSeconds(finished_at);
            // const pattern_name = batchRunData.test_cases.details
            const status = results.status;
            const order = results.order;
            const number = results.number;
            (0, datadog_1.submitBatchRunMetircs)(timestampSeconds, durationSeconds, batch_run_number, test_setting_name, status, organization_name, project_name, pattern_name, order, number);
        });
    });
}
exports.processBatchRunData = processBatchRunData;
function getUnixTimestampSeconds(dateString) {
    const dateObject = new Date(dateString);
    const unixTimestamp = dateObject.getTime();
    return unixTimestamp / 1000; // seconds
}
function calculateTimeDifferenceSecond(time1, time2) {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    const difference = Math.abs(date2.getTime() - date1.getTime()); // milli seconds
    return difference / 1000; // seconds
}
// getButchRuns API returns all BatchRuns includes Running Status.
// However, 'Running' ones are useless because we want to store success rates and success results in Datadog.
function isStatusRunning(status) {
    return status == 'running' ? true : false;
}
exports.isStatusRunning = isStatusRunning;
function getBatchRun(inputs, batch_run_number) {
    return __awaiter(this, void 0, void 0, function* () {
        // Load insputs
        const magicpod_api_token = inputs.magicpod_api_token;
        const magicpod_organization_name = inputs.magicpod_organization_name;
        const magicpod_project_name = inputs.magicpod_project_name;
        const url = `https://app.magicpod.com/api/v1.0/${magicpod_organization_name}/${magicpod_project_name}/batch-run/${batch_run_number}/`;
        const headers = {
            accept: 'application/json',
            Authorization: `Token ${magicpod_api_token}`
        };
        try {
            const response = yield axios_1.default.get(url, { headers });
            return response.data;
        }
        catch (error) {
            console.error(`Error: ${error}`);
            return null;
        }
    });
}
exports.getBatchRun = getBatchRun;
