/**
 * Code in here referenced from: https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMComponent.js which carries the following copyright:
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in LICENSE.
 */
import assertValidProps from "../shared/assertValidProps";
import { Type, Instance, Container, HostContext } from "../shared/HostConfigTypes";
import { TextBase } from "@nativescript/core";
import { setValueForStyles, StyleUpdates } from "../shared/CSSPropertyOperations";
import { setValueForProperty } from "./NativeScriptPropertyOperations";
import * as console from "../shared/Logger";
import { rnsDeletedPropValue } from "./magicValues";
import type { NativeScriptAttributes } from "../shared/NativeScriptJSXTypings";

const DANGEROUSLY_SET_INNER_HTML = "dangerouslySetInnerHTML";
const SUPPRESS_CONTENT_EDITABLE_WARNING = "suppressContentEditableWarning";
const SUPPRESS_HYDRATION_WARNING = "suppressHydrationWarning";
const AUTOFOCUS = "autoFocus";
const CHILDREN = "children";
const TEXT = "text";
const STYLE = "style";
const HTML = "__html";

function setTextContent(node: Instance, text: string): void {
    /* No concept of text nodes in NativeScript as far as I know... */

    node.text = text;
}

export function setInitialProperties(
    domElement: Instance,
    tag: Type,
    rawProps: Object,
    rootContainerElement: Container,
    hostContext: HostContext
): void {
    // TODO: Make sure that we check isMounted before firing any of these events.

    const props = rawProps;
    assertValidProps(tag, props);

    setInitialDOMProperties(tag, domElement, rootContainerElement, props, false, hostContext);
}

export function setInitialDOMProperties(
    tag: Type,
    domElement: Instance,
    rootContainerElement: Container,
    nextProps: Object,
    isCustomComponentTag: boolean,
    hostContext: HostContext
): void {
    for (const propKey in nextProps) {
        if (!nextProps.hasOwnProperty(propKey)) {
            continue;
        }
        const nextProp = nextProps[propKey];
        if (propKey === STYLE) {
            if ((globalThis as any).__DEV__) {
                if (nextProp) {
                    // Freeze the next style object so that we can assume it won't be
                    // mutated. We have already warned for this in the past.
                    Object.freeze(nextProp);
                }
            }
            // Relies on `updateStylesByID` not mutating `styleUpdates`.
            setValueForStyles(domElement, nextProp as StyleUpdates);
        } else if (propKey === CHILDREN) {
            if (typeof nextProp === "string") {
                // Avoid setting initial textContent when the text is empty. In IE11 setting
                // textContent on a <textarea> will cause the placeholder to not
                // show within the <textarea> until it has been focused and blurred again.
                // https://github.com/facebook/react/issues/6731#issuecomment-254874553
                const canSetTextContent = tag !== "textarea" || nextProp !== "";
                if (canSetTextContent) {
                    setTextContent(domElement, nextProp);
                }
            } else if (typeof nextProp === "number") {
                setTextContent(domElement, "" + nextProp);
            }
        } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING) {
            // Noop
        } else if (propKey === AUTOFOCUS) {
            // We polyfill it separately on the client during commit.
            // We could have excluded it in the property list instead of
            // adding a special case here, but then it wouldn't be emitted
            // on server rendering (but we *do* want to emit it in SSR).
            // TODO: check whether this condition, which makes sense for DOM, makes sense for NativeScript.
        } else if (nextProp != null) {
            setValueForProperty(domElement, propKey, nextProp, isCustomComponentTag, hostContext);
        }
    }
}

export function updateDOMProperties(
    instance: Instance,
    updatePayload: Array<any>,
    wasCustomComponentTag: boolean,
    isCustomComponentTag: boolean,
    hostContext: HostContext
): void {
    // TODO: Handle wasCustomComponentTag
    for (let i = 0; i < updatePayload.length; i += 2) {
        const propKey = updatePayload[i];
        const propValue = updatePayload[i + 1];
        if (propKey === STYLE) {
            if (propValue !== null) {
                /*
                 * When a React element updates from having no style prop at all to having one, the Host Config's commitUpdate()
                 * the diffProperties() update payload will consist of e.g. ["style", null, "style", { color: "red" }].
                 * As far as I can tell, we can just no-op for the ["style", null] update. Alternatively, we could pass in an
                 * empty object, but it'd be a little less efficient. So instead, I just skip the null case via the above
                 * conditional check.
                 */
                console.log(`[updateDOMProperties] ${instance}.style`, propValue);
                setValueForStyles(instance, propValue as StyleUpdates);
            }
        } else if (propKey === CHILDREN) {
            /* The fact that React DOM don't handle child nesting here suggests that
             * it has already been filtered out beforehand, and children can only be
             * text content by this point. */
            setTextContent(instance, propValue);
        } else if (propKey === TEXT && instance instanceof TextBase) {
            setTextContent(instance, propValue);
        } else {
            setValueForProperty(instance, propKey, propValue, isCustomComponentTag, hostContext);
        }
    }
}

