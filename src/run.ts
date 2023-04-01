import {getBatchRuns, processBatchRunsData} from './magicpod'

type Inputs = {
  magicpod_api_token: string
  magicpod_organization_name: string
  magicpod_project_name: string
}

// eslint-disable-next-line @typescript-eslint/require-await
export const run = async (inputs: Inputs): Promise<void> => {
  // Load insputs
  const magicpod_api_token = inputs.magicpod_api_token
  const magicpod_organization_name = inputs.magicpod_organization_name
  const magicpod_project_name = inputs.magicpod_project_name
  const count = 10

  // Get response from magicpod
  ;(async () => {
    const data = await getBatchRuns(
      magicpod_api_token,
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
}
