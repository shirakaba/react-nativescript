/**
 * Code in here referenced from: https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMComponent.js which carries the following copyright:
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in React-LICENSE.txt.
 */
import assertValidProps from "../shared/assertValidProps";
import { Type, Instance, Container, HostContext } from "./HostConfig";
import { TextBase, ViewBase } from "tns-core-modules/ui/text-base/text-base";
import { setValueForStyles } from "../shared/CSSPropertyOperations";
import { setValueForProperty } from "./NativeScriptPropertyOperations";

const DANGEROUSLY_SET_INNER_HTML: string = 'dangerouslySetInnerHTML';
const SUPPRESS_CONTENT_EDITABLE_WARNING: string = 'suppressContentEditableWarning';
const SUPPRESS_HYDRATION_WARNING: string = 'suppressHydrationWarning';
const AUTOFOCUS: string = 'autoFocus';
const CHILDREN: string = 'children';
const TEXT: string = 'text';
const STYLE: string = 'style';
const HTML: string = '__html';
// const TEXT_NODE: string = '';

function setTextContent(node: Instance, text: string): void {
    /* No concept of text nodes in NativeScript as far as I know... */
    // if (text) {
    //     let firstChild;
    //     let i: number = 0;
    //     node.eachChild((child: ViewBase) => {
    //         if(i === 0){
    //             firstChild = child;
    //         } else if(i > 0){
    //             return false;
    //         }
    //         i++;
    //         return true;
    //     });
    //     const isLastChild: boolean = firstChild && i === 1;
    //     if (
    //         firstChild &&
    //         isLastChild &&
    //         // firstChild.nodeType === TEXT_NODE
    //         typeof firstChild === "string" || typeof firstChild === "number"
    //     ) {
    //         const oldText: string = firstChild.text;
    //         firstChild.text = text;
    //         firstChild.notifyPropertyChange("text", text, oldText);
    //         return;
    //     }
    // }

    if(node instanceof TextBase){
        const oldText: string = node.text;
        node.text = text;
        node.notifyPropertyChange("text", text, oldText);
    } else {
        console.warn(`setTextContent() content incorrectly called on non-TextBase!`);
    }
};

