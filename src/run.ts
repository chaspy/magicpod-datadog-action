import * as core from '@actions/core'

type Inputs = {
  dd_api_key: string
  magicpod_api_key: string
}

// eslint-disable-next-line @typescript-eslint/require-await
export const run = async (inputs: Inputs): Promise<void> => {
  core.info('hello')

  // load inputs
  // MAGICPOD_API_KEY
  // DD_API_KEY

  // Get response from magicpod

  // parse response

  // calcurate duration

  // build metrics for datadog

  // send metric to datadog
}
