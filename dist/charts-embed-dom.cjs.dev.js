'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var _isEqual = _interopDefault(require('lodash/isEqual'))
var _isEmpty = _interopDefault(require('lodash/isEmpty'))
var bson = require('bson-m-react18')
var chatty = require('@looker/chatty')

// Given an object `Target`, find all property names of type `Type`
// Given an object `Target`, filter out all properties that aren't of type `Type`
function createElement(name, props = {}, children = []) {
  const element = document.createElement(name)

  for (const [name, value] of Object.entries(props)) {
    if (name === 'style') {
      Object.assign(element.style, props.style)
    } else {
      element.setAttribute(name, value)
    }
  }

  for (const child of Array.isArray(children) ? children : [children]) {
    element.append(child)
  }

  return element
}

/**
 * Constructs the chart iframe URL from the baseUrl, chartId & tenantId
 */
const getChartUrl = (options) => {
  try {
    const url = new URL(options.baseUrl)
    url.pathname = [
      url.pathname,
      url.pathname.slice(-1) === '/' ? '' : '/',
      'embed/charts',
    ].join('')
    url.search = `id=${options.chartId}&sdk=2`

    if (options.autoRefresh) {
      url.search += `&autorefresh=${options.autoRefresh}`
    } else {
      url.search += options.refreshInterval
        ? `&autorefresh=${options.refreshInterval}`
        : ''
    }

    if (options.maxDataAge !== undefined) {
      url.search += `&maxDataAge=${options.maxDataAge}`
    }

    url.search += options.filter
      ? `&filter=${encodeURIComponent(
          bson.EJSON.stringify(options.filter, {
            relaxed: false,
          })
        )}`
      : ''
    url.search += options.theme ? `&theme=${options.theme}` : ''
    url.search +=
      options.showAttribution === false
        ? `&attribution=${options.showAttribution}`
        : ''
    return url.toString()
  } catch (e) {
    throw new Error('Base URL must be a valid URL')
  }
}
/* Parses a CSS Measurement from an unknown value
     - if it's a string, we trust that it is well-formed
     - if it's a number, we assume the units are pixels
     - otherwise we return null
*/

const parseCSSMeasurement = (value) => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return `${value}px`
  return null
}
/**
 * Returns the background after validation checks
 * or default background based on theme if not set
 */

const getBackground = (background, theme) => {
  if (typeof background === 'string' && background.length > 0) return background
  if (theme === 'dark') return '#21313C'
  return '#FFFFFF'
}

// Disabled temporarily to fix: https://github.com/mongodb-js/charts-embed-sdk/issues/14
// Until we come up with a better way to have strong typing for the Stitch client, while
// also not breaking normal TSC compiles of the SDK
// import type { StitchAppClient } from 'mongodb-stitch-browser-sdk';
const isJWTExpired = (jwt) => {
  try {
    const [header, payload, signature] = jwt.split('.')
    const { exp } = JSON.parse(atob(payload)) // Check the current time against the expiry (minus 5 minutes) in the token

    return Date.now() / 1000 >= exp - 300
  } catch (e) {
    throw new Error(
      'Failed to parse Realm token. Is the StitchClient configured correctly?'
    )
  }
}
/**
 * A helper utility to support using [Realm Authentication](https://docs.mongodb.com/stitch/) with MongoDB Charts
 *
 * ```js
 * const client = Stitch.initializeDefaultAppClient('<your-client-app-id>');
 * client.auth.loginWithCredential(...)
 *
 * const sdk = new ChartsEmbedSDK({
 *   getUserToken: () => getRealmUserToken(client)
 * })
 * ```
 */

