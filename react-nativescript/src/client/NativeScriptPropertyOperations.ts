import { Instance, HostContext } from "../shared/HostConfigTypes";
import { isIOS, isAndroid } from "tns-core-modules/platform/platform";
import * as console from "../shared/Logger";
import { rnsDeletedPropValue } from "./magicValues";
import { MutableRefObject } from "react";

/**
 * Code in here referenced from: https://github.com/facebook/react/blob/master/packages/react-dom/src/client/DOMPropertyOperations.js which carries the following copyright:
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in /LICENSE.
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

    /* I expect that React Reconciler does this for us under the hood. */
    // if (name === "ref"){
    //     (value as MutableRefObject<Instance>).current = instance;
    // }
    
    if (name === "class") {
        if(value === rnsDeletedPropValue){
            instance.removeAttribute("className");
        } else {
            instance.setAttribute("className", value)
        }
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
                    instance.setAttribute("ios." + key, subValue);
                } else if (name === "android") {
                    console.log(`[PropOp] Setting ${instance}.android.${key} = ${subValue}`);
                    instance.setAttribute("android." + key, subValue);
                }
            });
        } else {
            console.warn(`[PropOp] got platform-specific non-object prop`);
            /* Some poor soul has probably set an ios|android prop with boolean value or something
             * FIXME: support setting back to defaultValue if value is rnsDeletedPropValue! */
            return;
        }
    } else if (name === "__rns__nodeTreeRole") {
        console.log(`[PropOp] got node-tree role`);
        instance.setAttribute(name, value === rnsDeletedPropValue ? false : value);
    } else if(name.length > 2 && name.startsWith("on") && value === rnsDeletedPropValue || typeof value === "function") {
        const eventName: string = name[2].toLowerCase() + name.slice(3);
        const existingEventListener = instance.eventListeners.get(eventName);
        if(value === rnsDeletedPropValue){
            if(existingEventListener){
                console.log(`[PropOp] REMOVE: ${instance}.removeEventListener("${eventName}", existingEventListener)`);
                instance.removeEventListener(eventName, existingEventListener);
            } else {
                console.log(`[PropOp] NO-OP: ${instance}.removeEventListener("${eventName}", ?)`);
            }
        } else {
            if(existingEventListener){
                console.log(`[PropOp] REPLACE: ${instance}.addEventListener("${eventName}", existingEventListener)`);
                instance.removeEventListener(eventName, existingEventListener);
            } else {
                console.log(`[PropOp] ADD: ${instance}.addEventListener("${eventName}", newEventListener)`);
            }
            instance.addEventListener(eventName, value);
        }
    } else {
        if (value === rnsDeletedPropValue) {
            instance.removeAttribute(name);
        } else {
            instance.setAttribute(name, value);
        }
        /* By using instance.set() under-the-hood, the instance is notified of the property change. */
    }
}
