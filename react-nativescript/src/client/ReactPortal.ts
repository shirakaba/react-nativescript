import { ReactNodeList } from "react-reconciler";
import { ReactPortal } from "react";

/**
 * Code in here referenced from: https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/shared/ReactPortal.js which carries the following copyright:
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in /LICENSE.
 */

const hasSymbol = typeof Symbol === "function" && Symbol.for;

export function createPortal(
    children: ReactNodeList,
    containerInfo: any,
    // TODO: figure out the API for cross-renderer implementation.
    implementation: any | null,
    key: string | null = null
): ReactPortal {
    return {
        // This tag allow us to uniquely identify this as a React Portal
        //@ts-ignore
        // $$typeof: (globalThis as any).REACT_PORTAL_TYPE,
        $$typeof: hasSymbol ? Symbol.for("react.portal") : 0xeaca,
        key: key == null ? null : "" + key,
        children,
        containerInfo,
        implementation,
    };
}