async function getRealmUserToken(stitchAppClient) {
  const client = stitchAppClient

  if (!client.auth || !client.auth.authInfo) {
    throw new Error('Unfamiliar Stitch client version')
  }

  if (!client.auth.isLoggedIn) {
    throw new Error(
      'Could not find a logged-in StitchUser. Is the StitchClient configured correctly?'
    )
  }

  if (!client.auth.authInfo.accessToken) {
    throw new Error(
      'Could not find a valid JWT. Is the StitchClient configured correctly?'
    )
  }

  if (isJWTExpired(client.auth.authInfo.accessToken)) {
    // Attempt to refresh token using progression from public -> private apis
    if (client.auth.refreshCustomData) {
      await client.auth.refreshCustomData() // supported from 4.8.0
    } else if (client.auth.refreshAccessToken) {
      await client.auth.refreshAccessToken() // supported from 4.0.0
    } else {
      throw new Error(
        'Could not refresh token. Unfamiliar Stitch client version'
      )
    }
  }

  return client.auth.authInfo.accessToken
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }
  return obj
}

const getChartOptions = (options) => {
  if (typeof options !== 'object' || options === null) {
    throw new Error('Options argument must be an object')
  }

  const {
    background,
    baseUrl,
    chartId,
    filter,
    refreshInterval,
    autoRefresh,
    maxDataAge,
    width,
    height,
    theme,
    showAttribution,
    getUserToken,
  } = options

  if (typeof baseUrl !== 'string' || baseUrl.length === 0) {
    throw new Error('Base URL must be a valid URL')
  }

  if (typeof chartId !== 'string' || chartId.length === 0) {
    throw new Error('Chart ID must be specified')
  }

  if (width !== undefined && !['number', 'string'].includes(typeof width)) {
    throw new Error('Width must be a string or number if specified')
  }

  if (height !== undefined && !['number', 'string'].includes(typeof height)) {
    throw new Error('Height must be a string or number if specified')
  }

  if (filter !== undefined && (!filter || typeof filter !== 'object')) {
    throw new Error('Filter must be an object if specified')
  }

  if (refreshInterval !== undefined && typeof refreshInterval !== 'number') {
    throw new Error('refreshInterval interval must be a number if specified')
  }

  if (autoRefresh !== undefined && typeof autoRefresh !== 'boolean') {
    throw new Error('autoRefresh must be a boolean if specified')
  }

  if (maxDataAge !== undefined && typeof maxDataAge !== 'number') {
    throw new Error('maxDataAge must be a number if specified')
  }

  if (theme !== undefined && typeof theme !== 'string') {
    throw new Error('Theme must be a string if specified')
  }

  if (showAttribution !== undefined && typeof showAttribution !== 'boolean') {
    throw new Error('Attribution must be a boolean value if specified')
  }

  if (getUserToken !== undefined && typeof getUserToken !== 'function') {
    throw new Error('getUserToken must be a function')
  }

  if (background !== undefined && typeof background !== 'string') {
    throw new Error('background must be a string if specified')
  }

  return {
    background,
    baseUrl,
    chartId,
    filter,
    refreshInterval,
    autoRefresh,
    maxDataAge,
    width,
    height,
    theme,
    showAttribution,
    getUserToken,
  }
}

let eventHandlerIndex = Date.now()
/**
 * # Chart
 *
 * Allows you to interact and embed charts into your application.
 *
 * ```js
 * const sdk = new EmbedSDK({ ... });
 * const chart = sdk.createChart({ ... });
 *
 * // renders a chart
 * chart.render(document.getElementById('embed-chart'));
 *
 * // dynamically set a filter
 * chart.setFilter({ age: { $gt: 50 } });
 * ```
 */

class Chart {
  /** @ignore */

  /** @ignore */
  constructor(options) {
    _defineProperty(this, 'iframe', void 0)

    _defineProperty(this, 'options', void 0)

    _defineProperty(this, 'connection', void 0)

    _defineProperty(this, 'eventHandlers', {
      click: {}, // refresh: {} To be added soon
    })

    this.options = getChartOptions(options)
  }

  _send(eventName, ...payload) {
    if (this.connection) {
      return this.connection.sendAndReceive(eventName, ...payload)
    }

    return Promise.reject(
      'Chart has not been rendered. Ensure that you wait for the promise returned by `chart.render()` before trying to manipulate a chart.'
    )
  }

  async setToken(token) {
    await this._send('set', 'token', token)
  }

  async retrieveAndSetToken() {
    if (this.options.getUserToken) {
      const token = await this.options.getUserToken()
      this.setToken(token)
    }
  }
  /**
   * Triggers a refresh of the chart (if it has been embedded).
   *
   * @returns a promise that resolves once the chart updated its data
   */

