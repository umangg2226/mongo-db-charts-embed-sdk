import type { EmbedChartOptions, EmbedChartEvent, EventHandler, EventHandlerOptions } from './types';
import { getRealmUserToken } from './realm-auth';
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
declare class Chart {
    /** @ignore */
    iframe?: HTMLIFrameElement;
    private options;
    private connection?;
    private eventHandlers;
    /** @ignore */
    constructor(options: Partial<EmbedChartOptions>);
    private _send;
    private setToken;
    private retrieveAndSetToken;
    /**
     * Triggers a refresh of the chart (if it has been embedded).
     *
     * @returns a promise that resolves once the chart updated its data
     */
    refresh(): Promise<void>;
    /**
     * @returns the number of seconds a chart will wait before refreshing
     */
    getRefreshInterval(): Promise<number>;
    /**
     * Set the number of seconds a chart will wait before refreshing.
     *
     * The minimum refresh interval is 10 seconds. To disable, set the refresh interval to 0.
     */
    setRefreshInterval(value: number): Promise<void>;
    /**
     * @returns the number of seconds before a chart's data expires
     */
    getMaxDataAge(): Promise<number>;
    /**
     * Set the number of seconds a chart's data expires.
     */
    setMaxDataAge(value: number): Promise<void>;
    /**
     * @returns whether auto refreshing is enabled
     */
    isAutoRefresh(): Promise<boolean>;
    /**
     * Enable/Disable auto refreshing.
     */
    setAutoRefresh(value: boolean): Promise<void>;
    /**
     * @returns the current filter applied to the embedded chart.
     */
    getFilter(): Promise<object>;
    /**
     * Sets the filter to apply to the embedded chart.
     *
     * This expects an object that contains a valid [query operators](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors).
     * Any fields referenced in this filter are expected to be whitelisted in the "Embed Chart" dialog for each Chart you wish to filter on.
     */
    setFilter(value: object): Promise<void>;
    /**
     * Sets the color scheme to apply to the chart.
     *
     * If the theme is set to 'dark' and you have specified a custom background color, you should ensure that your background color has appropriate contrast.
     */
    setTheme(value: string): Promise<void>;
    /**
     * @returns the current theme applied to the chart
     */
    getTheme(): Promise<string>;
    /**
     * Sets an event listener
     * @param event - the event you are subscribing to
     * @param eventHandler - the callback to be executed when the event is triggered
     * @param options - optional options object, can be used to customise when handler is called
     */
    addEventListener(event: EmbedChartEvent, eventHandler: EventHandler, options?: EventHandlerOptions): Promise<unknown>;
    /**
     * Removes an event listener
     * @param event - the event you are unsubscribing from
     * @param eventHandler - the event listener function you are unsubscribing from
     * @param options - optional options object used when addEventListener
     */
    removeEventListener(event: EmbedChartEvent, eventHandler: EventHandler, options?: EventHandlerOptions): Promise<unknown>;
    /**
     * Renders a chart into the given `container`.
     *
     * This method should only be called once, and successive attempts to call `render`
     * will fail with an error.
     *
     * @returns a promise that will resolve once the chart has successfully been embedded
     */
    render(container: HTMLElement): Promise<void>;
}
/**
 * Creates an instance of the embedding SDK
 */
export default class EmbedSDK {
    private defaultOptions;
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
    constructor(options: Partial<EmbedChartOptions>);
    /**
     * Creates a new {@link Chart} instance that allows you to
     * interact with and embed charts into your application
     */
    createChart(options: Partial<EmbedChartOptions>): Chart;
}
export { getRealmUserToken };
export type { Chart, EmbedChartOptions };
