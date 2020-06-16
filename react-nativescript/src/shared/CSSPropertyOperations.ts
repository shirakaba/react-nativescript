import { Instance } from "../shared/HostConfigTypes";
// import { Style } from "tns-core-modules/ui/styling/style/style";
import * as console from "./Logger";
import { rnsDeletedPropValue } from "../client/magicValues";
import { Style } from "@nativescript/core";
import { CssProperty } from "@nativescript/core/ui/core/properties";
import {
    visibilityProperty,
    horizontalAlignmentProperty,
    verticalAlignmentProperty,
    backgroundRepeatProperty,
} from "@nativescript/core/ui/styling/style-properties";

/**
 * Code in here referenced from: https://github.com/facebook/react/blob/master/packages/react-dom/src/shared/CSSPropertyOperations.js which carries the following copyright:
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in /LICENSE.
 */

/**
 * @see https://github.com/NativeScript/NativeScript/blob/e649a6cfd618c86a1dc7fa84e3197dfb78c3bc74/nativescript-core/ui/styling/style-properties.ts
 */
const propertiesWhoseValidatorsDoNotAcceptUnsetValue = new Map<string, CssProperty<Style, any>>([
    [visibilityProperty.name, visibilityProperty],
    [horizontalAlignmentProperty.name, horizontalAlignmentProperty],
    [verticalAlignmentProperty.name, verticalAlignmentProperty],
    [backgroundRepeatProperty.name, backgroundRepeatProperty],
]);

/**
 * Sets the value for multiple styles on a node.  If a value is specified as
 * '' (empty string), the corresponding style property will be unset.
 *
 * @param {DOMElement} instance
 * @param {object} styles
 */
export function setValueForStyles(instance: Instance, styles: Style): void {
    // const style = instance.style;
    // for (let styleName in styles) {
    //     if (!styles.hasOwnProperty(styleName)) {
    //         continue;
    //     }
    //     const isCustomProperty = styleName.indexOf('--') === 0;
    //     if ((global as any).__DEV__) {
    //         if (!isCustomProperty) {
    //             // TODO
    //             // warnValidStyle(styleName, styles[styleName]);
    //         }
    //     }
    //     const styleValue = dangerousStyleValue(
    //         styleName,
    //         styles[styleName],
    //         isCustomProperty,
    //     );
    //     if (styleName === 'float') {
    //         styleName = 'cssFloat';
    //     }
    //     if (isCustomProperty) {
    //         // style.setProperty(styleName, styleValue);
    //         style[styleName] = styleValue;
    //     } else {
    //         style[styleName] = styleValue;
    //     }
    // }

    Object.keys(styles).forEach((styleName: string) => {
        // console.log(`Setting style:`, styleName);
        const styleValue: any = styles[styleName];
        if (styleValue === rnsDeletedPropValue) {
            console.log(`[setValueForStyles] ${instance}.removeAttribute(${styleName});`);
            const matchingProperty = propertiesWhoseValidatorsDoNotAcceptUnsetValue.get(styleName);
            if (matchingProperty) {
                instance.setAttribute(styleName, matchingProperty.defaultValue);
            } else {
                // const defaultValueForStyle: unknown = (instance as any).__proto__[styleName];
                // instance.setAttribute(styleName, defaultValueForStyle);
                instance.removeAttribute(styleName);
            }
        } else {
            instance.setAttribute(styleName, styleValue);
        }
    });
}
