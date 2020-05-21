import { ReactNode, ClassAttributes } from "react";
import { Observable, ViewBase, Style } from "@nativescript/core";

type RNSStyle = {
    [P in keyof Style]?: string | Style[P];
};


export interface NativeScriptAttributes<T extends Observable = Observable> extends ClassAttributes<T> {
    nodeRole?: string;
    children?: ReactNode;
}

export interface ViewBaseAttributes<T extends ViewBase = ViewBase> extends NativeScriptAttributes<T> {
    /* This is handled specially by CSSPropertyOperations; it's not a true NativeScript style */
    style?: RNSStyle;
}

export type NativeScriptProps<P, T extends ViewBase = ViewBase> = ViewBaseAttributes<T> & P;