export function setInitialProperties(
	domElement: Instance,
	tag: Type,
	rawProps: Object,
    rootContainerElement: Container,
    hostContext: HostContext
): void {
	// const isCustomComponentTag = isCustomComponent(tag, rawProps);
	// if ((global as any).__DEV__) {
	// 	validatePropertiesInDevelopment(tag, rawProps);
	// 	if (
	// 		isCustomComponentTag &&
	// 		!didWarnShadyDOM &&
	// 		(domElement: any).shadyRoot
	// 	) {
	// 		warning(
	// 			false,
	// 			'%s is using shady DOM. Using shady DOM with React can ' +
	// 				'cause things to break subtly.',
	// 			getCurrentFiberOwnerNameInDevOrNull() || 'A component',
	// 		);
	// 		didWarnShadyDOM = true;
	// 	}
	// }

	// TODO: Make sure that we check isMounted before firing any of these events.
	// let props: Object;
	// switch (tag) {
	// 	case 'iframe':
	// 	case 'object':
	// 		trapBubbledEvent(TOP_LOAD, domElement);
	// 		props = rawProps;
	// 		break;
	// 	case 'video':
	// 	case 'audio':
	// 		// Create listener for each media event
	// 		for (let i = 0; i < mediaEventTypes.length; i++) {
	// 			trapBubbledEvent(mediaEventTypes[i], domElement);
	// 		}
	// 		props = rawProps;
	// 		break;
	// 	case 'source':
	// 		trapBubbledEvent(TOP_ERROR, domElement);
	// 		props = rawProps;
	// 		break;
	// 	case 'img':
	// 	case 'image':
	// 	case 'link':
	// 		trapBubbledEvent(TOP_ERROR, domElement);
	// 		trapBubbledEvent(TOP_LOAD, domElement);
	// 		props = rawProps;
	// 		break;
	// 	case 'form':
	// 		trapBubbledEvent(TOP_RESET, domElement);
	// 		trapBubbledEvent(TOP_SUBMIT, domElement);
	// 		props = rawProps;
	// 		break;
	// 	case 'details':
	// 		trapBubbledEvent(TOP_TOGGLE, domElement);
	// 		props = rawProps;
	// 		break;
	// 	case 'input':
	// 		ReactDOMInputInitWrapperState(domElement, rawProps);
	// 		props = ReactDOMInputGetHostProps(domElement, rawProps);
	// 		trapBubbledEvent(TOP_INVALID, domElement);
	// 		// For controlled components we always need to ensure we're listening
	// 		// to onChange. Even if there is no listener.
	// 		ensureListeningTo(rootContainerElement, 'onChange');
	// 		break;
	// 	case 'option':
	// 		ReactDOMOptionValidateProps(domElement, rawProps);
	// 		props = ReactDOMOptionGetHostProps(domElement, rawProps);
	// 		break;
	// 	case 'select':
	// 		ReactDOMSelectInitWrapperState(domElement, rawProps);
	// 		props = ReactDOMSelectGetHostProps(domElement, rawProps);
	// 		trapBubbledEvent(TOP_INVALID, domElement);
	// 		// For controlled components we always need to ensure we're listening
	// 		// to onChange. Even if there is no listener.
	// 		ensureListeningTo(rootContainerElement, 'onChange');
	// 		break;
	// 	case 'textarea':
	// 		ReactDOMTextareaInitWrapperState(domElement, rawProps);
	// 		props = ReactDOMTextareaGetHostProps(domElement, rawProps);
	// 		trapBubbledEvent(TOP_INVALID, domElement);
	// 		// For controlled components we always need to ensure we're listening
	// 		// to onChange. Even if there is no listener.
	// 		ensureListeningTo(rootContainerElement, 'onChange');
	// 		break;
	// 	default:
	// 		props = rawProps;
	// }

    const props = rawProps;
	assertValidProps(tag, props);

	setInitialDOMProperties(
		tag,
		domElement,
		rootContainerElement,
		props,
        false,
        hostContext,
	);

	// switch (tag) {
	// 	case 'input':
	// 		// TODO: Make sure we check if this is still unmounted or do any clean
	// 		// up necessary since we never stop tracking anymore.
	// 		track((domElement: any));
	// 		ReactDOMInputPostMountWrapper(domElement, rawProps, false);
	// 		break;
	// 	case 'textarea':
	// 		// TODO: Make sure we check if this is still unmounted or do any clean
	// 		// up necessary since we never stop tracking anymore.
	// 		track((domElement: any));
	// 		ReactDOMTextareaPostMountWrapper(domElement, rawProps);
	// 		break;
	// 	case 'option':
	// 		ReactDOMOptionPostMountWrapper(domElement, rawProps);
	// 		break;
	// 	case 'select':
	// 		ReactDOMSelectPostMountWrapper(domElement, rawProps);
	// 		break;
	// 	default:
	// 		if (typeof props.onClick === 'function') {
	// 			// TODO: This cast may not be sound for SVG, MathML or custom elements.
	// 			trapClickOnNonInteractiveElement(((domElement: any): HTMLElement));
	// 		}
	// 		break;
	// }
}

