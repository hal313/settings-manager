# [settings-manager](https://github.com/hal313/settings-manager)

> A facade for user settings repositories.

[![Build Status](http://img.shields.io/travis/hal313/settings-manager/master.svg?style=flat-square)](https://travis-ci.org/hal313/settings-manager)
[![NPM version](http://img.shields.io/npm/v/settings-manager.svg?style=flat-square)](https://www.npmjs.com/package/settings-manager)
[![Dependency Status](http://img.shields.io/david/hal313/settings-manager.svg?style=flat-square)](https://david-dm.org/hal313/settings-manager)

## Introduction

This is intended as a generic interface to an asynchronous setting API. Using this library allows for abstraction of the underlying settings. This package was intended for plugin development in order to make plugins portable across platforms.

## Setup

```bash
npm install
```

### Building

A build will check the source code and place code in the build\dist folder.

```bash
npm run build
```

To run a build on source code changes:

```bash
npm run build:watch
```

To build distributable artifacts (which includes a minimized version as well as burning in build-time data):

```bash
npm run dist
```

### Running Tests

To run tests against the source code and dist folder (including coverage):

```bash
npm test
```

To run tests against the source code and dist folder (including coverage), with reload:

```bash
npm run test:watch
```

## Build a Release

This is a basic script which can be used to build and deploy (to NPM) the project.

```bash
npm run release
```

Releases to the NPM registry are handled by Travis CI. Pushing `master` to GitHub will trigger a build and deploy to the NPM registry.

## API

> new SettingsManager([backing_store])

Creates a new SettingsManager instance. The optional backing store should implement the same API as SettingsManager, or have an adapter provided. With no backing store specified, an in-memory store will be used.

> load([success][, error])

Loads the settings. Takes a success callback and an error callback. The value passed into the settings callback represents the value from the backing store.

> save(settings[, success][, error])

Saves the settings. Requires the settings to save and takes an optional callback for the success or error status.

> clear([success][, error]])

Clears the settings. Takes an optional callback for the success or error status.
