#!/bin/bash

# Fetch all tags and get the latest tag
git fetch --tags --prune-tags --prune
latest_tag=$(git tag -l --sort=-v:refname | head -n 1)

# Initialize as v1.0.0 if there is no tag
if [ -z "$latest_tag" ]; then
  latest_tag="v1.0.0"
fi

# Increment the patch version by 1 from the latest tag
new_tag=$(echo "$latest_tag" | awk -F. '{ printf("%s.%s.%s", $1, $2, $3+1) }')


# compile
npm install
npm run all

git config --global user.email "chaspy@users.noreply.github.com"
git config --global user.name "Takeshi Kondo"

# commit
git add .
git commit -m 'compile'

# Create a new tag locally
git tag "${new_tag}"

# Push the new tag to the remote repository
git push origin "${new_tag}"

# Get all merge commits between the latest tag and the current branch
merge_commits=$(git log --merges --pretty=format:"%s" "${latest_tag}"..main)
renovate_commits=$(git log --oneline "${latest_tag}"..main | grep 'Update dependency')
release_note_body="${merge_commits}\n${renovate_commits}"

# Create a release using GitHub's API
repo_url="https://api.github.com/repos/chaspy/magicpod-datadog-action/releases"
response=$(curl -s -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -d "{\"tag_name\":\"$new_tag\",\"name\":\"Release $new_tag\",\"body\":\"${release_note_body}\"}" \
  $repo_url)

# Check if the release was created successfully
if echo "$response" | grep -q '"id":'; then
  echo "Release $new_tag was created successfully."
else
  echo "Failed to create release. Please check your GITHUB_TOKEN and repository settings."
fi

