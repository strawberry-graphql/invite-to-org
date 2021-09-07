import * as core from "@actions/core";
import * as github from "@actions/github";

const run = async () => {
  const organisation = core.getInput("organisation", { required: true });
  const teamName = core.getInput("team", { required: true });
  const prNumber = core.getInput("pr-number");
  const { ACCESS_TOKEN } = process.env;

  if (!ACCESS_TOKEN) {
    return core.setFailed("ENV required and not supplied: ACCESS_TOKEN");
  }

  if (!prNumber) {
    console.log("no PR found.");
    return;
  }

  const octokit = new github.GitHub(ACCESS_TOKEN);

  const team = await octokit.teams.getByName({
    org: organisation,
    team_slug: teamName,
  });

  console.log(team);
};

run();
