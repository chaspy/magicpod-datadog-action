/**
 * Submit metrics returns "Payload accepted" response
 */

// https://docs.datadoghq.com/ja/api/latest/metrics/#submit-metrics

import {client, v2} from '@datadog/datadog-api-client'
import {isStatusRunning} from './magicpod'
const configuration = client.createConfiguration()
const apiInstance = new v2.MetricsApi(configuration)

function createSubmitMetricsRequest(
  metric: string,
  timestamp: number,
  value: number,
  unit: string,
  tags: string[]
): v2.MetricsApiSubmitMetricsRequest {
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
  }
}

function submitMetrics(
  metricName: string,
  params: v2.MetricsApiSubmitMetricsRequest
) {
  apiInstance
    .submitMetrics(params)
    .then((data: v2.IntakePayloadAccepted) => {
      console.log(`API called successfully. ${metricName} is submitted.`)
    })
    .catch((error: any) => console.error(error))
}

export function submitBatchRunsMetrics(
  timestamp: number,
  value: number,
  batch_run_number: number,
  test_setting_name: string,
  status: string,
  organization_name: string,
  project_name: string
) {
  const tags = [
    `batch_run_number:${batch_run_number}`,
    `test_setting_name:${test_setting_name}`,
    `status:${status}`,
    `organization_name:${organization_name}`,
    `project_name:${project_name}`
  ]

  const durationSecondParams = createSubmitMetricsRequest(
    'custom.magicpod-datadog-action.batch_run.duration_second',
    timestamp,
    value,
    'Second',
    tags
  )

  const countParams = createSubmitMetricsRequest(
    'custom.magicpod-datadog-action.batch_run.count',
    timestamp,
    1,
    'Count',
    tags
  )

  if (isTimestampAvailable(timestamp) && !isStatusRunning(status)) {
    submitMetrics(
      'custom.magicpod-datadog-action.batch_run.duration_second',
      durationSecondParams
    )
    submitMetrics('custom.magicpod-datadog-action.batch_run.count', countParams)
  } else {
    console.log(`timestamp ${timestamp} is not available. skip to send metrics`)
  }
}

export function submitBatchRunMetrics(
  timestamp: number,
  value: number,
  batch_run_number: number,
  test_setting_name: string,
  status: string,
  organization_name: string,
  project_name: string,
  pattern_name: string,
  order: number,
  number: number
) {
  const tags = [
    `batch_run_number:${batch_run_number}`,
    `test_setting_name:${test_setting_name}`,
    `status:${status}`,
    `organization_name:${organization_name}`,
    `project_name:${project_name}`,
    `pattern_name:${pattern_name}`,
    `order:${order}`,
    `number:${number}`
  ]

  const durationSecondParams = createSubmitMetricsRequest(
    'custom.magicpod-datadog-action.test_case.duration_second',
    timestamp,

    value,
    'Second',
    tags
  )

  const countParams = createSubmitMetricsRequest(
    'custom.magicpod-datadog-action.test_case.count',
    timestamp,
    1,
    'Count',
    tags
  )

  if (isTimestampAvailable(timestamp) && !isStatusRunning(status)) {
    submitMetrics(
      'custom.magicpod-datadog-action.test_case.duration_second',
      durationSecondParams
    )
    submitMetrics('custom.magicpod-datadog-action.test_case.count', countParams)
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
