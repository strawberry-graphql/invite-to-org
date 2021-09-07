module.exports = async ({ github, context, core }) => {
  const organisation = core.getInput("organisation", { required: true });
  const teamName = core.getInput("team", { required: true });
  const prNumber = core.getInput("pr-number");

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
