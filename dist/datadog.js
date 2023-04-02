"use strict";
/**
 * Submit metrics returns "Payload accepted" response
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitMetircs = void 0;
// https://docs.datadoghq.com/ja/api/latest/metrics/#submit-metrics
const datadog_api_client_1 = require("@datadog/datadog-api-client");
const configuration = datadog_api_client_1.client.createConfiguration();
const apiInstance = new datadog_api_client_1.v2.MetricsApi(configuration);
function submitMetircs(timestamp, value, batch_run_number, test_setting_name, status) {
    const params = {
        body: {
            series: [
                {
                    metric: 'custom.magicpod-datadog-action.batch_run.duration_second',
                    type: 3,
                    points: [
                        {
                            timestamp: timestamp,
                            value: value
                        }
                    ],
                    tags: [
                        `batch_run_number:${batch_run_number}`,
                        `test_setting_name:${test_setting_name}`,
                        `status:${status}`
                    ],
                    unit: 'Second'
                }
            ]
        }
    };
    if (isTimestampAvailable(timestamp)) {
        apiInstance
            .submitMetrics(params)
            .then((data) => {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        })
            .catch((error) => console.error(error));
    }
    else {
        console.log(`timestamp ${timestamp} is not available. skip to send metrics`);
    }
}
exports.submitMetircs = submitMetircs;
// https://docs.datadoghq.com/ja/api/latest/metrics/?code-lang=typescript#submit-metrics
// points:
// Timestamps should be in POSIX time in seconds,
// and cannot be more than ten minutes in the future or more than one hour in the past.
function isTimestampAvailable(unixTimestamp) {
    const currentTime = Math.floor(Date.now() / 1000);
    const tenMinutes = 10 * 60;
    const oneHour = 60 * 60;
    if (unixTimestamp > currentTime + tenMinutes) {
        return false; // 10 minutes in the future
    }
    else if (unixTimestamp < currentTime - oneHour) {
        return false; // one hour in the past
    }
    else {
        return true;
    }
}
