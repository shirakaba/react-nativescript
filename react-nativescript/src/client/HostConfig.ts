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
import * as ReactReconciler from 'react-reconciler';
import { 
    ActionBar,
    TNSElements,
    elementMap,
    ConcreteViewConstructor,
    ContentView,
    GridLayout,
    LayoutBase,
    Page,
    TextBase,
    TextView,
    View,
    ViewBase,
    TabView,
    TabViewItem,
    SegmentedBar,
} from './ElementRegistry';
import { precacheFiberNode, updateFiberProps } from './ComponentTree';
import { diffProperties, updateProperties, setInitialProperties } from './ReactNativeScriptComponent';
import { validateDOMNesting, updatedAncestorInfo } from './validateDOMNesting';
import { setValueForStyles } from '../shared/CSSPropertyOperations';
import { setValueForProperty } from './NativeScriptPropertyOperations';
import { SegmentedBarItem } from 'tns-core-modules/ui/segmented-bar/segmented-bar';

export type Type = TNSElements | React.JSXElementConstructor<any>;
type Props = any;
export type Container = View; // The root node of the app. Typically Frame, but View is more flexible.
export type Instance = ViewBase; // We may extend this to Observable in future, to allow the tree to contain non-visual components. More likely ViewBase anyway?
type TextInstance = TextBase;
type HydratableInstance = any;
type PublicInstance = any;
export type HostContext = {
    isInAParentText: boolean,
    isInADockLayout: boolean,
    isInAGridLayout: boolean,
    isInAnAbsoluteLayout: boolean,
    isInAFlexboxLayout: boolean,
};
type UpdatePayload = {
    hostContext: HostContext,
    updates: Array<any>
};
type ChildSet = any;
type TimeoutHandle = number; // Actually strictly should be Node-style timeout
type NoTimeout = any;
const noTimeoutValue: NoTimeout = undefined;

function isASingleChildContainer(view: Instance): view is Page|ContentView {
    return view instanceof Page || view instanceof ContentView;
}

// function handleChildrenProp(
//     type: Type,
//     props: Props,
//     rootContainerInstance: Container,
//     hostContext: HostContext,
//     internalInstanceHandle: ReactReconciler.OpaqueHandle,
//     view: View,
//     value: any,
// ){
//     if(value === null){
//         // No children specified.
//         return;
//     }
//     if(Array.isArray(value)){
//         console.warn(`'children' value was array; support is experimental!`);
//     }

//     const valueArray: any[] = Array.isArray(value) ? value : [value];

//     valueArray.forEach((value: any) => {
//         if(hostConfig.shouldSetTextContent(type, props)){
//             if(view instanceof TextBase){
//                 // WARNING: unsure that this is how you're supposed to use HostConfig.
//                 hostConfig.commitTextUpdate(view, "", value);
//                 console.log(`[createInstance() 1e] type: ${type}. after commitTextUpdate():`, view.text);
//             } else {
//                 const tv: TextView = hostConfig.createTextInstance(value, rootContainerInstance, hostContext, internalInstanceHandle) as TextView;
    
//                 console.warn(`Support for setting textContent of a non-TextBase view is experimental.`);
//                 hostConfig.appendChild(view, tv);
//             }
//         } else {
//             if(!value){
//                 console.warn(`'children' prop's value was ${value}, so skipping.`);
//                 return;
//             }

//             // console.log(`value:`, value);
//             const prospectiveChild = value as React.ReactElement<any, string>;

//             (()=>{
//                 const { children, ...rest } = prospectiveChild.props;
//                 console.warn(`Support for nesting children is experimental. child type: ${prospectiveChild.type}. props:`, { ...rest });
//             })();
    
//             if(!prospectiveChild.type){
//                 console.warn(`The value of 'prospectiveChild.type' was ${value}, so skipping.`);
//                 return;
//             }
    
//             const instanceFromChild: ViewBase|TextBase = hostConfig.createInstance(
//                 prospectiveChild.type as Type,
//                 prospectiveChild.props,
//                 rootContainerInstance,
//                 hostContext,
//                 internalInstanceHandle
//             );
//             hostConfig.appendChild(view, instanceFromChild);
            
//             // hostConfig.appendChild(view, value);
//         }
//     });
// }

