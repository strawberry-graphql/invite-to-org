const BOTS = [
  "dependabot-preview[bot]",
  "dependabot-preview",
  "dependabot",
  "dependabot[bot]",
];

module.exports = async ({ github, context, core }) => {
  const {
    ORGANISATION: org,
    TEAM_SLUG: team_slug,
    PR_NUMBER: prNumber,
    REPOSITORY_NAME: repositoryName,
    COMMENT: comment,
    USERNAME: username,
  } = process.env;

  if (!prNumber) {
    console.log("no PR found.");
    return;
  }

  if (BOTS.includes(username)) {
    console.log("skipping because PR was made by a bot.");
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
    console.log("user is already invited to the team");
    return;
  }

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
    owner: org,
    repo: repositoryName,
    issue_number: prNumber,
    body: comment,
  });

  console.log(commentResult);
};
