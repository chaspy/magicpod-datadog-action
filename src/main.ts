import * as core from '@actions/core'
import {run} from './run'

const main = async (): Promise<void> => {
  await run({
    dd_api_key: core.getInput('dd_api_key', {required: true}),
    magicpod_api_key: core.getInput('magicpod_api_key', {required: true}),
    magicpod_organization_name: core.getInput('magicpod_organization_name', {
      required: true
    }),
    magicpod_project_name: core.getInput('magicpod_project_name', {
      required: true
    })
  })
}

main().catch(e => core.setFailed(e instanceof Error ? e : String(e)))
