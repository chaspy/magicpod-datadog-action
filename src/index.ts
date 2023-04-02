import * as core from '@actions/core'

async function run() {
  const message = core.getInput('message')
  console.log(message)
}

run()
