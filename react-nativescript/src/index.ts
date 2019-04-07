/**
 * Code in here referenced from: https://github.com/gaearon/react/blob/1c7af862246e24574540f05c459f5fac0fad7086/src/renderers/dom/fiber/ReactDOMFiberEntry.js which carries the following copyright:
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 * 
 * They have since moved to a MIT-style licence, which is reproduced in React-LICENSE.txt.
 */

import * as ReactReconciler from 'react-reconciler';
import { reactReconcilerInst, Container } from "./client/HostConfig";
import { ReactPortal } from "react";
import { createPortal } from './client/ReactPortal';

declare global {
    var __DEV__: boolean|undefined;
}

// https://blog.atulr.com/react-custom-renderer-1/
export default {
    createPortal(
        children: ReactReconciler.ReactNodeList,
        container: Container,
        key: string|null = null,
    ): ReactPortal {
        // invariant(
        //   isValidContainer(container),
        //   'Target container is not a DOM element.',
        // );
        // TODO (from Facebook): pass ReactDOM portal implementation as third argument
        const portal = createPortal(children, container, null, key);
        // console.log(`Created portal:`, portal);
        return portal;
    },

    render: (
        reactElement: ReactReconciler.ReactNodeList, // <App />
        domElement: Container, // document.getElementById('root')
        callback: () => void|null|undefined = () => undefined // Called after the component is rendered or updated
    ) => {
        console.log("[render() 1a] Creating container from domElement", domElement);
        const container = reactReconcilerInst.createContainer(domElement, false, false);

        // console.log("[render() 1b] Created container", container);
        // console.log("[render() 1c] Created container", container._root);

        // update the root Container
        return reactReconcilerInst.updateContainer(
            reactElement,
            container,
            null,
            callback
        );
    }
};