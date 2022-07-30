import { Instance } from "../shared/HostConfigTypes";
import * as console from "./Logger";
import { rnsDeletedPropValue } from "../client/magicValues";
import { Style } from "@nativescript/core";
import { RNSStyle } from "../shared/NativeScriptJSXTypings";
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

export type StyleUpdates = {
    [P in keyof RNSStyle]: RNSStyle[P] | typeof rnsDeletedPropValue;
};

/**
 * Sets the value for multiple styles on a node.  If a value is specified as
 * '' (empty string), the corresponding style property will be unset.
 *
 * @param {DOMElement} instance
 * @param {object} styles
 */
export function setValueForStyles(instance: Instance, styles: StyleUpdates): void {
    Object.keys(styles).forEach((styleName: string) => {
        const styleValue: any = styles[styleName];
        if (styleValue === rnsDeletedPropValue) {
            console.log(`[setValueForStyles] ${instance}.removeAttribute(${styleName});`);
            const matchingProperty = propertiesWhoseValidatorsDoNotAcceptUnsetValue.get(styleName);
            if (matchingProperty) {
                instance.setAttribute(styleName, matchingProperty.defaultValue);
            } else {
                instance.removeAttribute(styleName);
            }
        } else {
            instance.setAttribute(styleName, styleValue);
        }
    });
}
