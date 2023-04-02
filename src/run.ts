import * as core from '@actions/core'

type Inputs = {
  message: string
}

// eslint-disable-next-line @typescript-eslint/require-await
export const run = async (inputs: Inputs): Promise<void> => {
  core.info(`message: ${inputs.message}`)
}
