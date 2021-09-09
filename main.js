module.exports = async ({ github, context, core }) => {
  const { ORGANISATION, TEAM, PR_NUMBER } = process.env;

  if (!PR_NUMBER) {
    console.log("no PR found.");
    return;
  }

  const query = `
  query GetTeam($login: String!, $team: String!) {
    organization(login: $login) {
      team(slug: $team) {
        members(first: 1, query: $username) {
          totalCount
        }
      }
    }
  }
  `;

  // check if user is a member of the team

  const variables = {
    login: ORGANISATION,
    team: TEAM,
    username: "patrick91",
  };

  const result = await github.graphql(query, variables);
  const {
    organisation: {
      team: {
        members: { totalCount },
      },
    },
  } = result;

  console.log(result, totalCount);
};
