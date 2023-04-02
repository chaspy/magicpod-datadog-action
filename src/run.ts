import * as core from '@actions/core'
import axios from 'axios'

type Inputs = {
  dd_api_key: string
  magicpod_api_key: string
  magicpod_organization_name: string
  magicpod_project_name: string
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
  sendHttpRequest(
    magicpod_api_key,
    magicpod_organization_name,
    magicpod_project_name,
    count
  )

  // parse response

  // calcurate duration

  // build metrics for datadog

  // send metric to datadog
}

async function sendHttpRequest(
  magicpod_api_key: string,
  magicpod_organization_name: string,
  magicpod_project_name: string,
  count: number
) {
  const url = `https://app.magicpod.com/api/v1.0/${magicpod_organization_name}/${magicpod_project_name}/batch-runs/?count=${count}`
  const headers = {
    accept: 'application/json',
    Authorization: `Token ${magicpod_api_key}`
  }

  try {
    const response = await axios.get(url, {headers})
    console.log(response.data)
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}
