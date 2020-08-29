import * as core from "@actions/core";
import * as github from "@actions/github";
import { inspect } from "util";

export interface Inputs {
  token: string;
  path: string;
}

async function getDefaultBranch(inputs: Inputs): Promise<void> {
  // Get the repository path
  const [owner, repo] = inputs.path.split("/");

  const octokit = github.getOctokit(inputs.token);

  const branchesResponse = await octokit.repos.listBranches({
    owner,
    repo,
  });

  core.info(`Number of branches found: ${inspect(branchesResponse.data.length)}`);
  var defaultBranch = "";
  if (branchesResponse.data.length != 0) {
    const repository = await octokit.repos.get({
      owner,
      repo,
    });
    defaultBranch = repository.data.default_branch;
  }
  
  core.startGroup('Setting outputs')
  core.setOutput('default-branch', defaultBranch)
  core.exportVariable('DEFAULT_BRANCH', defaultBranch)
  core.endGroup()
}

async function run(): Promise<void> {
  try {
    const inputs: Inputs = {
      token: core.getInput("token"),
      path: core.getInput("path")
    };
    core.debug(`Inputs: ${inspect(inputs)}`);

    await getDefaultBranch(inputs);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