export function diffProperties(
    domElement: Instance,
    tag: Type,
    lastRawProps: object,
    nextRawProps: object,
    rootContainerElement: Container
): null | Array<any> {
    let updatePayload: null | Array<any> = null;

    let lastProps: object = lastRawProps;
    let nextProps: object = nextRawProps;

    if (typeof tag === "string") {
        assertValidProps(tag, nextProps);
    } else {
        console.warn(
            `TODO: determine whether a custom component may pass through client/ReactNativeScriptComponent.diffProperties()`
        );
    }

    let propKey: string;
    let styleName: string;
    let styleUpdates: StyleUpdates | null = null;
    for (propKey in lastProps) {
        if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
            continue;
        }
        if (propKey === STYLE) {
            const lastStyle: NativeScriptAttributes["style"] = lastProps[propKey];
            if (lastStyle) {
                for (styleName in lastStyle) {
                    if (lastStyle.hasOwnProperty(styleName)) {
                        if (!styleUpdates) {
                            styleUpdates = {};
                        }
                        console.log(
                            `[diffProperties.lastProps] style.${styleName} found in last update's style object.`
                        );
                        styleUpdates[styleName] = rnsDeletedPropValue; // Will be deleted by default, unless updated.
                    }
                }
            }
        } else if (propKey === DANGEROUSLY_SET_INNER_HTML || propKey === CHILDREN) {
            // Noop. This is handled by the clear text mechanism.
            console.warn(`[diffProperties] propKey === CHILDREN; Noop. This is handled by the clear text mechanism.`);
        } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING) {
            // Noop
        } else if (propKey === AUTOFOCUS) {
            // Noop. It doesn't work on updates anyway.
        } else {
            console.log(`[diffProperties] INSPECTING OLDPROPS key:`, propKey);
            // For all other deleted properties we add it to the queue. We use
            // the whitelist in the commit phase instead.
            //
            (updatePayload = updatePayload || []).push(propKey, rnsDeletedPropValue);
        }
    }

    for (propKey in nextProps) {
        const nextProp = nextProps[propKey];
        const lastProp = lastProps != null ? lastProps[propKey] : undefined;
        if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp == null && lastProp == null)) {
            continue;
        }
        if (propKey === STYLE) {
            if ((globalThis as any).__DEV__) {
                if (nextProp) {
                    // Freeze the next style object so that we can assume it won't be
                    // mutated. We have already warned for this in the past.
                    Object.freeze(nextProp);
                }
            }
            if (lastProp) {
                // Unset styles on `lastProp` but not on `nextProp`.
                for (styleName in lastProp) {
                    if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
                        if (!styleUpdates) {
                            styleUpdates = {};
                        }
                        console.log(`[diffProperties.nextProps] style.${styleName} deleted!`);
                        styleUpdates[styleName] = rnsDeletedPropValue;
                    }
                }
                // Update styles that changed since `lastProp`.
                for (styleName in nextProp) {
                    if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
                        if (!styleUpdates) {
                            styleUpdates = {};
                        }
                        styleUpdates[styleName] = nextProp[styleName];
                    }
                }
            } else {
                // Relies on `updateStylesByID` not mutating `styleUpdates`.
                if (!styleUpdates) {
                    if (!updatePayload) {
                        updatePayload = [];
                    }
                    // This is where we get the update ["style", null] from.
                    updatePayload.push(STYLE, styleUpdates);
                }
                styleUpdates = nextProp;
            }
        } else if (propKey === CHILDREN) {
            if (lastProp !== nextProp && (typeof nextProp === "string" || typeof nextProp === "number")) {
                (updatePayload = updatePayload || []).push(propKey, "" + nextProp);
            } else {
            }
        } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING) {
            // Noop
        } else {
            // For any other property we always add it to the queue and then we
            // filter it out using the whitelist during the commit.
            (updatePayload = updatePayload || []).push(propKey, nextProp);
        }
    }
    if (styleUpdates) {
        (updatePayload = updatePayload || []).push(STYLE, styleUpdates);
    }
    return updatePayload;
}

export function updateProperties(
    instance: Instance,
    updatePayload: Array<any>,
    type: Type,
    lastRawProps: any,
    nextRawProps: any,
    hostContext: HostContext
): void {
    // Update checked *before* name.
    // In the middle of an update, it is possible to have multiple checked.
    // When a checked radio tries to change name, browser makes another radio's checked false.

    // Apply the diff.
    updateDOMProperties(instance, updatePayload, false, false, hostContext);
}
