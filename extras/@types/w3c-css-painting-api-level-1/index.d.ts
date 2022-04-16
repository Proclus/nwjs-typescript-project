
interface CSSPropertyArgs {
    [key:string]:string|number|boolean;
}

declare namespace CSS {
    export const paintWorklet: Worklet;
    export function registerProperty(args: CSSPropertyArgs): void;
}


interface PaintRenderingContext2D extends CanvasState, CanvasTransform, CanvasCompositing, CanvasImageSmoothing, CanvasFillStrokeStyles, CanvasShadowStyles, CanvasRect, CanvasDrawPath, CanvasDrawImage, CanvasPathDrawingStyles, CanvasPath {

}

interface PaintSize {
    readonly width:number;
    readonly height:number;
}

interface PaintRenderingContext2DSettings {
    alpha:boolean;
}

// interface CSSPaintWorkletCallback {
//     (ctx:PaintRenderingContext2D, size:PaintSize, styleMap:StylePropertyMapReadOnly):void
// }


 // interface CSSIPaintWorklet {
 //     paint(ctx:PaintRenderingContext2D, size:PaintSize, styleMap:StylePropertyMapReadOnly);
 // }


interface CSSPaintWorklet {
    paint(ctx:PaintRenderingContext2D, size: PaintSize, styleMap: StylePropertyMapReadOnly, args: any[]):void;
}

interface CSSPaintWorkletConstructor {
    new(): CSSPaintWorklet;
}

declare var CSSPaintWorklet: {
    prototype: CSSPaintWorklet;
    new(): CSSPaintWorklet;
};

declare function registerPaint<T extends CSSPaintWorkletConstructor> (name: string, painterCtor: T): void;
