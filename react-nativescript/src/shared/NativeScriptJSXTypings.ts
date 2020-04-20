import { ReactNode, ClassAttributes } from "react";
import { Observable } from "@nativescript/core";

export interface NativeScriptAttributes<T extends Observable = Observable> extends ClassAttributes<T> {
    children?: ReactNode;
}
export type NativeScriptProps<P, T extends Observable = Observable> = NativeScriptAttributes<T> & P;