// https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc
const hostConfig: ReactReconciler.HostConfig<Type, Props, Container, Instance, TextInstance, HydratableInstance, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout> = {
    getPublicInstance(instance: Instance | TextInstance): PublicInstance {
        // TODO (this was a complete guess).
        return instance;
    },
    getRootHostContext(rootContainerInstance: Container): HostContext {
        return {
            isInAParentText: false,
            isInADockLayout: false,
            isInAGridLayout: false,
            isInAnAbsoluteLayout: false,
            isInAFlexboxLayout: false,
        };
    },
    getChildHostContext(parentHostContext: HostContext, type: Type, rootContainerInstance: Container): HostContext {
        const prevIsInAParentText: boolean = parentHostContext.isInAParentText;
        const prevIsInADockLayout: boolean = parentHostContext.isInADockLayout;
        const prevIsInAnAbsoluteLayout: boolean = parentHostContext.isInAnAbsoluteLayout;
        const prevIsInAFlexboxLayout: boolean = parentHostContext.isInAFlexboxLayout;

        const isInAParentText: boolean =
            type === 'label' ||
            type === 'textView' ||
            type === 'textField' ||
            type === 'button';
        const isInADockLayout: boolean = type === 'dockLayout';
        const isInAGridLayout: boolean = type === 'gridLayout';
        const isInAnAbsoluteLayout: boolean = type === 'absoluteLayout';
        const isInAFlexboxLayout: boolean = type === 'flexboxLayout';
      
        /* We do have the option here in future to force ancestry based on a previous ancestor
         * (e.g. if we want text styles to cascade to all ancestors). Layout props are only with
         * respect to the immediate parent, however, so no need to do anything special for those.
         *
         * Here we avoid recreating an object that happens to deep-equal parentHostContext.
         */
        if(
            prevIsInAParentText === isInAParentText
            && prevIsInADockLayout === isInADockLayout
            && prevIsInADockLayout === isInAGridLayout
            && prevIsInAnAbsoluteLayout === isInAnAbsoluteLayout
            && prevIsInAFlexboxLayout === isInAFlexboxLayout
        ){
            return parentHostContext;
        } else {
            return {
                isInAParentText,
                isInADockLayout,
                isInAGridLayout,
                isInAnAbsoluteLayout,
                isInAFlexboxLayout
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
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): Instance {
        (()=>{
            const { children, ...rest } = props;
            console.log(`[createInstance() 1a] type: ${type}. props:`, { ...rest });
        })();
        // console.log(`[createInstance() 1b] type: ${type}. rootContainerInstance:`, rootContainerInstance);

        let view: View;
        const viewConstructor: ConcreteViewConstructor|null = typeof type === "string" ? elementMap[type] : null;
        if(viewConstructor){
            if(type === 'contentView' && hostContext.isInAParentText){
                throw new Error('Nesting of <ContentView> within a TextBase is not currently supported.');
            };
            view = new viewConstructor() as View;
            precacheFiberNode(internalInstanceHandle, view);
            updateFiberProps(view, props);
        } else {
            if(typeof type === "undefined"){
                throw new Error(`HostConfig received undefined type in createInstance.`);
            }
            console.log(`Type not found in element registry, so must be custom instance; recursing until we get a type in the element registry.`);
            const componentFunction: React.Component<Props, {}> = new (type as any)(props);
            const createdElement = componentFunction.render() as React.ReactElement<Props, React.JSXElementConstructor<any> | TNSElements>;

            return hostConfig.createInstance(
                createdElement.type,
                createdElement.props,
                rootContainerInstance,
                hostContext,
                internalInstanceHandle
            );
        }

        if(hostContext.isInADockLayout && !props.dock){
            console.warn(`Components in a DockLayout should bear the 'dock' property. Undefined behaviour if they don't!`);
        }
        if(hostContext.isInAGridLayout && (typeof props.row === "undefined" || typeof props.col === "undefined")){
            console.warn(`Components in a GridLayout should bear both the 'row' and 'col' properties. Undefined behaviour if they don't!`);
        }
        if(hostContext.isInAnAbsoluteLayout && (!props.left || !props.top)){
            console.warn(`Components in a GridLayout should bear both the 'top' and 'left' properties, passed as a property rather than a style. Undefined behaviour if they don't!`);
        }

        // console.log(`[createInstance() 1c] type: ${type}. constructed:`, view);
        // Object.keys(props).forEach((prop: string) => {
        //     const value: any = props[prop];

        //     /*
        //         Note that in this situation, only <span>One</span> will be shown. Probably handled before it reaches the Host Config though:
        //           <div children={[<span>Two</span>, <span>Three</span>]}>
        //             <span>One</span>
        //         </div>
        //     */
        //     if(prop === "children"){
        //         return handleChildrenProp(
        //             type,
        //             props,
        //             rootContainerInstance,
        //             hostContext,
        //             internalInstanceHandle,
        //             view,
        //             value
        //         );
        //     } else {
        //         setValueForProperty(view, prop, value, false);
        //     }
        // });

        /* finalizeInitialChildren() > setInitialProperties() shall handle props, just as in React DOM. */

        return view;
    },
    appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {
        console.log(`[appendInitialChild()]`);
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
        hostContext: HostContext,
    ): boolean {
        console.log(`finalizeInitialChildren() with parentInstance type: ${type}`, parentInstance);
        setInitialProperties(parentInstance, type, props, rootContainerInstance, hostContext);

        return false;
    },
    shouldSetTextContent(type: Type, props: Props): boolean {
        return typeof props.children === 'string' || typeof props.children === 'number';
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
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): TextInstance {
        if(!hostContext.isInAParentText){
            throw new Error('Text strings must be rendered within a component extending <TextBase>.');
        }
        // See createInstance().

        /* Is TextView the most appropriate here? RN uses RCTRawText.
         * Alternative is TextField or Label. TextBase just a base class.
         * Medium tutorial uses: document.createTextNode(text); */
        const textView: TextView = new TextView();
        textView.text = text;
        precacheFiberNode(internalInstanceHandle, textView);

        // TODO: maybe inherit the style information from container..?
        // TODO: also merge in the hostContext (whatever that is).

        return textView;
    },
    scheduleDeferredCallback(
        callback: () => any,
        options?: { timeout: number },
    ): any {
        // TODO: check whether default timeout should be 0.
        if(!options) options = { timeout: 0 };

        return setTimeout(callback, options.timeout);
    },
    cancelDeferredCallback(callbackID: any): void {
        clearTimeout(callbackID);
    },
    setTimeout(handler: (...args: any[]) => void, timeout: number): TimeoutHandle | NoTimeout {
        return setTimeout(handler, timeout);
    },
    clearTimeout(handle: TimeoutHandle | NoTimeout): void {
        clearTimeout(handle);
    },
    noTimeout: noTimeoutValue,
    now: Date.now,
    isPrimaryRenderer: true,
    supportsMutation: true, // TODO
    supportsPersistence: false,
    supportsHydration: false,

    /* Mutation (optional) */
    appendChild(parentInstance: Instance, child: Instance | TextInstance): void {
        if(child instanceof Page){
            console.warn(`[appendChild()] Page cannot be appended as a child. Not appending to ${parentInstance}.`);
            return;
        }
        if(child instanceof ActionBar){
            console.log(`[appendChild()] (child is ActionBar) ${parentInstance} > ${child}`);
            if(parentInstance instanceof Page){
                parentInstance.actionBar = child;
            } else {
                if(parentInstance.page){
                    parentInstance.page.actionBar = child;
                }
            }
            return;
        }

        // console.log(`[appendChild()] child's page was: `, child.page);
        // console.log(`[appendChild()] parent's page was: `, parentInstance.page);
        if(isASingleChildContainer(parentInstance)){
            console.log(`[appendChild()] (single-child container) ${parentInstance} > ${child}`);
            /* These elements were originally designed to hold one element only:
             * https://stackoverflow.com/a/55351086/5951226 */

            parentInstance.content = child as View;
        } else if(parentInstance instanceof LayoutBase){
            console.log(`[appendChild()] (instance of LayoutBase) ${parentInstance} > ${child}`);
            parentInstance.addChild(child as View);
        } else if(parentInstance instanceof SegmentedBar && child instanceof SegmentedBarItem){
            // console.log(`[appendChild()] Remapping SegmentedBarItem from child to item: ${parentInstance} > ${child}, where its view was ${child.view} and its items were:`, parentInstance.items);
            const newItems = [...(parentInstance.items || []), child];
            parentInstance.items = newItems;
        } else if(parentInstance instanceof TabView && child instanceof TabViewItem){
            console.log(`[appendChild()] Remapping TabViewItem from child to item: ${parentInstance} > ${child}, where its view was ${child.view} and its items were:`, parentInstance.items);
            /* We must go through the setter rather than simply mutate the existing array. */
            const newItems = [...(parentInstance.items || []), child];
            parentInstance.items = newItems;
            console.log(`[appendChild()] parentInstance.items now updated to:`, parentInstance.items);
        } else {
            console.log(`[appendChild()] (default clause) ${parentInstance} > ${child}`);
            parentInstance._addView(child);
        }
        // TODO: check whether a property/event change should be fired. 
    },
    appendChildToContainer(container: Container, child: Instance | TextInstance): void {
        // console.log(`[appendChildToContainer()] deferring to appendChild(): ${container} > ${child}`);
        hostConfig.appendChild(container, child);
        // TODO: check whether a property/event change should be fired.
    },
    commitTextUpdate(textInstance: TextInstance, oldText: string, newText: string): void {
        console.log(`[commitTextUpdate()]`, textInstance);
        textInstance.text = newText;
        // e.g.: https://github.com/NativeScript/NativeScript/blob/master/tns-core-modules/data/observable/observable.ts#L53
        textInstance.notifyPropertyChange("text", newText, oldText);
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
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): void {
        console.log(`commitMount() with type: ${type}`, instance);
        (instance as View).focus();
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
        hostContext: HostContext,
    ): null | UpdatePayload {
        // console.log(`prepareUpdate() with type: ${type}`, instance);

        // if ((global as any).__DEV__) {
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
            rootContainerInstance,
        );

        // console.log(`[prepareUpdate] for ${instance}, diffed:`, diffed);

        return diffed === null ? null : {
            hostContext,
            updates: diffed
        }

        // return {}; // Simply return a non-null value to permit commitUpdate();
        // return null;
    },
    commitUpdate(
        instance: Instance,
        updatePayload: UpdatePayload,
        type: Type,
        oldProps: Props,
        newProps: Props,
        internalInstanceHandle: ReactReconciler.OpaqueHandle,
    ): void {
        // console.log(`commitUpdate() with type: ${type}`, instance);

        // Update the props handle so that we know which props are the ones with
        // with current event handlers.
        updateFiberProps(instance, newProps);

        // Apply the diff to the DOM node.
        updateProperties(instance, updatePayload.updates, type, oldProps, newProps, updatePayload.hostContext);
    },
    insertBefore(parentInstance: Instance, child: Instance | TextInstance, beforeChild: Instance | TextInstance): void {
        /* TODO: implement this for GridLayout, if feeling brave! An example use case (and test case) would help. */
        if(parentInstance instanceof GridLayout){
            console.warn(`HostConfig.insertBefore() not implemented for GridLayout!`);
            // addChildAtCell(view: View, row: number, column: number, rowSpan?: number, columnSpan?: number): void;
        }

        // TODO: Refer to {N}Vue's implementation: https://github.com/nativescript-vue/nativescript-vue/blob/master/platform/nativescript/renderer/ViewNode.js#L157
        let beforeChildIndex: number = 0;
        parentInstance.eachChild((viewBase: ViewBase) => {
            if(viewBase === beforeChild){
                return false;
            } else {
                beforeChildIndex++;
                return true;
            }
        });
        // NOTE: Untested. Potentially has an off-by-one error.
        // TODO: fire child._parentChanged()?
        parentInstance._addView(child, beforeChildIndex);
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
        beforeChild: Instance | TextInstance,
    ): void {
        if(container instanceof Page || container instanceof ContentView){
            console.warn(`[insertInContainerBefore] not supported because Page/ContentView only support a single child.`);
        } else {
            let beforeChildIndex: number = 0;
            container.eachChild((viewBase: ViewBase) => {
                if(viewBase === beforeChild){
                    return false;
                } else {
                    beforeChildIndex++;
                    return true;
                }
            });
            // NOTE: Untested. Potentially has an off-by-one error.
            container._addView(child, beforeChildIndex);
        }
    },
    removeChild(parentInstance: Instance, child: Instance | TextInstance): void {
        if(child instanceof ActionBar && parentInstance instanceof Page){
            // FIXME: determine the best way to implement this for ActionBar. Will have to figure out potential scenarios.
            // parentInstance.actionBar = null;
        if(parentInstance instanceof TabView && child instanceof TabViewItem){
                if(!parentInstance.items){
                    parentInstance.items = [];
                }
                // TODO: remove from array without creating new one.
                parentInstance.items = parentInstance.items.filter(i => i !== child);
            }
         } else {
            parentInstance._removeView(child);
            // TODO: check whether a property/event change should be fired.
         }
    },
    removeChildFromContainer(container: Container, child: Instance | TextInstance): void {
        if(isASingleChildContainer(container)){
            console.log(`[removeChild()] instance of single-child container: ${container} x ${child}`);
            /* These elements were originally designed to hold one element only:
             * https://stackoverflow.com/a/55351086/5951226 */
             // console.warn(`[removeChild()] TODO: Check whether "container.content = null" will indeed remove the content.`);
            container.content = null;
        } else if(container instanceof LayoutBase){
            console.log(`[removeChild()] instance of LayoutBase: ${container} x ${child}`);
            container.removeChild(child as View);
        } else {
            console.log(`[removeChild()] default clause.`);
            container._removeView(child);
        }
        // TODO: check whether a property/event change should be fired.
    },
    resetTextContent(instance: Instance): void {
        if(instance instanceof TextBase){
            const oldText: string = instance.text;
            instance.text = "";
            instance.notifyPropertyChange("text", "", oldText);
        } else {
            console.warn(`resetTextContent() stub called on a non-TextBase View. Text-resetting is only implemented for instances extending TextBase.`);
        }
    },
}

export const reactReconcilerInst = ReactReconciler<Type, Props, Container, Instance, TextInstance, HydratableInstance, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout>(hostConfig);