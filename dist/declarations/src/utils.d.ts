import { EmbedChartOptions } from './types';
/**
 * Constructs the chart iframe URL from the baseUrl, chartId & tenantId
 */
export declare const getChartUrl: (options: EmbedChartOptions) => string;
/**
 * Returns a DOM node
 */
export declare const createEmbedDOM: (iframeSrcUrl: string) => [HTMLElement, HTMLIFrameElement];
export declare const parseCSSMeasurement: (value: unknown) => string | null;
/**
 * Returns the background after validation checks
 * or default background based on theme if not set
 */
export declare const getBackground: (background: string | undefined, theme: string | undefined) => string;
