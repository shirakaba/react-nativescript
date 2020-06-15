import { ReactNode, ClassAttributes } from "react";
import { Observable, ViewBase, Style } from "@nativescript/core";
import { NSVElement } from "../nativescript-vue-next/runtime/nodes";

export type RNSStyle = {
    [P in keyof Style]?: string | Style[P];
};

export interface NativeScriptAttributes<T extends ViewBase = ViewBase> extends ClassAttributes<NSVElement<T>> {
    nodeRole?: string;
    children?: ReactNode;
    /* This is handled specially by CSSPropertyOperations; it's not a true NativeScript style */
    style?: RNSStyle;
}

export type NativeScriptProps<P, T extends ViewBase = ViewBase> = NativeScriptAttributes<T> & P;