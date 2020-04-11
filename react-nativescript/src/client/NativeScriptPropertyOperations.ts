import { Instance, HostContext } from "../shared/HostConfigTypes";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { setValueForStyles } from "../shared/CSSPropertyOperations";
import { DockLayout, dockProperty } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";
import { View, classNameProperty } from "tns-core-modules/ui/core/view/view";
import { ViewBase } from "tns-core-modules/ui/core/view-base/view-base";
import {
    GridLayout,
    ItemSpec,
    rowProperty,
    rowSpanProperty,
    columnProperty,
    columnSpanProperty,
} from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { AbsoluteLayout, topProperty, leftProperty } from "tns-core-modules/ui/layouts/absolute-layout/absolute-layout";
import { Property } from "tns-core-modules/ui/core/properties/properties";
import {
    FlexboxLayout,
    alignSelfProperty,
    flexGrowProperty,
    flexShrinkProperty,
    flexWrapBeforeProperty,
    orderProperty,
} from "tns-core-modules/ui/layouts/flexbox-layout/flexbox-layout";
import { isIOS, isAndroid } from "tns-core-modules/platform/platform";
import { ActionBar, TabViewItem } from "./ElementRegistry";
import * as console from "../shared/Logger";
import { rnsDeletedPropValue } from "./magicValues";

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

    // const currentValue: unknown = instance.get("name");

    if (name === "class") {
        // console.warn(`Note that 'class' is remapped to 'className'.`);
        instance.set("className", value === rnsDeletedPropValue ? classNameProperty.defaultValue : value);
    } else if ((name === "rows" || name === "columns") && instance instanceof GridLayout) {
        if (name === "rows") {
            /* Clear any existing rows; would be more efficient to do a diff, but hard to get right. */
            if (instance.getRows().length > 0) {
                instance.removeRows();
            }
            if (value !== rnsDeletedPropValue) {
                ((value as ItemSpec[]) || []).forEach((item: ItemSpec) => {
                    instance.addRow(item);
                });
            }
        } else if (name === "columns") {
            /* Clear any existing columns; would be more efficient to do a diff, but hard to get right. */
            if (instance.getColumns().length > 0) {
                instance.removeColumns();
            }
            if (value !== rnsDeletedPropValue) {
                ((value as ItemSpec[]) || []).forEach((item: ItemSpec) => {
                    instance.addColumn(item);
                });
            }
        }
    } else if (
        (name === "alignSelf" ||
            name === "flexGrow" ||
            name === "flexShrink" ||
            name === "flexWrapBefore" ||
            name === "order") &&
        hostContext.isInAFlexboxLayout
    ) {
        if (name === "alignSelf") {
            FlexboxLayout.setAlignSelf(
                instance as View,
                value === rnsDeletedPropValue ? alignSelfProperty.defaultValue : value
            );
        } else if (name === "flexGrow") {
            FlexboxLayout.setFlexGrow(
                instance as View,
                value === rnsDeletedPropValue ? flexGrowProperty.defaultValue : value
            );
        } else if (name === "flexShrink") {
            FlexboxLayout.setFlexShrink(
                instance as View,
                value === rnsDeletedPropValue ? flexShrinkProperty.defaultValue : value
            );
        } else if (name === "flexWrapBefore") {
            FlexboxLayout.setFlexWrapBefore(
                instance as View,
                value === rnsDeletedPropValue ? flexWrapBeforeProperty.defaultValue : value
            );
        } else if (name === "order") {
            FlexboxLayout.setOrder(
                instance as View,
                value === rnsDeletedPropValue ? orderProperty.defaultValue : value
            );
        }
    } else if ((name === "top" || name === "left") && hostContext.isInAnAbsoluteLayout) {
        /* FIXME: Determine whether it makes sense for top/left to be applied upon the instance    * itself if component is ever removed from its AbsoluteLayout parent (and how to do so). */
        if (name === "top") {
            AbsoluteLayout.setTop(instance as View, value === rnsDeletedPropValue ? topProperty.defaultValue : value);
        } else if (name === "left") {
            AbsoluteLayout.setLeft(instance as View, value === rnsDeletedPropValue ? leftProperty.defaultValue : value);
        }
    } else if (name === "dock" && hostContext.isInADockLayout) {
        // https://github.com/NativeScript/NativeScript/blob/05c2460fc4989dae4d7fa1ee52f6d54e0c3113f5/tns-core-modules/ui/layouts/dock-layout/dock-layout-common.ts
        /* If the component is subsequently removed from its Dock parent, I'm guessing that
         * this property probably has no effect, so no need to figure out how to unset it. */
        DockLayout.setDock(instance as View, value === rnsDeletedPropValue ? dockProperty.defaultValue : value);
    } else if (
        (name === "row" || name === "column" || name === "rowSpan" || name === "columnSpan") &&
        hostContext.isInAGridLayout
    ) {
        // https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/layouts/grid-layout/grid-layout-ts-page.ts
        /* If the component is subsequently removed from its Grid parent, I'm guessing that
         * this property probably has no effect, so no need to figure out how to unset it. */
        if (name === "row") {
            GridLayout.setRow(instance as View, value === rnsDeletedPropValue ? rowProperty.defaultValue : value);
        } else if (name === "rowSpan") {
            GridLayout.setRowSpan(
                instance as View,
                value === rnsDeletedPropValue ? rowSpanProperty.defaultValue : value
            );
        } else if (name === "column") {
            GridLayout.setColumn(instance as View, value === rnsDeletedPropValue ? columnProperty.defaultValue : value);
        } else if (name === "columnSpan") {
            GridLayout.setColumnSpan(
                instance as View,
                value === rnsDeletedPropValue ? columnSpanProperty.defaultValue : value
            );
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
    } else if ((name === "ios" && isIOS) || (name === "android" && isAndroid)) {
        /* These props, at least in ActionItem, are read-only, so must be set recursively instead. */
        if (typeof value === "object") {
            /* FIXME: support setting back to defaultValue if value is rnsDeletedPropValue! */
            const keys: string[] = Object.keys(value);
            if (keys.length === 0) return;
            console.log(`[PropOp] got platform-specific prop of type object`);
            keys.forEach((key: string) => {
                /* FIXME: support setting back to defaultValue if any subValue is rnsDeletedPropValue! */
                const subValue: any = value[key];
                if (name === "ios") {
                    console.log(`[PropOp] Setting ${instance}.ios.${key} = ${subValue}`);
                    instance.ios[key] = subValue;
                } else if (name === "android") {
                    console.log(`[PropOp] Setting ${instance}.android.${key} = ${subValue}`);
                    instance.android[key] = subValue;
                }
            });
        } else {
            console.warn(`[PropOp] got platform-specific non-object prop`);
            /* Some poor soul has probably set an ios|android prop with boolean value or something
             * FIXME: support setting back to defaultValue if value is rnsDeletedPropValue! */
            if (value === rnsDeletedPropValue) {
                setDefaultValueForArbitraryProperty(instance, name);
            } else {
                instance.set(name, value);
            }
        }
    } else if (name === "__rns__nodeTreeRole") {
        console.log(`[PropOp] got node-tree role`);
        instance.set(name, value === rnsDeletedPropValue ? false : value);
    } else {
        /* FIXME: ensure that we're only calling instance.set() for a valid View/Observable property;
         * many props, e.g. "frameRateMs", may purely be for the use of custom components. */
        if (value === rnsDeletedPropValue) {
            /**
             * We can't import the Property directly from each module (without a huge rewrite), but the singleton
             * instance of the Property registers its default value upon the prototype of the class.
             * @see https://github.com/NativeScript/NativeScript/blob/bd9828a0367b30bd332070c92a5f2f921461c5a8/nativescript-core/ui/core/properties/properties.ts#L298
             *
             * If no defaultValue is specified, it would resolve to void 0 anyway.
             * @see https://github.com/NativeScript/NativeScript/blob/bd9828a0367b30bd332070c92a5f2f921461c5a8/nativescript-core/ui/core/properties/properties.ts#L173-L174
             */
            setDefaultValueForArbitraryProperty(instance, name);
        } else {
            instance.set(name, value);
        }
        /* By using instance.set(), the instance is notified of the property change. */
    }
}

function setDefaultValueForArbitraryProperty(instance: Instance, name: string): void {
    const defaultValueForProperty: unknown = (instance as any).__proto__[name];
    console.log(`[PropOp] Got rnsDeletedPropValue for "${name}". Default value found to be:`, defaultValueForProperty);
    instance.set(name, defaultValueForProperty);
}
