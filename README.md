# Invite to organisation Action

This GitHub action is used to invite a user to an organisation. We use this
action to invite all users that have sent a pull request that has been merged to
Strawberry GraphQL.

## Inputs

- `organisation`: the name of the organisation
- `team-slug`: the slug of the team the user should be invited to
- `github-token`: the GitHub token, needs to have the `admin:org` scope and
  `public:repo` permission in order to invite users and add a comment to the PR.
- `comment`: the comment that will be sent to the PR when the user is invited.

## Outputs

This action has no outputs. It will invite the user and send a comment to the PR
that was merged.

## Example usage

```yaml
name: Get PR info

on:
  pull_request:

jobs:
  invite-contributor:
    name: Invite contributor
    runs-on: ubuntu-latest

    steps:
      - name: Invite contributor
        uses: strawberry-graphql/invite-to-org-action@v1
        with:
          organisation: "strawberry-graphql"
          comment: Thanks for contributing to Strawberry!
          team-slug: "strawberry-contributors"
          github-token: ${{ secrets.GITHUB_TOKEN }}
```
