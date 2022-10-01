/**
 * Code in here referenced from:
 * https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMHostConfig.js
 * https://github.com/facebook/react/blob/6a1e6b2f78da3a56aa497902951c6e9ce654eafc/packages/react-native-renderer/src/ReactNativeHostConfig.js
 * ... which both carry the following copyright:
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// import ReactReconciler = require('react-reconciler');
import * as ReactReconciler from "react-reconciler";
import * as scheduler from "scheduler";
import { isKnownView } from "../nativescript-vue-next/runtime/registry";
import { precacheFiberNode, updateFiberProps } from "./ComponentTree";
import { diffProperties, updateProperties, setInitialProperties } from "./ReactNativeScriptComponent";
import * as console from "../shared/Logger";
import {
    HostContext,
    Instance,
    Type,
    Props,
    Container,
    TextInstance,
    HydratableInstance,
    PublicInstance,
} from "../shared/HostConfigTypes";
import { NSVElement, NSVText, NSVRoot } from "../nativescript-vue-next/runtime/nodes";

type UpdatePayload = {
    hostContext: HostContext;
    updates: Array<any>;
};
type ChildSet = any;
type TimeoutHandle = number; // Actually strictly should be Node-style timeout
type NoTimeout = any;
const noTimeoutValue: NoTimeout = undefined;

// https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc
const hostConfig: ReactReconciler.HostConfig<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout
> = {
    //https://github.com/sencha/ext-react/issues/306#issuecomment-521906095

    scheduleDeferredCallback: scheduler.unstable_scheduleCallback,
    cancelDeferredCallback: scheduler.unstable_cancelCallback,

    // @ts-ignore not in typings
    schedulePassiveEffects: scheduler.unstable_scheduleCallback,
    cancelPassiveEffects: scheduler.unstable_cancelCallback,

    // @ts-ignore not in typings
    shouldYield: scheduler.unstable_shouldYield,
    now: scheduler.unstable_now,
    getPublicInstance(instance: Instance | TextInstance): PublicInstance {
        // TODO (this was a complete guess).
        return instance;
    },
    getRootHostContext(rootContainerInstance: Container): HostContext {
        return {
            isInAParentText: false,
            isInAParentSpan: false,
            isInAParentFormattedString: false,
            isInADockLayout: false,
            isInAGridLayout: false,
            isInAnAbsoluteLayout: false,
            isInAFlexboxLayout: false,
        };
    },
    getChildHostContext(parentHostContext: HostContext, type: Type, rootContainerInstance: Container): HostContext {
        /*
         * Given the following, wrapped in a Page: 
            <RCTFlexboxLayout flexDirection={"row"}>
                <RCTLabel text={"LABEL"}/>
                <RCTButton text={"BUTTON"}/>
            </RCTFlexboxLayout>
         * 
         * 'type' evidently refers to the type of the child:
         * 
         * When type 'flexboxLayout' passes into here, it will have parentHostContext.isInAFlexboxLayout: false.
         * We return a HostContext with `"isInAFlexboxLayout": true`.
         * 
         * When type 'label' or 'button' passes into here, they will then find that
         * parentHostContext.isInAFlexboxLayout === true.
         */
        // console.log(`[getChildHostContext] type: ${type}`);
        const prevIsInAParentText: boolean = parentHostContext.isInAParentText;
        const prevIsInAParentSpan: boolean = parentHostContext.isInAParentSpan;
        const prevIsInAParentFormattedString: boolean = parentHostContext.isInAParentFormattedString;
        const prevIsInADockLayout: boolean = parentHostContext.isInADockLayout;
        const prevIsInAnAbsoluteLayout: boolean = parentHostContext.isInAnAbsoluteLayout;
        const prevIsInAFlexboxLayout: boolean = parentHostContext.isInAFlexboxLayout;

        /**
         * TODO: as the Host Config only exposes the parent type, rather than the actual instance of the parent, we can't support adding text nodes as children
         * based on instanceof. This means that any elements extending text primitives won't inherit the text primitives' behaviour.
         *
         * We could address this by enforcing a magic string at the front of the type, but it's not ideal.
         */
        const isInAParentText: boolean =
            type === "label" || type === "textView" || type === "textField" || type === "button";
        /**
         * We'll allow Span to support text nodes despite not extending TextBase.
         * @see https://github.com/shirakaba/react-nativescript/issues/53#issuecomment-612834141
         */
        const isInAParentSpan: boolean = type === "span";
        const isInAParentFormattedString: boolean = type === "formattedString";
        const isInADockLayout: boolean = type === "dockLayout";
        const isInAGridLayout: boolean = type === "gridLayout";
        const isInAnAbsoluteLayout: boolean = type === "absoluteLayout";
        const isInAFlexboxLayout: boolean = type === "flexboxLayout";

        /* We do have the option here in future to force ancestry based on a previous ancestor
         * (e.g. if we want text styles to cascade to all ancestors). Layout props are only with
         * respect to the immediate parent, however, so no need to do anything special for those.
         *
         * Here we avoid recreating an object that happens to deep-equal parentHostContext.
         */
        if (
            prevIsInAParentText === isInAParentText &&
            prevIsInAParentSpan === isInAParentSpan &&
            prevIsInAParentFormattedString === isInAParentFormattedString &&
            prevIsInADockLayout === isInADockLayout &&
            prevIsInADockLayout === isInAGridLayout &&
            prevIsInAnAbsoluteLayout === isInAnAbsoluteLayout &&
            prevIsInAFlexboxLayout === isInAFlexboxLayout
        ) {
            return parentHostContext;
        } else {
            return {
                isInAParentText,
                isInAParentSpan,
                isInAParentFormattedString,
                isInADockLayout,
                isInAGridLayout,
                isInAnAbsoluteLayout,
                isInAFlexboxLayout,
            };
        }
    },
    /**
     * This function is called when we have made a in-memory render tree of all the views (Remember we are yet to attach it the the actual root dom node).
     * Here we can do any preparation that needs to be done on the rootContainer before attaching the in memory render tree.
     * For example: In the case of react-dom, it keeps track of all the currently focused elements, disabled events temporarily, etc.
     * @param rootContainerInstance - root dom node you specify while calling render. This is most commonly <div id="root"></div>
     */
    prepareForCommit(rootContainerInstance: Container): void {
        // TODO
    },
    /**
     * This function gets executed after the inmemory tree has been attached to the root dom element. Here we can do any post attach operations that needs to be done.
     *  For example: react-dom re-enabled events which were temporarily disabled in prepareForCommit and refocuses elements, etc.
     * @param rootContainerInstance - root dom node you specify while calling render. This is most commonly <div id="root"></div>
     */
    resetAfterCommit(rootContainerInstance: Container): void {
        // TODO
    },
    // TODO: replace parts of this with updateDOMProperties() where applicable
    createInstance(
        type: Type,
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
        internalInstanceHandle: ReactReconciler.OpaqueHandle
    ): Instance {
        // if(type === "page" || type === "frame"){
        //     (() => {
        //         const { children, ...rest } = props;
        //         console.log(`[createInstance() 1a] type: ${type}. props:`, {
        //             ...rest,
        //         });
        //     })();
        //     console.log(`[createInstance() 1b] type: ${type}`);
        // }

        let view: Instance;

        // const viewConstructor: InstanceCreator | null = typeof type === "string" ? elementMap[type] : null;
        if (typeof type === "string" && isKnownView(type)) {
            view = new NSVElement(type);
            precacheFiberNode(internalInstanceHandle, view);
            updateFiberProps(view, props);
        } else {
            if (typeof type === "undefined") {
                throw new Error(`HostConfig received undefined type in createInstance.`);
            }
            console.log(
                `Type not found in element registry, so must be custom instance; recursing until we get a type in the element registry.`
            );
            const componentFunction: React.Component<Props, {}> = new (type as any)(props);
            const createdElement = componentFunction.render() as React.ReactElement<
                Props,
                React.JSXElementConstructor<any> | string
            >;

            return hostConfig.createInstance(
                createdElement.type,
                createdElement.props,
                rootContainerInstance,
                hostContext,
                internalInstanceHandle
            );
        }

        /* finalizeInitialChildren() > setInitialProperties() shall handle props, just as in React DOM. */

        return view;
    },
    appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {
        // console.log(`[appendInitialChild()] ${parentInstance.nativeView} > ${(child as Instance).nativeView || `"` + (child as TextInstance).text + `"`}`);
        hostConfig.appendChild(parentInstance, child);
    },
    /**
     * Docs from: https://blog.atulr.com/react-custom-renderer-2/
     * @param parentInstance - the DOM element after appendInitialChild()
     * @param type - the type of Fiber, e.g. "div"
     * @param props - the props to be passed to the host Element.
     * @param rootContainerInstance - root dom node you specify while calling render. This is most commonly <div id="root"></div>
     * @param hostContext - contains the context from the parent node enclosing this node. This is the return value from getChildHostContext of the parent node.
     * @returns A boolean value which decides if commitMount() for this element needs to be called.
     */
    finalizeInitialChildren(
        parentInstance: Instance,
        type: Type,
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext
    ): boolean {
        // console.log(`finalizeInitialChildren() with parentInstance type: ${type}`, parentInstance);
        setInitialProperties(parentInstance, type, props, rootContainerInstance, hostContext);

        return false;
    },
    shouldSetTextContent(type: Type, props: Props): boolean {
        return typeof props.children === "string" || typeof props.children === "number";
    },
    /**
     * This function is used to deprioritize rendering of some subtrees. Mostly used in cases where the subtree is hidden or offscreen.
     * @param type - the DOM type of the element, e.g. "div"
     * @param props - the props to be passed to the Element.
     */
    shouldDeprioritizeSubtree(type: Type, props: Props): boolean {
        return !!props.hidden; // Purely based on React-DOM.
    },
    createTextInstance(
        text: string,
        rootContainerInstance: Container,
        hostContext: HostContext,
        internalInstanceHandle: ReactReconciler.OpaqueHandle
    ): TextInstance {
        console.log(`[createTextInstance] with text: "${text}"`);
        if (!hostContext.isInAParentText && !hostContext.isInAParentSpan) {
            throw new Error(
                `React NativeScript's Host Config only supports rendering text nodes as direct children of one of the primitives ["label", "textView", "textField", "button", "span"]. Please use the 'text' property for setting text on this element instead.`
            );
        }

        const textNode = new NSVText(text);
        /**
         * I'm not too sure what precacheFiberNode does, but I think it sets a bunch of attributes on the node.
         * As NSVText never implemented node.setAttribute() in the first place, this line of code (now commented
         * out) could only ever have led to a crash before. So I'm now omitting it.
         *
         * In any case, I guess in normal usage, developers don't end up going down this path, maybe because of
         * the above guard.
         */
        // precacheFiberNode(internalInstanceHandle, textNode as Instance);

        return textNode;
    },
    // scheduleDeferredCallback(callback: () => any, options?: { timeout: number }): any {
    //     // TODO: check whether default timeout should be 0.
    //     if (!options) options = { timeout: 0 };

    //     return setTimeout(callback, options.timeout);
    // },
    // cancelDeferredCallback(callbackID: any): void {
    //     clearTimeout(callbackID);
    // },
    setTimeout(handler: (...args: any[]) => void, timeout: number): TimeoutHandle | NoTimeout {
        return setTimeout(handler, timeout);
    },
    clearTimeout(handle: TimeoutHandle | NoTimeout): void {
        clearTimeout(handle);
    },
    noTimeout: noTimeoutValue,
    // now: Date.now,
    isPrimaryRenderer: true,
    supportsMutation: true, // TODO
    supportsPersistence: false,
    supportsHydration: false,

    /* Mutation (optional) */
    appendChild(parentInstance: Instance, child: Instance | TextInstance): void {
        // console.log(`[appendChild()] ${parentInstance} > ${child}`);
        if (parentInstance === null) {
            console.warn(
                `[appendChild()] parent is null (this is a typical occurrence when rendering a child into a detached tree); shall no-op here: ${parentInstance} > ${child}`
            );
            return;
        }

        parentInstance.appendChild(child);
    },
    appendChildToContainer(container: Container, child: Instance | TextInstance): void {
        if (container instanceof NSVRoot) {
            console.log(`[appendChildToContainer()] deferring to appendChild(): ${container} > ${child}`);
            container.setBaseRef(child);
            return;
        }

        console.log(`[appendChildToContainer()] proceeding: ${container} > ${child}`);
        container.appendChild(child);
    },
    commitTextUpdate(textInstance: TextInstance, oldText: string, newText: string): void {
        console.log(`[commitTextUpdate()]`, textInstance);
        textInstance.text = newText;
    },
    /**
     * From: https://blog.atulr.com/react-custom-renderer-2/
     * This function is called for every element that has set the return value of finalizeInitialChildren() to true. This method is called after all the steps are done (ie after resetAfterCommit), meaning the entire tree has been attached to the dom.
     * This method is mainly used in react-dom for implementing autofocus. This method exists in react-dom only and not in react-native.
     * @param instance
     * @param type
     * @param newProps
     * @param internalInstanceHandle
     */
    commitMount(
        instance: Instance,
        type: Type,
        newProps: Props,
        internalInstanceHandle: ReactReconciler.OpaqueHandle
    ): void {
        console.log(`commitMount() with type: ${type}`, instance);
        // (instance as View).focus();
    },
    /**
     * From: https://blog.atulr.com/react-custom-renderer-3/
     * Expanded on in: https://hackernoon.com/learn-you-some-custom-react-renderers-aed7164a4199
     * @param instance - the current DOM instance of the Node.
     * @param type - the type of fiber, e.g. "div".
     * @param oldProps - props before this update.
     * @param newProps - incoming props.
     * @param rootContainerInstance - root dom node you specify while calling render. This is most commonly <div id="root"></div>
     * @param hostContext - contains the context from the parent node enclosing this node. This is the return value from getChildHostContext of the parent node.
     * @returns This function should return a payload object. Payload is a Javascript object that can contain information on what needs to be changed on this host element.
     */
    prepareUpdate(
        instance: Instance,
        type: Type,
        oldProps: Props,
        newProps: Props,
        rootContainerInstance: Container,
        hostContext: HostContext
    ): null | UpdatePayload {
        // console.log(`prepareUpdate() with type: ${type}`, instance);

        // if ((globalThis as any).__DEV__) {
        //     const hostContextDev: HostContextDev = hostContext as HostContextDev;
        //     if (
        //         typeof newProps.children !== typeof oldProps.children &&
        //         (typeof newProps.children === 'string' ||
        //             typeof newProps.children === 'number')
        //     ) {
        //         const str: string = '' + newProps.children;
        //         const ownAncestorInfo = updatedAncestorInfo(
        //             hostContextDev.ancestorInfo,
        //             type as string,
        //         );
        //         validateDOMNesting(null, str, ownAncestorInfo);
        //     }
        // }

        // (()=>{
        //     const { children, ...rest } = oldProps;
        //     console.log(`About to run diffProperties on ${instance}. oldProps:`, { ...rest });
        // })();
        // (()=>{
        //     const { children, ...rest } = newProps;
        //     console.log(`About to run diffProperties on ${instance}. newProps:`, { ...rest });
        // })();

        const diffed: null | UpdatePayload["updates"] = diffProperties(
            instance,
            type,
            oldProps,
            newProps,
            rootContainerInstance
        );

        // console.log(`[prepareUpdate] for ${instance}, diffed:`, diffed);

        return diffed === null
            ? null
            : {
                  hostContext,
                  updates: diffed,
              };

        // return {}; // Simply return a non-null value to permit commitUpdate();
        // return null;
    },
    commitUpdate(
        instance: Instance,
        updatePayload: UpdatePayload,
        type: Type,
        oldProps: Props,
        newProps: Props,
        internalInstanceHandle: ReactReconciler.OpaqueHandle
    ): void {
        // console.log(`commitUpdate() with type: ${type}`, instance);

        // Update the props handle so that we know which props are the ones with
        // with current event handlers.
        updateFiberProps(instance, newProps);

        // Apply the diff to the DOM node.
        updateProperties(instance, updatePayload.updates, type, oldProps, newProps, updatePayload.hostContext);
    },
    insertBefore(parentInstance: Instance, child: Instance | TextInstance, beforeChild: Instance | TextInstance): void {
        console.log(`[HostConfig.insertBefore] ${parentInstance} > ${child} beforeChild ${beforeChild}`);

        parentInstance.insertBefore(child, beforeChild);
    },
    /**
     * From: https://blog.atulr.com/react-custom-renderer-3/
     * This function is called whenever an element needs to insertedBefore the top most level component (Root component) itself.
     * @param container - the root container node to which a the child node needs to be inserted.
     * @param child - the dom node that needs to be inserted.
     * @param beforeChild - the child node before which the new child node needs to be inserted.
     */
    insertInContainerBefore(
        container: Container,
        child: Instance | TextInstance,
        beforeChild: Instance | TextInstance
    ): void {
        if (container instanceof NSVRoot) {
            console.log(
                `[insertInContainerBefore()] performing no-op for insertBefore(): ${container} > ${child} beforeChild ${beforeChild}`
            );
            container.setBaseRef(child); // Unsure what else to do here..!
            return;
        }

        console.log(
            `[insertInContainerBefore()] performing insertBefore(): ${container} > ${child} beforeChild ${beforeChild}`
        );
        container.insertBefore(child, beforeChild);
    },
    removeChild(parent: Instance, child: Instance | TextInstance): void {
        if (parent === null) {
            // TODO: consult React expert here!
            console.warn(
                `[removeChild()] parent is null (this is a typical occurrence when unmounting a Portal that was rendered into a null parent); shall no-op here, but totally unsure whether this leaks memory: ${parent} x ${child}`
            );
            return;
        }

        parent.removeChild(child);
    },
    removeChildFromContainer(container: Container, child: Instance | TextInstance): void {
        if (container instanceof NSVRoot) {
            container.setBaseRef(null);
            return;
        }

        console.log(`[removeChildFromContainer()] performing removeChild(): ${container} > ${child}`);
        container.removeChild(child);
    },
    resetTextContent(instance: Instance): void {
        instance.text = "";
    },
};

export const reactReconcilerInst = ReactReconciler<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout
>(hostConfig);