  async refresh() {
    await this._send('refresh')
  }
  /**
   * @returns the number of seconds a chart will wait before refreshing
   */

  async getRefreshInterval() {
    const [result] = await this._send('get', 'autorefresh')
    return typeof result === 'number'
      ? result
      : Promise.reject('unexpected response received from iframe')
  }
  /**
   * Set the number of seconds a chart will wait before refreshing.
   *
   * The minimum refresh interval is 10 seconds. To disable, set the refresh interval to 0.
   */

  async setRefreshInterval(value) {
    if (typeof value !== 'number') {
      return Promise.reject('refreshInterval property value should be a number')
    }

    await this._send('set', 'autorefresh', value)
  }
  /**
   * @returns the number of seconds before a chart's data expires
   */

  async getMaxDataAge() {
    const [result] = await this._send('get', 'maxDataAge')
    return typeof result === 'number'
      ? result
      : Promise.reject('unexpected response received from iframe')
  }
  /**
   * Set the number of seconds a chart's data expires.
   */

  async setMaxDataAge(value) {
    if (typeof value !== 'number') {
      return Promise.reject('maxDataAge property value should be a number')
    }

    await this._send('set', 'maxDataAge', value)
  }
  /**
   * @returns whether auto refreshing is enabled
   */

  async isAutoRefresh() {
    const [result] = await this._send('get', 'autorefresh')
    return typeof result === 'number' || typeof result === 'boolean'
      ? Boolean(result)
      : Promise.reject('unexpected response received from iframe')
  }
  /**
   * Enable/Disable auto refreshing.
   */

  async setAutoRefresh(value) {
    if (typeof value !== 'boolean') {
      return Promise.reject('autoRefresh property value should be a boolean')
    }

    await this._send('set', 'autorefresh', value)
  }
  /**
   * @returns the current filter applied to the embedded chart.
   */

  async getFilter() {
    const [result] = await this._send('get', 'filter')
    return typeof result === 'object' && result !== null
      ? result
      : Promise.reject('unexpected response received from iframe')
  }
  /**
   * Sets the filter to apply to the embedded chart.
   *
   * This expects an object that contains a valid [query operators](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors).
   * Any fields referenced in this filter are expected to be whitelisted in the "Embed Chart" dialog for each Chart you wish to filter on.
   */

  async setFilter(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return Promise.reject('filter property value should be an object')
    }

