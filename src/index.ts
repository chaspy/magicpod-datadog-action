import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const message = core.getInput('message');
    console.log(message);

    const token = core.getInput('token');
    const context = github.context;
    const octokit = github.getOctokit(token);

    const newIssue = await octokit.issues.create({
      ...context.repo,
      title: 'My GitHub Action',
      body: `Hello, I am a GitHub Action created with TypeScript! Message: ${message}`,
    });

    core.setOutput('issue', JSON.stringify(newIssue.data));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

