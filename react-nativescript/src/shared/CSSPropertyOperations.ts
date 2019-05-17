import { Instance } from "../client/HostConfig";
import { Style } from "tns-core-modules/ui/styling/style/style";

/**
 * Code in here referenced from: https://github.com/facebook/react/blob/master/packages/react-dom/src/shared/CSSPropertyOperations.js which carries the following copyright:
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in React-LICENSE.txt.
 */

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
        instance.set(styleName, styleValue);
    });
}