export function setInitialDOMProperties(
	tag: Type,
	domElement: Instance,
	rootContainerElement: Container,
	nextProps: Object,
    isCustomComponentTag: boolean,
    hostContext: HostContext
): void {
    // console.log(`[setInitialDOMProperties] for: ${domElement}`);
	for (const propKey in nextProps) {
		if (!nextProps.hasOwnProperty(propKey)) {
			continue;
		}
		const nextProp = nextProps[propKey];
		if (propKey === STYLE) {
			if ((global as any).__DEV__) {
				if (nextProp) {
					// Freeze the next style object so that we can assume it won't be
					// mutated. We have already warned for this in the past.
					Object.freeze(nextProp);
				}
			}
			// Relies on `updateStylesByID` not mutating `styleUpdates`.
			setValueForStyles(domElement, nextProp);
		// } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
		// 	const nextHtml = nextProp ? nextProp[HTML] : undefined;
		// 	if (nextHtml != null) {
		// 		setInnerHTML(domElement, nextHtml);
		// 	}
		} else if (propKey === CHILDREN) {
			if (typeof nextProp === 'string') {
				// Avoid setting initial textContent when the text is empty. In IE11 setting
				// textContent on a <textarea> will cause the placeholder to not
				// show within the <textarea> until it has been focused and blurred again.
				// https://github.com/facebook/react/issues/6731#issuecomment-254874553
				const canSetTextContent = tag !== 'textarea' || nextProp !== '';
				if (canSetTextContent) {
					setTextContent(domElement, nextProp);
				}
			} else if (typeof nextProp === 'number') {
				setTextContent(domElement, '' + nextProp);
			}
		} else if (
			propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
			propKey === SUPPRESS_HYDRATION_WARNING
		) {
			// Noop
		} else if (propKey === AUTOFOCUS) {
			// We polyfill it separately on the client during commit.
			// We could have excluded it in the property list instead of
			// adding a special case here, but then it wouldn't be emitted
			// on server rendering (but we *do* want to emit it in SSR).
		// } else if (registrationNameModules.hasOwnProperty(propKey)) {
		// 	if (nextProp != null) {
		// 		if (__DEV__ && typeof nextProp !== 'function') {
		// 			warnForInvalidEventListener(propKey, nextProp);
		// 		}
		// 		ensureListeningTo(rootContainerElement, propKey);
		// 	}
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
    // console.log(`[updateDOMProperties] for: ${instance}`);
    // TODO: Handle wasCustomComponentTag
    for (let i = 0; i < updatePayload.length; i += 2) {
        const propKey = updatePayload[i];
        const propValue = updatePayload[i + 1];
        if (propKey === STYLE) {
            setValueForStyles(instance, propValue);
        // } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
        //     setInnerHTML(instance, propValue);
        } else if (propKey === CHILDREN) {
            /* The fact that React DOM don't handle child nesting here suggests that
             * it has already been filtered out beforehand, and children can only be 
             * text content by this point. */
            setTextContent(instance, propValue);
        } else if (propKey === TEXT && instance instanceof TextBase) {
            setTextContent(instance, propValue);
        } else {
            // console.log(`[updateDOMProperties] calling setValueForProperty on ${instance} for propKey: ${propKey}; value:`, propValue);
            setValueForProperty(instance, propKey, propValue, isCustomComponentTag, hostContext);
        }
    }
}

export function diffProperties(
    domElement: Instance,
    tag: Type,
    lastRawProps: object,
    nextRawProps: object,
    rootContainerElement: Container,
  ): null | Array<any> {
    // if(__DEV__){
    //   validatePropertiesInDevelopment(tag, nextRawProps);
    // }
  
    let updatePayload: null | Array<any> = null;
  
    let lastProps: object = lastRawProps;
    let nextProps: object = nextRawProps;

    // switch(tag){
    //   case 'input':
    //     lastProps = ReactDOMInputGetHostProps(domElement, lastRawProps);
    //     nextProps = ReactDOMInputGetHostProps(domElement, nextRawProps);
    //     updatePayload = [];
    //     break;
    //   case 'option':
    //     lastProps = ReactDOMOptionGetHostProps(domElement, lastRawProps);
    //     nextProps = ReactDOMOptionGetHostProps(domElement, nextRawProps);
    //     updatePayload = [];
    //     break;
    //   case 'select':
    //     lastProps = ReactDOMSelectGetHostProps(domElement, lastRawProps);
    //     nextProps = ReactDOMSelectGetHostProps(domElement, nextRawProps);
    //     updatePayload = [];
    //     break;
    //   case 'textarea':
    //     lastProps = ReactDOMTextareaGetHostProps(domElement, lastRawProps);
    //     nextProps = ReactDOMTextareaGetHostProps(domElement, nextRawProps);
    //     updatePayload = [];
    //     break;
    //   default:
    //     lastProps = lastRawProps;
    //     nextProps = nextRawProps;
    //     if (
    //       typeof lastProps.onClick !== 'function' &&
    //       typeof nextProps.onClick === 'function'
    //     ) {
    //       // TODO: This cast may not be sound for SVG, MathML or custom elements.
    //       trapClickOnNonInteractiveElement(((domElement: any): HTMLElement));
    //     }
    //     break;
    // }
    
    if(typeof tag === "string"){
        assertValidProps(tag, nextProps);
    } else {
        console.warn(`TODO: determine whether a custom component may pass through client/ReactNativeScriptComponent.diffProperties()`);
    }

    let propKey: string;
    let styleName: string;
    let styleUpdates: Record<string, string>|null = null;
    for (propKey in lastProps) {
        if (
            nextProps.hasOwnProperty(propKey) ||
            !lastProps.hasOwnProperty(propKey) ||
            lastProps[propKey] == null
        ) {
            // console.log(`[diffProperties] skipping on lastProps key:`, propKey); 
            continue;
        }
        if (propKey === STYLE) {
            const lastStyle = lastProps[propKey];
            for (styleName in lastStyle) {
                if (lastStyle.hasOwnProperty(styleName)) {
                    if (!styleUpdates) {
                        styleUpdates = {};
                    }
                    styleUpdates[styleName] = '';
                }
            }
        } else if (propKey === DANGEROUSLY_SET_INNER_HTML || propKey === CHILDREN) {
            // Noop. This is handled by the clear text mechanism.
            console.warn(`[diffProperties] propKey === CHILDREN; Noop. This is handled by the clear text mechanism.`);
        } else if (
            propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
            propKey === SUPPRESS_HYDRATION_WARNING
        ) {
            // Noop
        } else if (propKey === AUTOFOCUS) {
            // Noop. It doesn't work on updates anyway.
        // } else if (registrationNameModules.hasOwnProperty(propKey)) {
        //     // This is a special case. If any listener updates we need to ensure
        //     // that the "current" fiber pointer gets updated so we need a commit
        //     // to update this element.
        //     if (!updatePayload) {
        //         updatePayload = [];
        //     }
        } else {
            console.log(`[diffProperties] INSPECTING OLDPROPS key:`, propKey);
            // For all other deleted properties we add it to the queue. We use
            // the whitelist in the commit phase instead.
            (updatePayload = updatePayload || []).push(propKey, null);
        }
    }

    // console.log(`[diffProperties] updatePayload as of lastProp`, updatePayload);

    for (propKey in nextProps) {
        const nextProp = nextProps[propKey];
        const lastProp = lastProps != null ? lastProps[propKey] : undefined;
        if (
            !nextProps.hasOwnProperty(propKey) ||
            nextProp === lastProp ||
            (nextProp == null && lastProp == null)
        ) {
            // console.log(`[diffProperties] skipping on nextProps key:`, propKey); 
            continue;
        }
        if (propKey === STYLE) {
            if ((global as any).__DEV__) {
                if (nextProp) {
                    // Freeze the next style object so that we can assume it won't be
                    // mutated. We have already warned for this in the past.
                    Object.freeze(nextProp);
                }
            }
            if (lastProp) {
                // Unset styles on `lastProp` but not on `nextProp`.
                for (styleName in lastProp) {
                    if (
                        lastProp.hasOwnProperty(styleName) &&
                        (!nextProp || !nextProp.hasOwnProperty(styleName))
                    ) {
                        if (!styleUpdates) {
                            styleUpdates = {};
                        }
                        styleUpdates[styleName] = '';
                    }
                }
                // Update styles that changed since `lastProp`.
                for (styleName in nextProp) {
                    if (
                        nextProp.hasOwnProperty(styleName) &&
                        lastProp[styleName] !== nextProp[styleName]
                    ) {
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
                    updatePayload.push(propKey, styleUpdates);
                }
                styleUpdates = nextProp;
            }
        // } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
        //     const nextHtml = nextProp ? nextProp[HTML] : undefined;
        //     const lastHtml = lastProp ? lastProp[HTML] : undefined;
        //     if (nextHtml != null) {
        //         if (lastHtml !== nextHtml) {
        //             (updatePayload = updatePayload || []).push(propKey, '' + nextHtml);
        //         }
        //     } else {
        //         // TODO: It might be too late to clear this if we have children
        //         // inserted already.
        //     }
        } else if (propKey === CHILDREN) {
            // console.log(`[diffProperties] got propKey === CHILDREN.`);
            // console.log(`[diffProperties] lastProp`, lastProp);
            // console.log(`[diffProperties] nextProp`, nextProp);
            if (
                lastProp !== nextProp &&
                (typeof nextProp === 'string' || typeof nextProp === 'number')
            ) {
                (updatePayload = updatePayload || []).push(propKey, '' + nextProp);
            } else {
                // console.log(`[diffProperties] not pushing for propKey === CHILDREN.`);
            }
        } else if (
            propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
            propKey === SUPPRESS_HYDRATION_WARNING
        ) {
            // Noop
        // } else if (registrationNameModules.hasOwnProperty(propKey)) {
        //     if (nextProp != null) {
        //         // We eagerly listen to this even though we haven't committed yet.
        //         if (__DEV__ && typeof nextProp !== 'function') {
        //             warnForInvalidEventListener(propKey, nextProp);
        //         }
        //         ensureListeningTo(rootContainerElement, propKey);
        //     }
        //     if (!updatePayload && lastProp !== nextProp) {
        //         // This is a special case. If any listener updates we need to ensure
        //         // that the "current" props pointer gets updated so we need a commit
        //         // to update this element.
        //         updatePayload = [];
        //     }
        } else {
            // console.log(`[diffProperties] INSPECTING NEWPROPS key and nextProp`, propKey, nextProp);
            // For any other property we always add it to the queue and then we
            // filter it out using the whitelist during the commit.
            (updatePayload = updatePayload || []).push(propKey, nextProp);
        }
    }
    if (styleUpdates) {
        // if (__DEV__) {
        //     validateShorthandPropertyCollisionInDev(styleUpdates, nextProps[STYLE]);
        // }
        (updatePayload = updatePayload || []).push(STYLE, styleUpdates);
    }
    // console.log(`[diffProperties] updatePayload as of nextProp:`, updatePayload);
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
    // if (
    //     tag === 'input' &&
    //     nextRawProps.type === 'radio' &&
    //     nextRawProps.name != null
    // ) {
    //     ReactDOMInputUpdateChecked(instance, nextRawProps);
    // }

    /* More relevant to HTML. */
    // const wasCustomComponentTag = isCustomComponent(tag, lastRawProps);
    // const isCustomComponentTag = isCustomComponent(tag, nextRawProps);

    // Apply the diff.
    updateDOMProperties(
        instance,
        updatePayload,
        false,
        false,
        hostContext
    );

    /* TODO: I Won't be implementing these for now. */
    // switch (tag) {
    //     case 'input':
    //         // Update the wrapper around inputs *after* updating props. This has to
    //         // happen after `updateDOMProperties`. Otherwise HTML5 input validations
    //         // raise warnings and prevent the new value from being assigned.
    //         ReactDOMInputUpdateWrapper(instance, nextRawProps);
    //         break;
    //     case 'textarea':
    //         ReactDOMTextareaUpdateWrapper(instance, nextRawProps);
    //         break;
    //     case 'select':
    //         // <select> value update needs to occur after <option> children
    //         // reconciliation
    //         ReactDOMSelectPostUpdateWrapper(instance, nextRawProps);
    //         break;
    // }
}