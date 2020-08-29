import * as core from "@actions/core";
import * as github from "@actions/github";
import { inspect } from "util";

export interface Inputs {
  token: string;
  path: string;
}

export async function getDefaultBranch(inputs: Inputs): Promise<string> {
  // Get the repository path
  const [owner, repo] = inputs.path.split("/");

  const octokit = github.getOctokit(inputs.token);

  const branchesResponse = await octokit.repos.listBranches({
    owner,
    repo,
  });

  if (branchesResponse.data.length == 0) {
    return "";
  }

  const repository = await octokit.repos.get({
    owner,
    repo,
  });

  return repository.data.default_branch;
}

async function run(): Promise<string> {
  try {
    const inputs: Inputs = {
      token: core.getInput("token"),
      path: core.getInput("path"),
    };
    core.debug(`Inputs: ${inspect(inputs)}`);

    return await getDefaultBranch(inputs);
  } catch (error) {
    core.setFailed(error.message);
  }
  return "";
}

run();
