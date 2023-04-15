/**
 * Submit metrics returns "Payload accepted" response
 */

// https://docs.datadoghq.com/ja/api/latest/metrics/#submit-metrics

import {client, v2} from '@datadog/datadog-api-client'
import {isStatusRunning} from './magicpod'
const configuration = client.createConfiguration()
const apiInstance = new v2.MetricsApi(configuration)

export function submitBatchRunsMetircs(
  timestamp: number,
  value: number,
  batch_run_number: number,
  test_setting_name: string,
  status: string,
  organization_name: string,
  project_name: string
) {
  const durationSecondParams: v2.MetricsApiSubmitMetricsRequest = {
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
            `status:${status}`,
            `organization_name:${organization_name}`,
            `project_name:${project_name}`
          ],
          unit: 'Second'
        }
      ]
    }
  }

  const countParams: v2.MetricsApiSubmitMetricsRequest = {
    body: {
      series: [
        {
          metric: 'custom.magicpod-datadog-action.batch_run.count',
          type: 3, // gauge
          points: [
            {
              timestamp: timestamp,
              value: 1
            }
          ],
          tags: [
            `batch_run_number:${batch_run_number}`,
            `test_setting_name:${test_setting_name}`,
            `status:${status}`,
            `organization_name:${organization_name}`,
            `project_name:${project_name}`
          ],
          unit: 'Count'
        }
      ]
    }
  }

  if (isTimestampAvailable(timestamp) && !isStatusRunning(status)) {
    console.log(
      `info: timestamp: ${timestamp}, project_name: ${project_name}, test_setting_name: ${test_setting_name}, status: ${status}, value: ${value}`
    )
    apiInstance
      .submitMetrics(durationSecondParams)
      .then((data: v2.IntakePayloadAccepted) => {
        console.log(
          'API called successfully. custom.magicpod-datadog-action.batch_run.duration_second is submitted.'
        )
      })
      .catch((error: any) => console.error(error))

    apiInstance
      .submitMetrics(countParams)
      .then((data: v2.IntakePayloadAccepted) => {
        console.log(
          'API called successfully. custom.magicpod-datadog-action.batch_run.count is submitted.'
        )
      })
      .catch((error: any) => console.error(error))
  } else {
    console.log(`timestamp ${timestamp} is not available. skip to send metrics`)
  }
}

export function submitBatchRunMetircs(
  timestamp: number,
  value: number,
  batch_run_number: number,
  test_setting_name: string,
  status: string,
  organization_name: string,
  project_name: string
) {
  const durationSecondParams: v2.MetricsApiSubmitMetricsRequest = {
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
            `status:${status}`,
            `organization_name:${organization_name}`,
            `project_name:${project_name}`
          ],
          unit: 'Second'
        }
      ]
    }
  }

  const countParams: v2.MetricsApiSubmitMetricsRequest = {
    body: {
      series: [
        {
          metric: 'custom.magicpod-datadog-action.batch_run.count',
          type: 3, // gauge
          points: [
            {
              timestamp: timestamp,
              value: 1
            }
          ],
          tags: [
            `batch_run_number:${batch_run_number}`,
            `test_setting_name:${test_setting_name}`,
            `status:${status}`,
            `organization_name:${organization_name}`,
            `project_name:${project_name}`
          ],
          unit: 'Count'
        }
      ]
    }
  }

  if (isTimestampAvailable(timestamp) && !isStatusRunning(status)) {
    console.log(
      `info: timestamp: ${timestamp}, project_name: ${project_name}, test_setting_name: ${test_setting_name}, status: ${status}, value: ${value}`
    )
    apiInstance
      .submitMetrics(durationSecondParams)
      .then((data: v2.IntakePayloadAccepted) => {
        console.log(
          'API called successfully. custom.magicpod-datadog-action.batch_run.duration_second is submitted.'
        )
      })
      .catch((error: any) => console.error(error))

    apiInstance
      .submitMetrics(countParams)
      .then((data: v2.IntakePayloadAccepted) => {
        console.log(
          'API called successfully. custom.magicpod-datadog-action.batch_run.count is submitted.'
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
