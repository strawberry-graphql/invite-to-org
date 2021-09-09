module.exports = async ({ github, context, core }) => {
  const {
    ORGANISATION: org,
    TEAM: team_slug,
    PR_NUMBER: prNumber,
  } = process.env;

  const username = "strawberrytest";

  if (!prNumber) {
    console.log("no PR found.");
    return;
  }

  const query = `
  query GetTeam($org: String!, $team_slug: String!, $username: String!) {
    organization(login: $org) {
      team(slug: $team_slug) {
        members(first: 1, query: $username) {
          totalCount
        }
      }
    }
  }
  `;

  // check if user is a member of the team

  const variables = {
    org,
    team_slug,
    username,
  };

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

  const invitations = await github.paginate(
    "GET /orgs/{org}/teams/{team_slug}/invitations",
    {
      org,
      team_slug,
    }
  );

  const invitationsForUser = invitations.filter(
    (invitation) => invitation.login === username
  );

  if (invitationsForUser.length > 0) {
    console.log("user is invited to the team");
    return;
  }

  // create invitation for the user to join the team

  await github.request(
    "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}",
    {
      org,
      team_slug,
      username,
      role: "member",
    }
  );

  const commentResult = await github.issues.createComment({
    owner: "strawberry-graphql",
    repo: "invite-to-org-action",
    issue_number: prNumber,
    body: "You have been invited",
  });

  console.log(commentResult);
};
