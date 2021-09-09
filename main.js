module.exports = async ({ github, context, core }) => {
  const { ORGANISATION, TEAM, PR_NUMBER } = process.env;

  if (!PR_NUMBER) {
    console.log("no PR found.");
    return;
  }

  const result = await github.teams.getByName({
    org: ORGANISATION,
    slug: TEAM
  });
  console.log(result);
};