    await this._send(
      'set',
      'filter',
      bson.EJSON.stringify(value, {
        relaxed: false,
      })
    )
  }
  /**
   * Sets the color scheme to apply to the chart.
   *
   * If the theme is set to 'dark' and you have specified a custom background color, you should ensure that your background color has appropriate contrast.
   */

  async setTheme(value) {
    if (typeof value !== 'string') {
      return Promise.reject('theme property value should be a string')
    }

    await this._send('set', 'theme', value)

    if (this.iframe) {
      this.iframe.style.backgroundColor = getBackground(
        this.options.background,
        value
      )
    }
  }
  /**
   * @returns the current theme applied to the chart
   */

  async getTheme() {
    const [result] = await this._send('get', 'theme')
    return typeof result === 'string'
      ? result
      : Promise.reject('unexpected response received from iframe')
  }
  /**
   * Sets an event listener
   * @param event - the event you are subscribing to
   * @param eventHandler - the callback to be executed when the event is triggered
   * @param options - optional options object, can be used to customise when handler is called
   */

  addEventListener(event, eventHandler, options) {
    var _h$options$includes

    const handlers = this.eventHandlers[event]

    if (!handlers) {
      throw new Error(`Not supported event: ${event}`)
    }

    const h = {
      handle: eventHandler,
      options: {
        includes:
          options === null || options === void 0 ? void 0 : options.includes,
      },
    }

    if (
      (_h$options$includes = h.options.includes) !== null &&
      _h$options$includes !== void 0 &&
      _h$options$includes.every((f) => _isEmpty(f))
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        'Empty includes filters out all events. Event handler will never be called. Is this intended?'
      )
    } // ignore if same handler and options have been added already

    if (!Object.keys(handlers).some((id) => _isEqual(handlers[id], h))) {
      const handlerId = (++eventHandlerIndex).toString(36)
      handlers[handlerId] = h
      return this._send('eventHandler', event, handlerId, h.options)
    }

    return Promise.resolve()
  }
  /**
   * Removes an event listener
   * @param event - the event you are unsubscribing from
   * @param eventHandler - the event listener function you are unsubscribing from
   * @param options - optional options object used when addEventListener
   */

  removeEventListener(event, eventHandler, options) {
    const handlers = this.eventHandlers[event]

    if (!handlers) {
      throw new Error(`Not supported event: ${event}`)
    }

    const h = {
      handle: eventHandler,
      options: {
        includes:
          options === null || options === void 0 ? void 0 : options.includes,
      },
    }
    const handlerId = Object.keys(handlers).find((id) =>
      _isEqual(handlers[id], h)
    )

    if (handlerId) {
      delete handlers[handlerId]
      return this._send('eventHandler', event, handlerId)
    }

    return Promise.resolve()
  }
  /**
   * Renders a chart into the given `container`.
   *
   * This method should only be called once, and successive attempts to call `render`
   * will fail with an error.
   *
   * @returns a promise that will resolve once the chart has successfully been embedded
   */

  async render(container) {
    if (this.iframe) {
      throw new Error('A chart can only be rendered into a container once')
    }

    if (!(container instanceof HTMLElement)) {
      throw new Error('Target container must be a HTML element')
    } // Remove any existing nodes in our target container

    while (container.firstChild) container.removeChild(container.firstChild)

    const chartUrl = getChartUrl(this.options) // Create styled container

    const embedRoot = createElement('div', {
      style: {
        position: 'relative',
        overflow: 'hidden',
        width: parseCSSMeasurement(this.options.width) || '100%',
        height: parseCSSMeasurement(this.options.height) || '100%',
        minHeight: Boolean(this.options.height) ? 0 : '15px',
        backgroundColor: getBackground(
          this.options.background,
          this.options.theme
        ),
      },
    }) // Create iframe

    const host = chatty.Chatty.createHost(chartUrl)
      .withSandboxAttribute('allow-scripts')
      .withSandboxAttribute('allow-same-origin')
      .withSandboxAttribute('allow-popups')
      .withSandboxAttribute('allow-popups-to-escape-sandbox')
      .appendTo(embedRoot)
      .on('refreshToken', () => this.retrieveAndSetToken())
      .on('event', (event, payload, handlerIds) => {
        const handlers = this.eventHandlers[event]

        for (const id of handlerIds) {
          try {
            var _handlers$id

              // since communication between host and SDK is asyc,
              // it's possible that some handlers have been removed;
              // thus needs to check if handler still exists before calling
            ;(_handlers$id = handlers[id]) === null || _handlers$id === void 0
              ? void 0
              : _handlers$id.handle(payload)
          } catch (error) {
            console.warn(`Error calling handler for event [${event}]: ${error}`)
          }
        }
      })
      .build() // Customise IFrame styles

    Object.assign(host.iframe.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 0,
    })
    container.appendChild(embedRoot)
    this.iframe = host.iframe
    const connection = await host.connect()
    this.connection = connection
    await this.retrieveAndSetToken() // ready to render chart

    await this._send('ready')
  }
}
/**
 * Creates an instance of the embedding SDK
 */

class EmbedSDK {
  /**
   * Accepts an optional {@link EmbedChartOptions} object to use as the
   * default options for any charts created using this SDK instance.
   *
   * ```js
   * const sdk = new EmbedSDK({
   *   baseUrl: "https://charts.mongodb.com",
   * })
   * ```
   */
  constructor(options) {
    _defineProperty(this, 'defaultOptions', void 0)

    this.defaultOptions = options
  }
  /**
   * Creates a new {@link Chart} instance that allows you to
   * interact with and embed charts into your application
   */

  createChart(options) {
    return new Chart({ ...this.defaultOptions, ...options })
  }
}

exports.default = EmbedSDK
exports.getRealmUserToken = getRealmUserToken
