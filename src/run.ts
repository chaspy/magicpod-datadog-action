import * as core from '@actions/core'
import axios, {AxiosResponse} from 'axios'

type Inputs = {
  dd_api_key: string
  magicpod_api_key: string
  magicpod_organization_name: string
  magicpod_project_name: string
}

interface TestCases {
  succeeded: number
  failed: number
  aborted: number
  unresolved: number
  total: number
}

interface BatchRun {
  batch_run_number: number
  test_setting_name: string
  status: string
  started_at: string
  finished_at: string
  test_cases: TestCases
  url: string
}

interface BatchRuns {
  organization_name: string
  project_name: string
  batch_runs: BatchRun[]
}

interface BatchRunsData {
  batch_run_number: number
  test_setting_name: string
  status: string
  duration: number // second
}

// eslint-disable-next-line @typescript-eslint/require-await
export const run = async (inputs: Inputs): Promise<void> => {
  // Load insputs
  const dd_api_key = inputs.dd_api_key
  const magicpod_api_key = inputs.magicpod_api_key
  const magicpod_organization_name = inputs.magicpod_organization_name
  const magicpod_project_name = inputs.magicpod_project_name
  const count = 100

  // Get response from magicpod
  ;(async () => {
    const data = await getBatchRuns(
      magicpod_api_key,
      magicpod_organization_name,
      magicpod_project_name,
      count
    )
    if (data) {
      processBatchRunsData(data)
    } else {
      console.log('Error occurred, no data received')
    }
  })()

  // parse response

  // calcurate duration

  // build metrics for datadog

  // send metric to datadog
}

function processBatchRunsData(batchRunsData: BatchRuns): void {
  console.log(`Organization Name: ${batchRunsData.organization_name}`)
  console.log(`Project Name: ${batchRunsData.project_name}`)
  console.log('Batch Runs:')
  batchRunsData.batch_runs.forEach((batchRun, index) => {
    console.log(`  Batch Run #${index + 1}`)
    console.log(`    Batch Run Number: ${batchRun.batch_run_number}`)
    console.log(`    Status: ${batchRun.status}`)
    console.log(`    Started At: ${batchRun.started_at}`)
    console.log(`    Finished At: ${batchRun.finished_at}`)
    console.log(`    Test Cases:`)
    console.log(`      Succeeded: ${batchRun.test_cases.succeeded}`)
    console.log(`      Failed: ${batchRun.test_cases.failed}`)
    console.log(`      Aborted: ${batchRun.test_cases.aborted}`)
    console.log(`      Unresolved: ${batchRun.test_cases.unresolved}`)
    console.log(`      Total: ${batchRun.test_cases.total}`)
    console.log(`    URL: ${batchRun.url}`)
    const diff = calculateTimeDifferenceSecond(
      batchRun.started_at,
      batchRun.finished_at
    )
    console.log(diff)
  })
}

function calculateTimeDifferenceSecond(time1: string, time2: string): number {
  const date1 = new Date(time1)
  const date2 = new Date(time2)

  const difference = Math.abs(date2.getTime() - date1.getTime()) // milli seconds

  return difference / 1000 // seconds
}

async function getBatchRuns(
  magicpod_api_key: string,
  magicpod_organization_name: string,
  magicpod_project_name: string,
  count: number
): Promise<BatchRuns | null> {
  const url = `https://app.magicpod.com/api/v1.0/${magicpod_organization_name}/${magicpod_project_name}/batch-runs/?count=${count}`
  const headers = {
    accept: 'application/json',
    Authorization: `Token ${magicpod_api_key}`
  }

  try {
    const response: AxiosResponse<BatchRuns> = await axios.get(url, {headers})
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(`Error: ${error}`)
    return null
  }
}
