#!/bin/bash

## Publishes the extension to the Chrome Web Store if on the master branch
if [[ 'master' == $TRAVIS_BRANCH ]]; then
  echo "Publishing on branch: $TRAVIS_BRANCH"
  npm run dist
  npm publish
else
  echo "Building on branch: $TRAVIS_BRANCH"
  npm run dist
fi