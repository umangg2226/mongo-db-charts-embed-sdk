"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var _isEqual = _interopDefault(require("lodash/isEqual")), _isEmpty = _interopDefault(require("lodash/isEmpty")), bson = require("bson"), chatty = require("@looker/chatty");

function createElement(name, props = {}, children = []) {
  const element = document.createElement(name);
  for (const [name, value] of Object.entries(props)) "style" === name ? Object.assign(element.style, props.style) : element.setAttribute(name, value);
  for (const child of Array.isArray(children) ? children : [ children ]) element.append(child);
  return element;
}

const getChartUrl = options => {
  try {
    const url = new URL(options.baseUrl);
    return url.pathname = [ url.pathname, "/" === url.pathname.slice(-1) ? "" : "/", "embed/charts" ].join(""), 
    url.search = `id=${options.chartId}&sdk=2`, options.autoRefresh ? url.search += `&autorefresh=${options.autoRefresh}` : url.search += options.refreshInterval ? `&autorefresh=${options.refreshInterval}` : "", 
    void 0 !== options.maxDataAge && (url.search += `&maxDataAge=${options.maxDataAge}`), 
    url.search += options.filter ? `&filter=${encodeURIComponent(bson.EJSON.stringify(options.filter, {
      relaxed: !1
    }))}` : "", url.search += options.theme ? `&theme=${options.theme}` : "", url.search += !1 === options.showAttribution ? `&attribution=${options.showAttribution}` : "", 
    url.toString();
  } catch (e) {
    throw new Error("Base URL must be a valid URL");
  }
}, parseCSSMeasurement = value => "string" == typeof value ? value : "number" == typeof value ? `${value}px` : null, getBackground = (background, theme) => "string" == typeof background && background.length > 0 ? background : "dark" === theme ? "#21313C" : "#FFFFFF", isJWTExpired = jwt => {
  try {
    const [header, payload, signature] = jwt.split("."), {exp: exp} = JSON.parse(atob(payload));
    return Date.now() / 1e3 >= exp - 300;
  } catch (e) {
    throw new Error("Failed to parse Realm token. Is the StitchClient configured correctly?");
  }
};

async function getRealmUserToken(stitchAppClient) {
  const client = stitchAppClient;
  if (!client.auth || !client.auth.authInfo) throw new Error("Unfamiliar Stitch client version");
  if (!client.auth.isLoggedIn) throw new Error("Could not find a logged-in StitchUser. Is the StitchClient configured correctly?");
  if (!client.auth.authInfo.accessToken) throw new Error("Could not find a valid JWT. Is the StitchClient configured correctly?");
  if (isJWTExpired(client.auth.authInfo.accessToken)) if (client.auth.refreshCustomData) await client.auth.refreshCustomData(); else {
    if (!client.auth.refreshAccessToken) throw new Error("Could not refresh token. Unfamiliar Stitch client version");
    await client.auth.refreshAccessToken();
  }
  return client.auth.authInfo.accessToken;
}

