import * as core from '@actions/core'
import { run } from './run'

const main = async (): Promise<void> => {
  await run({
    message: core.getInput('message', { required: true }),
  })
}

main().catch((e) => core.setFailed(e instanceof Error ? e : String(e)))
