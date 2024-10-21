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

export interface BatchRunMetrics {
  timestamp: number
  value: number
  batch_run_number: number
  test_setting_name: string
  status: string
  organization_name: string
  project_name: string
  pattern_name: string
  order: number
  number: number
  test_case_name: string
}

export interface BatchRunsMetrics {
  timestamp: number
  value: number
  batch_run_number: number
  test_setting_name: string
  status: string
  organization_name: string
  project_name: string
}

export function submitBatchRunsMetrics(metrics: BatchRunsMetrics) {
  const tags = [
    `batch_run_number:${metrics.batch_run_number}`,
    `test_setting_name:${metrics.test_setting_name}`,
    `status:${metrics.status}`,
    `organization_name:${metrics.organization_name}`,
    `project_name:${metrics.project_name}`
  ]

  const durationSecondParams = createSubmitMetricsRequest(
    'custom.magicpod-datadog-action.batch_run.duration_second',
    metrics.timestamp,
    metrics.value,
    'Second',
    tags
  )

  const countParams = createSubmitMetricsRequest(
    'custom.magicpod-datadog-action.batch_run.count',
    metrics.timestamp,
    1,
    'Count',
    tags
  )

  if (
    isTimestampAvailable(metrics.timestamp) &&
    !isStatusRunning(metrics.status)
  ) {
    submitMetrics(
      'custom.magicpod-datadog-action.batch_run.duration_second',
      durationSecondParams
    )
    submitMetrics('custom.magicpod-datadog-action.batch_run.count', countParams)
  } else {
    console.log(
      `timestamp ${metrics.timestamp} is not available. skip to send metrics`
    )
  }
}

export function submitBatchRunMetrics(metrics: BatchRunMetrics) {
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
  ]

  const durationSecondParams = createSubmitMetricsRequest(
    'custom.magicpod-datadog-action.test_case.duration_second',
    metrics.timestamp,

    metrics.value,
    'Second',
    tags
  )

  const countParams = createSubmitMetricsRequest(
    'custom.magicpod-datadog-action.test_case.count',
    metrics.timestamp,
    1,
    'Count',
    tags
  )

  if (
    isTimestampAvailable(metrics.timestamp) &&
    !isStatusRunning(metrics.status)
  ) {
    submitMetrics(
      'custom.magicpod-datadog-action.test_case.duration_second',
      durationSecondParams
    )
    submitMetrics('custom.magicpod-datadog-action.test_case.count', countParams)
  } else {
    console.log(
      `timestamp ${metrics.timestamp} is not available. skip to send metrics`
    )
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
