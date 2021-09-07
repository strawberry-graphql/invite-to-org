module.exports = async ({ github, context, core }) => {
  const { ORGANISATION, TEAM, PR_NUMBER } = process.env;

  if (!PR_NUMBER) {
    console.log("no PR found.");
    return;
  }

  const query = `
  query GetTeam($login: String!, $team: String!) {
    viewer {
      login
    }
    organization(login: $login) {
      name
      teams(first: 10) {
        nodes {
          id
          name
        }
      }
      team(slug: $team) {
        id
      }
    }
  }
  `;

  const variables = {
    login: ORGANISATION,
    team: TEAM,
  };

  console.log(variables);

  const result = await github.graphql(query, variables);
  console.log(result);
};
