/**
 * Submit metrics returns "Payload accepted" response
 */

// https://docs.datadoghq.com/ja/api/latest/metrics/#submit-metrics

import {client, v2} from '@datadog/datadog-api-client'

const configuration = client.createConfiguration()
const apiInstance = new v2.MetricsApi(configuration)

export function submitMetircs(
  timestamp: number,
  value: number,
  batch_run_number: number,
  test_setting_name: string,
  status: string
) {
  const params: v2.MetricsApiSubmitMetricsRequest = {
    body: {
      series: [
        {
          metric: 'custom.magicpod-datadog-action.batch_run.duration_second',
          type: 3, // gauge
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
  }

  if (isTimestampAvailable(timestamp)) {
    apiInstance
      .submitMetrics(params)
      .then((data: v2.IntakePayloadAccepted) => {
        console.log(
          'API called successfully. Returned data: ' + JSON.stringify(data)
        )
      })
      .catch((error: any) => console.error(error))
  } else {
    console.log(`timestamp ${timestamp} is not available. skip to send metrics`)
  }
}

// https://docs.datadoghq.com/ja/api/latest/metrics/?code-lang=typescript#submit-metrics
// points:
// Timestamps should be in POSIX time in seconds,
// and cannot be more than ten minutes in the future or more than one hour in the past.
function isTimestampAvailable(unixTimestampSeconds: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000)
  const tenMinutes = 10 * 60
  const oneHour = 60 * 60

  if (unixTimestampSeconds > currentTime + tenMinutes) {
    return false // 10 minutes in the future
  } else if (unixTimestampSeconds < currentTime - oneHour) {
    return false // one hour in the past
  } else {
    return true
  }
}
