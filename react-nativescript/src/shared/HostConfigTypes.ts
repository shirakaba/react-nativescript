import { NSVText, NSVRoot, INSVElement } from "../nativescript-vue-next/runtime/nodes";

export type Type = string | React.JSXElementConstructor<any>;
export type Props = any;
export type Container = NSVRoot | INSVElement; // The root node of the app. Typically Frame, but View is more flexible.
/* Of which only LayoutBase|ContentView can take child Views (e.g. TextBase can't, but CAN take child texts; and there are special cases like ActionBar). */
export type Instance = INSVElement;
export type TextInstance = NSVText;

export interface SuspenseInstance {
    state: "pending" | "complete" | "client-render";
    children: Array<Instance | TextInstance | SuspenseInstance>;
}

export type HydratableInstance = Instance | TextInstance | SuspenseInstance;
export type PublicInstance = Instance | TextInstance;
export type HostContext = {
    isInAParentText: boolean;
    isInAParentSpan: boolean;
    isInAParentFormattedString: boolean;
    isInADockLayout: boolean;
    isInAGridLayout: boolean;
    isInAnAbsoluteLayout: boolean;
    isInAFlexboxLayout: boolean;
};
export type InstanceCreator<T extends Instance = Instance> = (
    props: Props,
    rootContainerInstance: Container,
    hostContext: HostContext
) => T;
