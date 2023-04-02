import * as core from '@actions/core'

type Inputs = {
  dd_api_key: string
  magicpod_api_key: string
}

// eslint-disable-next-line @typescript-eslint/require-await
export const run = async (inputs: Inputs): Promise<void> => {
  core.info('hello')

  // load inputs
  const dd_api_key = inputs.dd_api_key
  const magicpod_api_key = inputs.magicpod_api_key

  // Get response from magicpod

  // parse response

  // calcurate duration

  // build metrics for datadog

  // send metric to datadog
}
