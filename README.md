# [settings-manager](https://github.com/hal313/settings-manager)

> A simple facade for user settings repositories

[![Build Status](http://img.shields.io/travis/hal313/settings-manager/master.svg?style=flat-square)](https://travis-ci.org/hal313/settings-manager)
[![NPM version](http://img.shields.io/npm/v/settings-manager.svg?style=flat-square)](https://www.npmjs.com/package/settings-manager)
[![Dependency Status](http://img.shields.io/david/hal313/settings-manager.svg?style=flat-square)](https://david-dm.org/hal313/settings-manager)

## Introduction
This is intended as a generic interface to an asynchronous setting API. Using this library allows for abstraction of the underlying settings. This package was intended for plugin development - in an effort to make plugins portable across platforms.

## Setup
```
npm install -g grunt
npm install
```

### Building
A build will generate usable artifacts in the `dist/`. Invoke a build like so:
```
npm run build
```

To build distributable artifacts (which includes a minimized version as well as burning in build-time data):
```
npm run dist
```

### Running Tests
To run tests against the source code only, in a browser, watching file changes:
```
npm test
```

To run tests against the source code, the distributable code and the minimized distributable code all in a browser:
```
npm run test-all-watch
```

To run tests against the source code, the distributable code and the minimized distributable code all in a headless browser:
```
npm run test-all-headless
```

## API:

> new SettingsManager([backing_store])

Creates a new SettingsManager instance. The optional backing store should implement the same API as SettingsManager, or have an adapter provided. With no backing store specified, an in-memory store will be used.

> load([success][, error])

Loads the settings. Takes a success callback and an error callback. The value passed into the settings callback represents the value from the backing store.

> save(settings[, success][, error])

Saves the settings. Requires the settings to save and takes an optional callback for the success or error status.

> clear([success][, error]])

Clears the settings. Takes an optional callback for the success or error status.

# Deploying
This is a basic script which can be used to build and deploy (to NPM) the project.

```
export VERSION=0.0.14
git checkout -b release/$VERSION
npm run dist
npm version --no-git-tag-version patch
git add package*
git commit -m 'Version bump'
git add dist/
git commit -m 'Generated artifacts'
git checkout master
git merge --no-ff release/$VERSION
git tag -a -m 'Tagged for release' $VERSION
git branch -d release/$VERSION
git checkout develop
git merge --no-ff master
git push --all && git push --tags
```