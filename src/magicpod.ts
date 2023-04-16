import axios, {AxiosResponse} from 'axios'
import {
  BatchRunsMetrics,
  BatchRunMetrics,
  submitBatchRunMetrics,
  submitBatchRunsMetrics
} from './datadog'

export type Inputs = {
  magicpod_api_token: string
  magicpod_organization_name: string
  magicpod_project_name: string
  magicpod_record_count: string
}

interface BatchRuns {
  organization_name: string
  project_name: string
  batch_runs: BatchRun[]
}

interface BatchRun {
  organization_name: string
  project_name: string
  batch_run_number: number
  test_setting_name: string
  status: string
  started_at: string
  finished_at: string
  test_cases: TestCases
  url: string
}

interface TestCases {
  succeeded: number
  failed: number
  aborted: number
  unresolved: number
  total: number
  details: Detail[]
}

interface Detail {
  pattern_name: string
  included_labels: string
  excluded_labels: string
  results: Result[]
}

interface Result {
  order: number
  number: number
  status: string
  started_at: string
  finished_at: string
  data_patterns: any
}

export async function getBatchRuns(inputs: Inputs): Promise<BatchRuns | null> {
  // Load insputs
  const magicpod_api_token = inputs.magicpod_api_token
  const magicpod_organization_name = inputs.magicpod_organization_name
  const magicpod_project_name = inputs.magicpod_project_name
  const magicpod_record_count = inputs.magicpod_record_count

  const url = `https://app.magicpod.com/api/v1.0/${magicpod_organization_name}/${magicpod_project_name}/batch-runs/?count=${magicpod_record_count}`
  const headers = {
    accept: 'application/json',
    Authorization: `Token ${magicpod_api_token}`
  }

  try {
    const response: AxiosResponse<BatchRuns> = await axios.get(url, {headers})
    return response.data
  } catch (error) {
    console.error(`Error: ${error}`)
    return null
  }
}

export function processBatchRunsData(
  batchRunsData: BatchRuns,
  inputs: Inputs
): void {
  const organization_name = batchRunsData.organization_name
  const project_name = batchRunsData.project_name

  batchRunsData.batch_runs.forEach((batchRun, index) => {
    const durationSeconds = calculateTimeDifferenceSecond(
      batchRun.started_at,
      batchRun.finished_at
    )

    const batch_run_number = batchRun.batch_run_number
    // Call get BatchRun API for details
    ;(async () => {
      const data = await getBatchRun(inputs, batch_run_number)
      if (data) {
        processBatchRunData(data)
      } else {
        console.log('Error occurred, no data received')
      }
    })()

    const test_setting_name = batchRun.test_setting_name
    const status = batchRun.status
    const finished_at = batchRun.finished_at
    const timestampSeconds = getUnixTimestampSeconds(finished_at)

    const metrics: BatchRunsMetrics = {
      timestamp: timestampSeconds,
      value: durationSeconds,
      batch_run_number: batch_run_number,
      test_setting_name: test_setting_name,
      status: status,
      organization_name: organization_name,
      project_name: project_name
    }

    submitBatchRunsMetrics(metrics)
  })
}

export function processBatchRunData(batchRunData: BatchRun): void {
  const organization_name = batchRunData.organization_name
  const project_name = batchRunData.project_name
  const batch_run_number = batchRunData.batch_run_number
  const test_setting_name = batchRunData.test_setting_name

  batchRunData.test_cases.details.forEach((details, index) => {
    const pattern_name = details.pattern_name

    details.results.forEach((results, index) => {
      const durationSeconds = calculateTimeDifferenceSecond(
        results.started_at,
        results.finished_at
      )

      const finished_at = results.finished_at
      const timestampSeconds = getUnixTimestampSeconds(finished_at)

      const status = results.status
      const order = results.order
      const number = results.number

      const metrics: BatchRunMetrics = {
        timestamp: timestampSeconds,
        value: durationSeconds,
        batch_run_number: batch_run_number,
        test_setting_name: test_setting_name,
        status: status,
        organization_name: organization_name,
        project_name: project_name,
        pattern_name: pattern_name,
        order: order,
        number: number
      }

      submitBatchRunMetrics(metrics)
    })
  })
}

function getUnixTimestampSeconds(dateString: string): number {
  const dateObject: Date = new Date(dateString)
  const unixTimestamp: number = dateObject.getTime()

  return unixTimestamp / 1000 // seconds
}

function calculateTimeDifferenceSecond(time1: string, time2: string): number {
  const date1 = new Date(time1)
  const date2 = new Date(time2)

  const difference = Math.abs(date2.getTime() - date1.getTime()) // milli seconds

  return difference / 1000 // seconds
}

// getButchRuns API returns all BatchRuns includes Running Status.
// However, 'Running' ones are useless because we want to store success rates and success results in Datadog.
export function isStatusRunning(status: string): boolean {
  return status == 'running' ? true : false
}

export async function getBatchRun(
  inputs: Inputs,
  batch_run_number: number
): Promise<BatchRun | null> {
  // Load insputs
  const magicpod_api_token = inputs.magicpod_api_token
  const magicpod_organization_name = inputs.magicpod_organization_name
  const magicpod_project_name = inputs.magicpod_project_name

  const url = `https://app.magicpod.com/api/v1.0/${magicpod_organization_name}/${magicpod_project_name}/batch-run/${batch_run_number}/`
  const headers = {
    accept: 'application/json',
    Authorization: `Token ${magicpod_api_token}`
  }

  try {
    const response: AxiosResponse<BatchRun> = await axios.get(url, {headers})
    return response.data
  } catch (error) {
    console.error(`Error: ${error}`)
    return null
  }
}
