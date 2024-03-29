# Changelog

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v2.1.0-beta.1 (`next`, `beta`)

### Interactive click events (beta)

- Added the ability to filter click events by role to ensure the "hand" mouse cursor only appears over interactive elements.

### Performance Improvements

- Improved performance for authenticated embedded charts, by eliminating redundant API calls.

## v2.0.1 (`latest`)

### Bug fixes

- fix: Publish the UMD bundle of `@mongodb-js/charts-embed-dom` that was mistakenly omitted from the `v2.0.0` release.

## v2.0.0

### Breaking Changes

Changed the [Content-Security-Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) of the `iframe` created by the SDK to include the following `sandbox` directive flags:

- **`allow-popups`**: Allows popups to function (eg: `window.open`, `target="_blank"`).
- **`allow-popups-to-escape-sandbox`**: Allows a sandboxed document to open new windows without forcing the sandboxing flags upon them.

This change fixes the issue that prevented hyperlinks within the `iframe` document from opening a new tab/window. While this change does not change an explicit SDK API, it does change the implicit behaviour of the security model, and therefore warranted a major version bump.

## v1.2.0-beta.1 (`beta`)

### Interactive click events (beta)

- Subscribe to click events on a chart using `chart.addEventListener('click', eventHandler);` The `payload`
  parameter in the event callback contains details on the chart element clicked. In this beta release, not
  all chart types are supported, and the payload format is subject to change.

## v1.1.3

### Bug Fixes

- Fixed an issue (#14) where types for `mongodb-stitch-browser-sdk` were missing causing builds with TSC to fail.

## v1.1.2

### Improved API Documentation

In this release, we've added generated API docs to the NPM package bundle in the `docs` folder. We've also corrected some minor typos and omissions in the README.

### Bug Fixes

- We fixed a minor bug in the `maxAgeData` prop where it would ignore when the prop was set to `0`. This resulted in cached data still being served to the client.

## v1.1.1

### Improved Rollup documentation

We've now added an example `rollup.config.js` to the package README to help Rollup users get started with the SDK.

## v1.1.0

### Chart Caching Support

In the latest Charts cloud release, we’ve given developers more control over the caching and refresh behaviour, which can improve performance and user experience. The new `maxDataAge` option allows you to specify when data should be retrieved from the cache or re-queried from the database. This can also be combined with the `autoRefresh` option to ensure charts are always kept current.

Note: as part of this change, we have deprecated the `refreshInterval` property, as the same functionality is accessible through the new `autoRefresh` and `maxDataAge` properties.

### Minor fixes

- Moved `ts-node` to a dev-dependency

## v1.0.0

### Highlights

- 🎉 First release of the Charts Embedding SDK
- 🛠 Dynamically set the current theme, refresh interval, and filter
- 🔒 Support for embedding authentication providers (Custom / Realm / Google)

### 🎉 First release of the Charts Embedding SDK

We're excited to show you the first v1.0.0 release of the embedding SDK. For comprehensive documentation and guides, head on over to https://github.com/mongodb-js/charts-embed-sdk, or https://docs.mongodb.com/charts/master/embedding-charts-sdk/.

### 🛠 Embedding SDK Comamnds

The SDK unlocks interactivity in your charts that simply wasn't possible with IFrame embedding.

- You can now dynamically toggle between dark mode using `setTheme`
- Adjust how frequently your chart refreshes using `setRefreshInterval`
- Control what data is shown in your chart using `setFilter`

### 🔒 Support for Embedding Authentication Providers

You can now control who can view your embedded charts by enabling authenticated embedding. With this setting enabled, you will need to pass in a function to `getUserToken` that returns a JWT with claims
representing the user attempting to view the Chart. For more information, check out our authenticated embedding example here: https://github.com/mongodb-js/charts-embed-sdk/tree/master/examples/authenticated-custom-jwt
