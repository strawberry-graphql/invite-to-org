module.exports = async ({ github, context, core }) => {
  const { ORGANISATION, TEAM, PR_NUMBER } = process.env;

  const username = "strawberrytest";

  if (!PR_NUMBER) {
    console.log("no PR found.");
    return;
  }

  const query = `
  query GetTeam($login: String!, $team: String!, $username: String!) {
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
    username,
  };

  console.log(variables);

  const result = await github.graphql(query, variables);

  const {
    organization: {
      team: {
        members: { totalCount },
      },
    },
  } = result;

  if (totalCount > 0) {
    console.log("user is a member of the team");
    return;
  }

  const invitations = await octokit.paginate(
    "GET /orgs/{org}/teams/{team_slug}/invitations",
    {
      org: ORGANISATION,
      team_slug: TEAM,
    }
  );
  // TODO check invitations

  console.log(invitations);

  return;

  // create invitation for the user to join the team

  await github.request(
    "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}",
    {
      org: ORGANISATION,
      team_slug: TEAM,
      username,
      role: "member",
    }
  );
};
