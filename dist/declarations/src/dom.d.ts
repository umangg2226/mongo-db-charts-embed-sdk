import { Properties as CSSProperties } from 'csstype';
declare type KeysWithType<Target, Type> = {
    [P in keyof Target]: Target[P] extends Type ? P : never;
}[keyof Target];
declare type ExtractWithType<Target, Type> = Pick<Target, Extract<keyof Target, KeysWithType<Target, Type>>>;
export declare function createElement<TagName extends keyof HTMLElementTagNameMap, Element extends HTMLElementTagNameMap[TagName], ElementAttributes extends ExtractWithType<Element, string | boolean | Function | null>>(name: TagName, props?: Partial<ElementAttributes> & {
    style?: CSSProperties;
}, children?: string | HTMLElement | HTMLElement[]): Element;
export {};
