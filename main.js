module.exports = async ({ github, context, core }) => {
  const { ORGANISATION, TEAM, PR_NUMBER } = process.env;

  if (!PR_NUMBER) {
    console.log("no PR found.");
    return;
  }

  const octokit = new github.GitHub();

  const team = await octokit.teams.getByName({
    org: ORGANISATION,
    team_slug: TEAM,
  });

  console.log(team);
};