function _defineProperty(obj, key, value) {
  return key in obj ? Object.defineProperty(obj, key, {
    value: value,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : obj[key] = value, obj;
}

const getChartOptions = options => {
  if ("object" != typeof options || null === options) throw new Error("Options argument must be an object");
  const {background: background, baseUrl: baseUrl, chartId: chartId, filter: filter, refreshInterval: refreshInterval, autoRefresh: autoRefresh, maxDataAge: maxDataAge, width: width, height: height, theme: theme, showAttribution: showAttribution, getUserToken: getUserToken} = options;
  if ("string" != typeof baseUrl || 0 === baseUrl.length) throw new Error("Base URL must be a valid URL");
  if ("string" != typeof chartId || 0 === chartId.length) throw new Error("Chart ID must be specified");
  if (void 0 !== width && ![ "number", "string" ].includes(typeof width)) throw new Error("Width must be a string or number if specified");
  if (void 0 !== height && ![ "number", "string" ].includes(typeof height)) throw new Error("Height must be a string or number if specified");
  if (void 0 !== filter && (!filter || "object" != typeof filter)) throw new Error("Filter must be an object if specified");
  if (void 0 !== refreshInterval && "number" != typeof refreshInterval) throw new Error("refreshInterval interval must be a number if specified");
  if (void 0 !== autoRefresh && "boolean" != typeof autoRefresh) throw new Error("autoRefresh must be a boolean if specified");
  if (void 0 !== maxDataAge && "number" != typeof maxDataAge) throw new Error("maxDataAge must be a number if specified");
  if (void 0 !== theme && "string" != typeof theme) throw new Error("Theme must be a string if specified");
  if (void 0 !== showAttribution && "boolean" != typeof showAttribution) throw new Error("Attribution must be a boolean value if specified");
  if (void 0 !== getUserToken && "function" != typeof getUserToken) throw new Error("getUserToken must be a function");
  if (void 0 !== background && "string" != typeof background) throw new Error("background must be a string if specified");
  return {
    background: background,
    baseUrl: baseUrl,
    chartId: chartId,
    filter: filter,
    refreshInterval: refreshInterval,
    autoRefresh: autoRefresh,
    maxDataAge: maxDataAge,
    width: width,
    height: height,
    theme: theme,
    showAttribution: showAttribution,
    getUserToken: getUserToken
  };
};

let eventHandlerIndex = Date.now();

class Chart {
  constructor(options) {
    _defineProperty(this, "iframe", void 0), _defineProperty(this, "options", void 0), 
    _defineProperty(this, "connection", void 0), _defineProperty(this, "eventHandlers", {
      click: {}
    }), this.options = getChartOptions(options);
  }
  _send(eventName, ...payload) {
    return this.connection ? this.connection.sendAndReceive(eventName, ...payload) : Promise.reject("Chart has not been rendered. Ensure that you wait for the promise returned by `chart.render()` before trying to manipulate a chart.");
  }
  async setToken(token) {
    await this._send("set", "token", token);
  }
  async retrieveAndSetToken() {
    if (this.options.getUserToken) {
      const token = await this.options.getUserToken();
      this.setToken(token);
    }
  }
  async refresh() {
    await this._send("refresh");
  }
  async getRefreshInterval() {
    const [result] = await this._send("get", "autorefresh");
    return "number" == typeof result ? result : Promise.reject("unexpected response received from iframe");
  }
  async setRefreshInterval(value) {
    if ("number" != typeof value) return Promise.reject("refreshInterval property value should be a number");
    await this._send("set", "autorefresh", value);
  }
  async getMaxDataAge() {
    const [result] = await this._send("get", "maxDataAge");
    return "number" == typeof result ? result : Promise.reject("unexpected response received from iframe");
  }
  async setMaxDataAge(value) {
    if ("number" != typeof value) return Promise.reject("maxDataAge property value should be a number");
    await this._send("set", "maxDataAge", value);
  }
  async isAutoRefresh() {
    const [result] = await this._send("get", "autorefresh");
    return "number" == typeof result || "boolean" == typeof result ? Boolean(result) : Promise.reject("unexpected response received from iframe");
  }
  async setAutoRefresh(value) {
    if ("boolean" != typeof value) return Promise.reject("autoRefresh property value should be a boolean");
    await this._send("set", "autorefresh", value);
  }
  async getFilter() {
    const [result] = await this._send("get", "filter");
    return "object" == typeof result && null !== result ? result : Promise.reject("unexpected response received from iframe");
  }
  async setFilter(value) {
    if ("object" != typeof value || null === value || Array.isArray(value)) return Promise.reject("filter property value should be an object");
    await this._send("set", "filter", bson.EJSON.stringify(value, {
      relaxed: !1
    }));
  }
  async setTheme(value) {
    if ("string" != typeof value) return Promise.reject("theme property value should be a string");
    await this._send("set", "theme", value), this.iframe && (this.iframe.style.backgroundColor = getBackground(this.options.background, value));
  }
  async getTheme() {
    const [result] = await this._send("get", "theme");
    return "string" == typeof result ? result : Promise.reject("unexpected response received from iframe");
  }
  addEventListener(event, eventHandler, options) {
    var _h$options$includes;
    const handlers = this.eventHandlers[event];
    if (!handlers) throw new Error(`Not supported event: ${event}`);
    const h = {
      handle: eventHandler,
      options: {
        includes: null == options ? void 0 : options.includes
      }
    };
    if (null !== (_h$options$includes = h.options.includes) && void 0 !== _h$options$includes && _h$options$includes.every(f => _isEmpty(f)) && console.warn("Empty includes filters out all events. Event handler will never be called. Is this intended?"), 
    !Object.keys(handlers).some(id => _isEqual(handlers[id], h))) {
      const handlerId = (++eventHandlerIndex).toString(36);
      return handlers[handlerId] = h, this._send("eventHandler", event, handlerId, h.options);
    }
    return Promise.resolve();
  }
  removeEventListener(event, eventHandler, options) {
    const handlers = this.eventHandlers[event];
    if (!handlers) throw new Error(`Not supported event: ${event}`);
    const h = {
      handle: eventHandler,
      options: {
        includes: null == options ? void 0 : options.includes
      }
    }, handlerId = Object.keys(handlers).find(id => _isEqual(handlers[id], h));
    return handlerId ? (delete handlers[handlerId], this._send("eventHandler", event, handlerId)) : Promise.resolve();
  }
  async render(container) {
    if (this.iframe) throw new Error("A chart can only be rendered into a container once");
    if (!(container instanceof HTMLElement)) throw new Error("Target container must be a HTML element");
    for (;container.firstChild; ) container.removeChild(container.firstChild);
    const chartUrl = getChartUrl(this.options), embedRoot = createElement("div", {
      style: {
        position: "relative",
        overflow: "hidden",
        width: parseCSSMeasurement(this.options.width) || "100%",
        height: parseCSSMeasurement(this.options.height) || "100%",
        minHeight: Boolean(this.options.height) ? 0 : "15px",
        backgroundColor: getBackground(this.options.background, this.options.theme)
      }
    }), host = chatty.Chatty.createHost(chartUrl).withSandboxAttribute("allow-scripts").withSandboxAttribute("allow-same-origin").withSandboxAttribute("allow-popups").withSandboxAttribute("allow-popups-to-escape-sandbox").appendTo(embedRoot).on("refreshToken", () => this.retrieveAndSetToken()).on("event", (event, payload, handlerIds) => {
      const handlers = this.eventHandlers[event];
      for (const id of handlerIds) try {
        var _handlers$id;
        null === (_handlers$id = handlers[id]) || void 0 === _handlers$id || _handlers$id.handle(payload);
      } catch (error) {
        console.warn(`Error calling handler for event [${event}]: ${error}`);
      }
    }).build();
    Object.assign(host.iframe.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      border: 0
    }), container.appendChild(embedRoot), this.iframe = host.iframe;
    const connection = await host.connect();
    this.connection = connection, await this.retrieveAndSetToken(), await this._send("ready");
  }
}

class EmbedSDK {
  constructor(options) {
    _defineProperty(this, "defaultOptions", void 0), this.defaultOptions = options;
  }
  createChart(options) {
    return new Chart({
      ...this.defaultOptions,
      ...options
    });
  }
}

exports.default = EmbedSDK, exports.getRealmUserToken = getRealmUserToken;
