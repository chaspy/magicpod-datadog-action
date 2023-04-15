import {Inputs, getBatchRuns, processBatchRunsData} from './magicpod'

// eslint-disable-next-line @typescript-eslint/require-await
export const run = async (inputs: Inputs): Promise<void> => {
  // Get response from magicpod
  ;(async () => {
    const data = await getBatchRuns(inputs)
    if (data) {
      processBatchRunsData(data)
    } else {
      console.log('Error occurred, no data received')
    }
  })()
}
