#!/bin/sh

## Release script, inspired from:
## https://gist.github.com/hal313/490e4aeaa591eeca14d2570ecb660f67

## Parse the command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"

    case $key in
        -d|--skip-dirty-workspace-check)
        SKIP_DIRTY_WORKSPACE_CHECK=true
        shift
        ;;
        -p|--skip-push)
        SKIP_PUSH=true
        shift
        ;;
        -h|--help)
        echo `basename $0`;
        echo '    -d | --skip-dirt-workspace-check          Skips the dirty workspace check'
        echo '    -p | --skip-push                          Does not push branches and tags'
        exit
        ;;
        *)    # Unknown command line option
        echo "Unknown command line option: \"$1\"; try running \"`basename $0` --help\""
        exit;
        ;;
    esac
done

## Check the workspace status unless the user
if [ `git status --porcelain | wc -l` -ne "0" -a "${SKIP_DIRTY_WORKSPACE_CHECK}" != true ]; then
    echo "Workspace is dirty, cannot complete a release"
    exit;
fi

## Get the next version
NEXT_VERSION=$(node -p -e "let currentVersion = require('./package.json').version, parts = currentVersion.split('.'); parts[2] = Number.parseInt(parts[2])+1; parts.join('.');")

## Create a new branch
git checkout -b release/${NEXT_VERSION}
## Bump the patch version (and do not commit the changes)
npm version --no-git-tag-version patch
## Bump the version
git commit -a -m 'Version bump'
## Merge into master
git checkout master
git pull origin master
git merge --no-ff release/${NEXT_VERSION}
## Tag and delete the release branch
git tag -a -m 'Tagged for release' ${NEXT_VERSION}
git branch -d release/${NEXT_VERSION}
## Merge down to develop
git checkout develop
git merge --no-ff master
if [ "${SKIP_PUSH}" != "true" ]; then
    git push --all && git push --tags
fi