/**
 * Code in here referenced from: https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/client/ReactDOMComponentTree.js which carries the following copyright:
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in /LICENSE.
 */
import * as ReactReconciler from "react-reconciler";
import { Container, Instance } from "../shared/HostConfigTypes";

const internalInstanceKey = Symbol("__reactFiber$");
const internalContainerInstanceKey = Symbol("__reactContainer$");
const internalEventHandlersKey = Symbol("__reactEventHandlers$");

export function precacheFiberNode(hostInst: ReactReconciler.OpaqueHandle, node: object): void {
    node[internalInstanceKey] = hostInst;
}

export function getInternalInstance(node: object): ReactReconciler.OpaqueHandle | null {
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
            node = node.parentNode;
        } else {
            // Top of the tree. This node must not be part of a React tree (or is
            // unmounted, potentially).
            return null;
        }
    }

    const inst = node[internalInstanceKey] as ReactReconciler.OpaqueHandle;

    return inst;
}

/**
 * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
 * instance, or null if the node was not rendered by this React.
 */
export function getInstanceFromNode(node: Instance): ReactReconciler.OpaqueHandle {
    const inst = node[internalInstanceKey] as ReactReconciler.OpaqueHandle;
    if (inst) {
        return inst;
    }
    return null;
}

/**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */
export function getNodeFromInstance(inst: ReactReconciler.OpaqueHandle): Instance {
    return inst.stateNode;
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
