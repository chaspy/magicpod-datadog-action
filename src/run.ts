import {getBatchRuns, getBatchRun, processBatchRunsData} from './magicpod'

type Inputs = {
  magicpod_api_token: string
  magicpod_organization_name: string
  magicpod_project_name: string
  magicpod_record_count: string
}

// eslint-disable-next-line @typescript-eslint/require-await
export const run = async (inputs: Inputs): Promise<void> => {
  // Load insputs
  const magicpod_api_token = inputs.magicpod_api_token
  const magicpod_organization_name = inputs.magicpod_organization_name
  const magicpod_project_name = inputs.magicpod_project_name
  const magicpod_record_count = inputs.magicpod_record_count

  // Get response from magicpod
  ;(async () => {
    const data = await getBatchRuns(
      magicpod_api_token,
      magicpod_organization_name,
      magicpod_project_name,
      magicpod_record_count
    )
    if (data) {
      processBatchRunsData(data)

      // Get BatchRun Details foreach data
      // for each data.batch_numbers
      // const batchRunData = await getBatchRun(
      // magicpod_api_token,
      // magicpod_organization_name,
      // magicpod_project_name,
      // data.
      // )
    } else {
      console.log('Error occurred, no data received')
    }
  })()
}
