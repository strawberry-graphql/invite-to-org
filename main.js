module.exports = async ({ github, context, core }) => {
  const { ORGANISATION, TEAM, PR_NUMBER, ACCESS_TOKEN } = process.env;

  if (!PR_NUMBER) {
    console.log("no PR found.");
    return;
  }

  console.log(`to: ${ACCESS_TOKEN.substring(0, 5)}...`);

  const result = await github.teams.getByName({
    org: ORGANISATION,
    slug: TEAM,
  });
  console.log(result);
};
