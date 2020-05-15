import {
    TNSElements,
} from "../client/ElementRegistry";
import {
    TextBase,
    View,
    ViewBase,
    Span,
} from "@nativescript/core";
import { RNSRoot } from "../components/RNSRoot";
import { NSVText, NSVRoot, INSVElement } from "../nativescript-vue-next/runtime/nodes";

export type Type = TNSElements | React.JSXElementConstructor<any>;
export type Props = any;
export type Container = NSVRoot | INSVElement; // The root node of the app. Typically Frame, but View is more flexible.
/* Of which only LayoutBase|ContentView can take child Views (e.g. TextBase can't, but CAN take child texts; and there are special cases like ActionBar). */
export type Instance = INSVElement;
export type TextInstance = NSVText;
export type HydratableInstance = any;
export type PublicInstance = any;
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

export interface CustomNodeHierarchyManager<T extends Instance> {
    readonly __ImplementsCustomNodeHierarchyManager__: true;

    /**
     * @param parentInstance The custom node in question.
     * @param child The child to add to the custom node.
     * @return true to indicate that the operation was successfully handled;
     *         otherwise false to defer to the default Host Config implementation.
     */
    __customHostConfigAppendChild?(parentInstance: T, child: Instance | TextInstance): boolean;
    /**
     * @param parentInstance The custom node in question.
     * @param child The child to add to the custom node.
     * @return true to indicate that the operation was successfully handled;
     *         otherwise false to defer to the default Host Config implementation.
     */
    __customHostConfigRemoveChild?(parent: T, child: Instance | TextInstance): boolean;
    /**
     * @param parentInstance The custom node in question.
     * @param child The child to add to the custom node.
     * @return true to indicate that the operation was successfully handled;
     *         otherwise false to defer to the default Host Config implementation.
     */
    __customHostConfigInsertBefore?(
        parentInstance: T,
        child: Instance | TextInstance,
        beforeChild: Instance | TextInstance
    ): boolean;

    // TODO: support child host context
}
export function implementsCustomNodeHierarchyManager<T extends Instance>(
    view: Instance | CustomNodeHierarchyManager<T>
): view is CustomNodeHierarchyManager<T> {
    return (view as CustomNodeHierarchyManager<T>).__ImplementsCustomNodeHierarchyManager__ === true;
}
