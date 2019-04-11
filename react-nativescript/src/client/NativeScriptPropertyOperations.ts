import { Instance } from "./HostConfig";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { setValueForStyles } from "../shared/CSSPropertyOperations";
import { DockLayout } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";
import { View } from "tns-core-modules/ui/core/view/view";

/**
 * Code in here referenced from: https://github.com/facebook/react/blob/master/packages/react-dom/src/client/DOMPropertyOperations.js which carries the following copyright:
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in React-LICENSE.txt.
 */

 /**
 * TODO: much more work here. Handle styles and event listeners, for example.
 * Sets the value for a property on a node.
 *
 * @param {DOMElement} node
 * @param {string} name
 * @param {*} value
 */
export function setValueForProperty(
    instance: Instance,
    name: string,
    value: any,
    isCustomComponentTag: boolean,
) {
    // const propertyInfo = getPropertyInfo(name);
    // if (shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag)) {
    //     return;
    // }
    // if (shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag)) {
    //     value = null;
    // }
    // // If the prop isn't in the special list, treat it as a simple attribute.
    // if (isCustomComponentTag || propertyInfo === null) {
    //     if (isAttributeNameSafe(name)) {
    //         const attributeName = name;
    //         if (value === null) {
    //             instance.removeAttribute(attributeName);
    //         } else {
    //             instance.setAttribute(attributeName, '' + (value: any));
    //         }
    //     }
    //     return;
    // }
    // const {mustUseProperty} = propertyInfo;
    // if (mustUseProperty) {
    //     const {propertyName} = propertyInfo;
    //     if (value === null) {
    //         const {type} = propertyInfo;
    //         (instance: any)[propertyName] = type === BOOLEAN ? false : '';
    //     } else {
    //         // Contrary to `setAttribute`, object properties are properly
    //         // `toString`ed by IE8/9.
    //         (instance: any)[propertyName] = value;
    //     }
    //     return;
    // }
    // // The rest are treated as attributes with special cases.
    // const {attributeName, attributeNamespace} = propertyInfo;
    // if (value === null) {
    //     instance.removeAttribute(attributeName);
    // } else {
    //     const {type} = propertyInfo;
    //     let attributeValue;
    //     if (type === BOOLEAN || (type === OVERLOADED_BOOLEAN && value === true)) {
    //         attributeValue = '';
    //     } else {
    //         // `setAttribute` with objects becomes only `[object]` in IE8/9,
    //         // ('' + value) makes it output the correct toString()-value.
    //         attributeValue = '' + (value: any);
    //         if (propertyInfo.sanitizeURL) {
    //             sanitizeURL(attributeValue);
    //         }
    //     }
    //     if (attributeNamespace) {
    //         instance.setAttributeNS(attributeNamespace, attributeName, attributeValue);
    //     } else {
    //         instance.setAttribute(attributeName, attributeValue);
    //     }
    // }

    if(name === "class"){
        // console.warn(`Note that 'class' is remapped to 'className'.`);
        instance.set("className", value);
    } else if(name === "style"){
        if(typeof value === "undefined"){
            console.warn(`'style' prop was specified, but value was undefined.`);
            return;
        }
        // console.warn(`Support for setting styles is experimental.`);
        // console.log(`[createInstance()] type: ${type}. iterating style:`, value);
        setValueForStyles(instance, value);
    } else if(name === "dock"){
        DockLayout.setDock(instance as View, value);
        // Unsure how to unset Dock (does it take null?)
        // https://github.com/NativeScript/NativeScript/blob/05c2460fc4989dae4d7fa1ee52f6d54e0c3113f5/tns-core-modules/ui/layouts/dock-layout/dock-layout-common.ts
    } else {
        /* FIXME: ensure that we're only calling instance.set() for a valid View/Observable property;
         * many props, e.g. "frameRateMs", may purely be for the use of custom components. */
        instance.set(name, value);
        // TODO: should probably notify of property change, too..?
    }
}