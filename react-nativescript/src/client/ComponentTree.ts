/**
 * Code in here referenced from: https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/client/ReactDOMComponentTree.js which carries the following copyright:
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in /LICENSE.
 */
import * as ReactReconciler from "react-reconciler";
import { Container, Instance, TextInstance } from "../shared/HostConfigTypes";
import * as console from "../shared/Logger";

const internalInstanceKey = Symbol("__reactFiber$");
const internalContainerInstanceKey = Symbol("__reactContainer$");
const internalEventHandlersKey = Symbol("__reactEventHandlers$");

export function precacheFiberNode(hostInst: ReactReconciler.OpaqueHandle, node: Instance | TextInstance): void {
    node[internalInstanceKey] = hostInst;
}

export function getInternalInstance(node: Instance): ReactReconciler.OpaqueHandle | null {
    return node[internalInstanceKey] ?? null;
}

/**
 * Given a DOM node, return the closest ReactDOMComponent or
 * ReactDOMTextComponent instance ancestor.
 */
export function getClosestInstanceFromNode(node: Instance): ReactReconciler.OpaqueHandle {
    if (node[internalInstanceKey]) {
        return node[internalInstanceKey] as ReactReconciler.OpaqueHandle;
    }

    while (!node[internalInstanceKey]) {
        if (node.parentNode) {
            // if(!node.parent){
            //   console.warn(`node.parent was null; meanwhile, node.parentNode was:`, node.parentNode);
            // }
            node = node.parentNode;
        } else {
            // Top of the tree. This node must not be part of a React tree (or is
            // unmounted, potentially).
            return null;
        }
    }

    const inst = node[internalInstanceKey] as ReactReconciler.OpaqueHandle;
    // if (inst.tag === HostComponent || inst.tag === HostText) {
    // In Fiber, this will always be the deepest root.
    return inst;
    // }

    // return null;
}

/**
 * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
 * instance, or null if the node was not rendered by this React.
 */
export function getInstanceFromNode(node: Instance): ReactReconciler.OpaqueHandle {
    const inst = node[internalInstanceKey] as ReactReconciler.OpaqueHandle;
    if (inst) {
        return inst;
        // if (inst.tag === HostComponent || inst.tag === HostText) {
        //   return inst;
        // } else {
        //   return null;
        // }
    }
    return null;
}

/**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */
export function getNodeFromInstance(inst: ReactReconciler.OpaqueHandle): Instance {
    // if (inst.tag === HostComponent || inst.tag === HostText) {
    //   // In Fiber this, is just the state node right now. We assume it will be
    //   // a host component or host text.
    //   return inst.stateNode;
    // }
    return inst.stateNode;

    // Without this first invariant, passing a non-DOM-component triggers the next
    // invariant for a missing parent, which is super confusing.
    // invariant(false, 'getNodeFromInstance: Invalid argument.');
    // throw new Error('getNodeFromInstance: Invalid argument.');
}

export function getFiberCurrentPropsFromNode(node: Instance): object | null {
    return (node[internalEventHandlersKey] as object) || null;
}

export function updateFiberProps(node: Instance, props: object): void {
    node[internalEventHandlersKey] = props;
}

export function markContainerAsRoot(hostRoot: ReactReconciler.Fiber, node: Container) {
    node[internalContainerInstanceKey] = hostRoot;
}

export function unmarkContainerAsRoot(node: Container): void {
    node[internalContainerInstanceKey] = null;
}

export function getInternalContainerInstance(node: Container) {
    return node[internalContainerInstanceKey] ?? null;
}
