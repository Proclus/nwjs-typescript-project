// Adding typings for constructable stylesheets
interface ShadowRoot {
    adoptedStyleSheets:Array<CSSStyleSheet>;
}

interface Document {
    adoptedStyleSheets:Array<CSSStyleSheet>;
}

interface CSSStyleSheet {
    replace(css_str:string): Promise<CSSStyleSheet>;
    replaceSync(css_str:string): void;
}
