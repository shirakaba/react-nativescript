import { Instance } from "./HostConfig";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { setValueForStyles } from "../shared/CSSPropertyOperations";
import { DockLayout } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";
import { View } from "tns-core-modules/ui/core/view/view";
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { AbsoluteLayout } from "tns-core-modules/ui/layouts/absolute-layout/absolute-layout";

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
    } else if((name === "rows" || name === "columns") && instance instanceof GridLayout){
        if(name === "rows"){
            /* Clear any existing rows; would be more efficient to do a diff, but hard to get right. */
            if((instance as GridLayout).getRows().length > 0){
                (instance as GridLayout).removeRows();
            }
            (value as ItemSpec[]).forEach((item: ItemSpec) => {
                (instance as GridLayout).addRow(item);
            });
        } else if(name === "columns"){
            /* Clear any existing columns; would be more efficient to do a diff, but hard to get right. */
            if((instance as GridLayout).getColumns().length > 0){
                (instance as GridLayout).removeColumns();
            }
            (instance as GridLayout).removeColumns();
            (value as ItemSpec[]).forEach((item: ItemSpec) => {
                (instance as GridLayout).addColumn(item);
            });
        }
    } else if((name === "top" || name === "left") && instance instanceof AbsoluteLayout){
        if(name === "top"){
            AbsoluteLayout.setTop(instance as View, value);
        } else if(name === "left"){
            AbsoluteLayout.setLeft(instance as View, value);
        }
    } else if(name === "dock" && instance instanceof View){
        // https://github.com/NativeScript/NativeScript/blob/05c2460fc4989dae4d7fa1ee52f6d54e0c3113f5/tns-core-modules/ui/layouts/dock-layout/dock-layout-common.ts
        // FIXME: Unsure how to unset Dock (does it take null?)
        DockLayout.setDock(instance as View, value);
    } else if(
        (name === "row" || name === "column" || name === "rowSpan" || name === "columnSpan") && 
        instance instanceof View
    ){
        // https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/layouts/grid-layout/grid-layout-ts-page.ts
        // FIXME: Unsure how to unset any of these properties!
        if(name === "row"){
            GridLayout.setRow(instance, value);
        } else if(name === "rowSpan"){
            GridLayout.setRowSpan(instance, value);
        } else if(name === "column"){
            GridLayout.setColumn(instance, value);
        } else if(name === "columnSpan"){
            GridLayout.setColumnSpan(instance, value);
        }
    } else {
        /* FIXME: ensure that we're only calling instance.set() for a valid View/Observable property;
         * many props, e.g. "frameRateMs", may purely be for the use of custom components. */
        instance.set(name, value);
        // TODO: should probably notify of property change, too..?
    }
}