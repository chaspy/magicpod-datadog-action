"use strict";
/**
 * Submit metrics returns "Payload accepted" response
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitBatchRunsMetrics = submitBatchRunsMetrics;
exports.submitBatchRunMetrics = submitBatchRunMetrics;
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
                    type: 3, // gauge
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
function submitBatchRunsMetrics(metrics) {
    const tags = [
        `batch_run_number:${metrics.batch_run_number}`,
        `test_setting_name:${metrics.test_setting_name}`,
        `status:${metrics.status}`,
        `organization_name:${metrics.organization_name}`,
        `project_name:${metrics.project_name}`
    ];
    const durationSecondParams = createSubmitMetricsRequest('custom.magicpod-datadog-action.batch_run.duration_second', metrics.timestamp, metrics.value, 'Second', tags);
    const countParams = createSubmitMetricsRequest('custom.magicpod-datadog-action.batch_run.count', metrics.timestamp, 1, 'Count', tags);
    if (isTimestampAvailable(metrics.timestamp) &&
        !(0, magicpod_1.isStatusRunning)(metrics.status)) {
        submitMetrics('custom.magicpod-datadog-action.batch_run.duration_second', durationSecondParams);
        submitMetrics('custom.magicpod-datadog-action.batch_run.count', countParams);
    }
    else {
        console.log(`timestamp ${metrics.timestamp} is not available. skip to send metrics`);
    }
}
function submitBatchRunMetrics(metrics) {
    const tags = [
        `batch_run_number:${metrics.batch_run_number}`,
        `test_setting_name:${metrics.test_setting_name}`,
        `status:${metrics.status}`,
        `organization_name:${metrics.organization_name}`,
        `project_name:${metrics.project_name}`,
        `pattern_name:${metrics.pattern_name}`,
        `order:${metrics.order}`,
        `number:${metrics.number}`,
        `test_case_name:${metrics.test_case_name}`
    ];
    const durationSecondParams = createSubmitMetricsRequest('custom.magicpod-datadog-action.test_case.duration_second', metrics.timestamp, metrics.value, 'Second', tags);
    const countParams = createSubmitMetricsRequest('custom.magicpod-datadog-action.test_case.count', metrics.timestamp, 1, 'Count', tags);
    if (isTimestampAvailable(metrics.timestamp) &&
        !(0, magicpod_1.isStatusRunning)(metrics.status)) {
        submitMetrics('custom.magicpod-datadog-action.test_case.duration_second', durationSecondParams);
        submitMetrics('custom.magicpod-datadog-action.test_case.count', countParams);
    }
    else {
        console.log(`timestamp ${metrics.timestamp} is not available. skip to send metrics`);
    }
}
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
