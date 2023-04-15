"use strict";
/**
 * Submit metrics returns "Payload accepted" response
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitBatchRunMetrics = exports.submitBatchRunsMetrics = void 0;
// https://docs.datadoghq.com/ja/api/latest/metrics/#submit-metrics
const datadog_api_client_1 = require("@datadog/datadog-api-client");
const magicpod_1 = require("./magicpod");
const configuration = datadog_api_client_1.client.createConfiguration();
const apiInstance = new datadog_api_client_1.v2.MetricsApi(configuration);
function createSubmitMetricsRequest(metric, timestamp, value, unit, tags) {
    return {
        body: {
            series: [
                {
                    metric: metric,
                    type: 3,
                    points: [
                        {
                            timestamp: timestamp,
                            value: value
                        }
                    ],
                    tags: tags,
                    unit: unit
                }
            ]
        }
    };
}
function submitMetrics(metricName, params) {
    apiInstance
        .submitMetrics(params)
        .then((data) => {
        console.log(`API called successfully. ${metricName} is submitted.`);
    })
        .catch((error) => console.error(error));
}
function submitBatchRunsMetrics(timestamp, value, batch_run_number, test_setting_name, status, organization_name, project_name) {
    const tags = [
        `batch_run_number:${batch_run_number}`,
        `test_setting_name:${test_setting_name}`,
        `status:${status}`,
        `organization_name:${organization_name}`,
        `project_name:${project_name}`
    ];
    const durationSecondParams = createSubmitMetricsRequest('custom.magicpod-datadog-action.batch_run.duration_second', timestamp, value, 'Second', tags);
    const countParams = createSubmitMetricsRequest('custom.magicpod-datadog-action.batch_run.count', timestamp, 1, 'Count', tags);
    if (isTimestampAvailable(timestamp) && !(0, magicpod_1.isStatusRunning)(status)) {
        submitMetrics('custom.magicpod-datadog-action.batch_run.duration_second', durationSecondParams);
        submitMetrics('custom.magicpod-datadog-action.batch_run.count', countParams);
    }
    else {
        console.log(`timestamp ${timestamp} is not available. skip to send metrics`);
    }
}
exports.submitBatchRunsMetrics = submitBatchRunsMetrics;
function submitBatchRunMetrics(timestamp, value, batch_run_number, test_setting_name, status, organization_name, project_name, pattern_name, order, number) {
    const tags = [
        `batch_run_number:${batch_run_number}`,
        `test_setting_name:${test_setting_name}`,
        `status:${status}`,
        `organization_name:${organization_name}`,
        `project_name:${project_name}`,
        `pattern_name:${pattern_name}`,
        `order:${order}`,
        `number:${number}`
    ];
    const durationSecondParams = createSubmitMetricsRequest('custom.magicpod-datadog-action.test_case.duration_second', timestamp, value, 'Second', tags);
    const countParams = createSubmitMetricsRequest('custom.magicpod-datadog-action.test_case.count', timestamp, 1, 'Count', tags);
    if (isTimestampAvailable(timestamp) && !(0, magicpod_1.isStatusRunning)(status)) {
        submitMetrics('custom.magicpod-datadog-action.test_case.duration_second', durationSecondParams);
        submitMetrics('custom.magicpod-datadog-action.test_case.count', countParams);
    }
    else {
        console.log(`timestamp ${timestamp} is not available. skip to send metrics`);
    }
}
exports.submitBatchRunMetrics = submitBatchRunMetrics;
// https://docs.datadoghq.com/ja/api/latest/metrics/?code-lang=typescript#submit-metrics
// points:
// Timestamps should be in POSIX time in seconds,
// and cannot be more than ten minutes in the future or more than one hour in the past.
function isTimestampAvailable(unixTimestampSeconds) {
    const currentTime = Math.floor(Date.now() / 1000);
    const tenMinutes = 10 * 60;
    const oneHour = 60 * 60;
    if (unixTimestampSeconds > currentTime + tenMinutes) {
        return false; // 10 minutes in the future
    }
    else if (unixTimestampSeconds < currentTime - oneHour) {
        return false; // one hour in the past
    }
    else {
        return true;
    }
}
