import { Instance, HostContext } from "./HostConfig";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { setValueForStyles } from "../shared/CSSPropertyOperations";
import { DockLayout } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";
import { View } from "tns-core-modules/ui/core/view/view";
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { AbsoluteLayout } from "tns-core-modules/ui/layouts/absolute-layout/absolute-layout";
import { FlexboxLayout } from "tns-core-modules/ui/layouts/flexbox-layout/flexbox-layout";
import { ActionBar, TabViewItem } from "./ElementRegistry";

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
    hostContext: HostContext
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
    } else if((name === "rows" || name === "columns") && instance instanceof GridLayout){
        const deepEqualsExcuse: string = "React NativeScript will not compare ItemSpec arrays by deep-equals; will not update property:";

        if(name === "rows"){
            /* We're not going to deep-equals the array of ItemSpecs. */
            if(instance.getRows() === value as ItemSpec[]){
                console.warn(`${deepEqualsExcuse} 'rows'.`);
                return;
            }

            /* Clear any existing rows; would be more efficient to do a diff, but hard to get right. */
            if(instance.getRows().length > 0){
                instance.removeRows();
            }
            (value as ItemSpec[]).forEach((item: ItemSpec) => {
                instance.addRow(item);
            });
        } else if(name === "columns"){
            /* We're not going to deep-equals the array of ItemSpecs. */
            if(instance.getColumns() === value as ItemSpec[]){
                console.warn(`${deepEqualsExcuse} 'columns'.`);
                return;
            }

            /* Clear any existing columns; would be more efficient to do a diff, but hard to get right. */
            if(instance.getColumns().length > 0){
                instance.removeColumns();
            }
            instance.removeColumns();
            (value as ItemSpec[]).forEach((item: ItemSpec) => {
                instance.addColumn(item);
            });
        }
    } else if(
        (
            name === "alignSelf" || name === "flexGrow" || name === "flexShrink" ||
            name === "flexWrapBefore" || name === "order"
        ) && hostContext.isInAFlexboxLayout
    ){
        if(name === "alignSelf"){
            FlexboxLayout.setAlignSelf(instance as View, value);
        } else if(name === "flexGrow"){
            FlexboxLayout.setFlexGrow(instance as View, value);
        } else if(name === "flexShrink"){
            FlexboxLayout.setFlexShrink(instance as View, value);
        } else if(name === "flexWrapBefore"){
            FlexboxLayout.setFlexWrapBefore(instance as View, value);
        } else if(name === "order"){
            FlexboxLayout.setOrder(instance as View, value);
        }
    } else if((name === "top" || name === "left") && hostContext.isInAnAbsoluteLayout){
        /* FIXME: Determine whether it makes sense for top/left to be applied upon the instance    * itself if component is ever removed from its AbsoluteLayout parent (and how to do so). */
        if(name === "top"){
            AbsoluteLayout.setTop(instance as View, value);
        } else if(name === "left"){
            AbsoluteLayout.setLeft(instance as View, value);
        }
    } else if(name === "dock" && hostContext.isInADockLayout){
        // https://github.com/NativeScript/NativeScript/blob/05c2460fc4989dae4d7fa1ee52f6d54e0c3113f5/tns-core-modules/ui/layouts/dock-layout/dock-layout-common.ts
        /* If the component is subsequently removed from its Dock parent, I'm guessing that
         * this property probably has no effect, so no need to figure out how to unset it. */
        DockLayout.setDock(instance as View, value);
    } else if(
        (name === "row" || name === "column" || name === "rowSpan" || name === "columnSpan") && 
        hostContext.isInAGridLayout
    ){
        // https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/layouts/grid-layout/grid-layout-ts-page.ts
        /* If the component is subsequently removed from its Grid parent, I'm guessing that
         * this property probably has no effect, so no need to figure out how to unset it. */
        if(name === "row"){
            GridLayout.setRow(instance as View, value);
        } else if(name === "rowSpan"){
            GridLayout.setRowSpan(instance as View, value);
        } else if(name === "column"){
            GridLayout.setColumn(instance as View, value);
        } else if(name === "columnSpan"){
            GridLayout.setColumnSpan(instance as View, value);
        }
    // } else if(
    //     name === "color" && instance instanceof ActionBar ||
    //     name === "backgroundColor" && instance instanceof ActionBar
    // ){
    
    /* Looks like instance.set() suffices for this case; but will keep this
     * implementation commented out here just in case I've missed something. */
    // } else if(name === "view" && instance instanceof TabViewItem){
    //     // console.log(`[setValueForProperty] SETTING .view on ${instance}. Value:`, value);
    //     (instance as TabViewItem).view = value;
    } else {
        /* FIXME: ensure that we're only calling instance.set() for a valid View/Observable property;
         * many props, e.g. "frameRateMs", may purely be for the use of custom components. */
        instance.set(name, value);
        // TODO: should probably notify of property change, too..?
    }
}