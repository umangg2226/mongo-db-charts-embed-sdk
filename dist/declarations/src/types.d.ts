/**
 * The set of options that you can use when both creating an {@link EmbedSDK} object or using {@link EmbedSDK.createChart}
 */
export interface EmbedChartOptions {
    /**
     * The background color to use for the chart.
     *
     * If no background is provided, it will set a default background color based on the theme.
     *
     * To control the background color using CSS and classes, set to `transparent`.
     **/
    background?: string;
    /**
     * The base url for your MongoDB Charts instance.
     *
     * This should look something like: `https://charts.mongodb.com/charts-example-url-zdvkh`
     */
    baseUrl: string;
    /**
     * The id for the chart you want to embed.
     *
     * This can be found in the "Embed Chart" dialog when viewing a chart on a dashboard.
     */
    chartId: string;
    /**
     * The filter to apply to the embedded chart.
     *
     * This expects an object that contains a valid [query operators](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors).
     * Any fields referenced in this filter are expected to be whitelisted in the "Embed Chart" dialog for each Chart you wish to filter on.
     */
    filter?: object;
    /**
     * A function that returns a valid JWT that will be used to authenticate the user.
     *
     * This function will be called when the chart is first rendered, and then successively when the SDK needs to refresh an invalid token.
     *
     * See also {@link getRealmUserToken}
     */
    getUserToken?: () => string | Promise<string>;
    /**
     * The height of the embedded chart.
     *
     * If no height is provided, it will default to stretching to the height of it's container. If a value is provided without units, it will be assumed to be pixels (px).
     */
    height?: string | number;
    /**
     * How frequently a chart should refresh once it has been embedded.
     *
     * The minimum refreshInterval is 10 seconds. By default, a chart will never refresh once rendered.
     *
     * @deprecated
     */
    refreshInterval?: number;
    /**
     * Whether the chart should be automatically refreshed.
     */
    autoRefresh?: boolean;
    /**
     * How long in seconds a chart's data is considered fresh.
     *
     * By default, staleness tolerance is 1 hour.
     */
    maxDataAge?: number;
    /**
     * Whether to show the MongoDB attribution logo on the embedded chart.
     *
     * By default, this is set to `true`
     */
    showAttribution?: boolean;
    /**
     * The color scheme to apply to the chart.
     *
     * If the theme is set to 'dark' and you have specified a custom background color, you should ensure that your background color has appropriate contrast.
     */
    theme?: string;
    /**
     * The width of the embedded chart.
     *
     * If no width is provided, it will default to stretching to the width of it's container. If a value is provided without units, it will be assumed to be pixels (px).
     */
    width?: string | number;
}
export declare type EventHandlerPayload = object;
export declare type EventHandlerOptions = {
    includes?: object[];
};
export declare type EmbedChartEvent = 'click' | 'refresh';
export declare type EventHandler = (payload: EventHandlerPayload) => void;
