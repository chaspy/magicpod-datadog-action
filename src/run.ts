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

// eslint-disable-next-line @typescript-eslint/require-await
export const run = async (inputs: Inputs): Promise<void> => {
  core.info('hello')

  // load insputs
  const dd_api_key = inputs.dd_api_key
  const magicpod_api_key = inputs.magicpod_api_key
  const magicpod_organization_name = inputs.magicpod_organization_name
  const magicpod_project_name = inputs.magicpod_project_name
  const count = 100

  // Get response from magicpod
  ;async () => {
    const data = await getBatchRuns(
      magicpod_api_key,
      magicpod_organization_name,
      magicpod_project_name,
      count
    )
    console.log(data)
  }

  // parse response

  // calcurate duration

  // build metrics for datadog

  // send metric to datadog
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
