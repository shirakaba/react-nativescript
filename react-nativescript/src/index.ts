/**
 * Code in here referenced from: https://github.com/gaearon/react/blob/1c7af862246e24574540f05c459f5fac0fad7086/src/renderers/dom/fiber/ReactDOMFiberEntry.js which carries the following copyright:
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * They have since moved to a MIT-style licence, which is reproduced in /LICENSE.
 */
import { ActionBarAttributes, ActionItemAttributes, ActivityIndicatorAttributes, ButtonAttributes, ContentViewAttributes, DatePickerAttributes, FormattedStringAttributes, SpanAttributes, HtmlViewAttributes, ImageAttributes, LabelAttributes, AbsoluteLayoutAttributes, DockLayoutAttributes, FlexboxLayoutAttributes, GridLayoutAttributes, StackLayoutAttributes, WrapLayoutAttributes, ListPickerAttributes, ListViewAttributes, NavigationButtonAttributes, PlaceholderAttributes, ProgressAttributes, ScrollViewAttributes, SearchBarAttributes, SegmentedBarAttributes, SegmentedBarItemAttributes, SliderAttributes, SwitchAttributes, TabViewAttributes, TabViewItemAttributes, TextViewAttributes, TextFieldAttributes, TimePickerAttributes, WebViewAttributes, FrameAttributes, PageAttributes } from "./lib/react-nativescript-jsx";
import { ActionBar, ActionItem, ActivityIndicator, Button, ContentView, DatePicker, HtmlView, Label, AbsoluteLayout, DockLayout, FlexboxLayout, GridLayout, StackLayout, WrapLayout, ListPicker, ListView, NavigationButton, Placeholder, Progress, ScrollView, SearchBar, SegmentedBar, Slider, Switch, TabView, TabViewItem, TextView, TextField, TimePicker, Frame, Page, FormattedString, SegmentedBarItem, Span, Image, WebView, View, Application } from "@nativescript/core";
import { NativeScriptProps } from "./shared/NativeScriptJSXTypings";
import * as ReactReconciler from "react-reconciler";
import * as React from "react";
import { ReactPortal, createElement, createRef } from "react";
import * as console from "./shared/Logger";
const { run, hasLaunched, getRootView } = Application;
import { reactReconcilerInst } from "./client/HostConfig";
import { Container } from "./shared/HostConfigTypes";
import { createPortal as _createPortal } from "./client/ReactPortal";
import { NSVRoot } from "./nativescript-vue-next/runtime/nodes";

// declare global {
//     var __DEV__: boolean|undefined;
// }

// declare let __DEV__: boolean|undefined;

// https://blog.atulr.com/react-custom-renderer-1/
export function createPortal(
    children: ReactReconciler.ReactNodeList,
    // ReactFabric passes in a containerTag rather than a container; hope it can figure out how to re-use a root when the container is null :/
    container: Container,
    key: string | null = null
): ReactPortal {
    // invariant(
    //   isValidContainer(container),
    //   'Target container is not a DOM element.',
    // );
    // TODO (from Facebook): pass ReactDOM portal implementation as third argument
    const portal = _createPortal(children, container, null, key);
    // console.log(`Created portal:`, portal);
    return portal;
}

type RootKey = Container | string | null;
const roots = new Map<RootKey, ReactReconciler.FiberRoot>();

/**
 * React NativeScript can render into any container that extends View,
 * but it makes sense to use the Frame > Page model if your whole app
 * (rather than a portion of it) will be described using React NativeScript.
 *
 * @param reactElement - Your <App/> component.
 * @param domElement - Your root component; typically Page, but can be any View. Accepts null for a detached tree.
 * @param callback - A callback to run after the component (typically <App/>) is rendered.
 * @param containerTag - A unique key by which to keep track of the root (useful when the domElement is null).
 * 'roots' with reference to: https://github.com/facebook/react/blob/ef4ac42f8893afd0240d2679db7438f1b599bbd4/packages/react-native-renderer/src/ReactFabric.js#L119
 * @returns a ref to the container.
 */
export function render(
    reactElement: ReactReconciler.ReactNodeList,
    domElement: Container | null,
    callback: () => void | null | undefined = () => undefined,
    containerTag: string | null = null
) {
    const key: RootKey = containerTag || domElement;
    let root: ReactReconciler.FiberRoot = roots.get(key);
    if (!root) {
        root = reactReconcilerInst.createContainer(domElement, false, false);
        roots.set(key, root);
    }

    reactReconcilerInst.updateContainer(reactElement, root, null, callback);

    return reactReconcilerInst.getPublicRootInstance(root);
}

// https://github.com/facebook/react/blob/61f62246c8cfb76a4a19d1661eeaa5822ec37b36/packages/react-native-renderer/src/ReactNativeRenderer.js#L139
/**
 * Calls removeChildFromContainer() to make the container remove its immediate child.
 * If said container is null (i.e. a detached tree), note that null.removeChild() doesn't exist, so it's a no-op.
 * Either way, it'll delete our reference to the root and thus should remove the React association from it.
 * @param containerTag - the key uniquely identifying this root (either the container itself, or a string).
 */
export function unmountComponentAtNode(containerTag: RootKey): void {
    const root: ReactReconciler.FiberRoot = roots.get(containerTag);
    if (!root) return;
    // TODO (from FB): Is it safe to reset this now or should I wait since this unmount could be deferred?
    reactReconcilerInst.updateContainer(null, root, null, () => {
        roots.delete(containerTag);
    });
}

/*
 * https://github.com/reduxjs/react-redux/issues/1392
 * https://github.com/facebook/react/blob/b15bf36750ca4c4a5a09f2de76c5315ded1258d0/packages/react-native-renderer/src/ReactNativeRenderer.js#L230
 */
export const unstable_batchedUpdates = reactReconcilerInst.batchedUpdates;

/**
 * Convenience function to start your React NativeScript app.
 * This should be placed as the final line of your app.ts file, as no
 * code will run after it (at least on iOS).
 *
 * @param app - Your <App/> component.
 */
export function start(app: ReactReconciler.ReactNodeList): void {
    const existingRootView: View | undefined = getRootView();
    const _hasLaunched: boolean = hasLaunched();
    console.log(
        `[ReactNativeScript.ts] start(). hasLaunched(): ${_hasLaunched} existing rootView was: ${existingRootView}`
    );
    if (_hasLaunched || existingRootView) {
        console.log(`[ReactNativeScript.ts] start() called again - hot reload, so shall no-op`);

        /* As typings say, indeed reloadPage() doesn't exist. Maybe it's just a Vue thing. */
        // if(existingRootView instanceof Frame){
        //     console.log(`[renderIntoRootView] hot reload: calling reloadPage() on root frame`);
        //     if(existingRootView.currentPage){
        //         (existingRootView as any).reloadPage();
        //     }
        // }
        return;
    }

    run({
        create: () => {
            const root = new NSVRoot();
            render(app, root, () => console.log(`Container updated!`), "__APP_ROOT__");

            return root.baseRef.nativeView as View;
        },
    });
}

declare global {
	module JSX {
		interface IntrinsicElements {
            absoluteLayout: NativeScriptProps<AbsoluteLayoutAttributes, AbsoluteLayout>,
            actionBar: NativeScriptProps<ActionBarAttributes, ActionBar>,
            actionItem: NativeScriptProps<ActionItemAttributes, ActionItem>,
            activityIndicator: NativeScriptProps<ActivityIndicatorAttributes, ActivityIndicator>,
            button: NativeScriptProps<ButtonAttributes, Button>,
            contentView: NativeScriptProps<ContentViewAttributes, ContentView>,
            datePicker: NativeScriptProps<DatePickerAttributes, DatePicker>,
            dockLayout: NativeScriptProps<DockLayoutAttributes, DockLayout>,
            flexboxLayout: NativeScriptProps<FlexboxLayoutAttributes, FlexboxLayout>,
            formattedString: NativeScriptProps<FormattedStringAttributes, FormattedString>,
            frame: NativeScriptProps<FrameAttributes, Frame>,
            gridLayout: NativeScriptProps<GridLayoutAttributes, GridLayout>,
            htmlView: NativeScriptProps<HtmlViewAttributes, HtmlView>,
            image: NativeScriptProps<ImageAttributes, Image>,
            label: NativeScriptProps<LabelAttributes, Label>,
            listPicker: NativeScriptProps<ListPickerAttributes, ListPicker>,
            listView: NativeScriptProps<ListViewAttributes, ListView>,
            navigationButton: NativeScriptProps<NavigationButtonAttributes, NavigationButton>,
            page: NativeScriptProps<PageAttributes, Page>,
            placeholder: NativeScriptProps<PlaceholderAttributes, Placeholder>,
            progress: NativeScriptProps<ProgressAttributes, Progress>,
            scrollView: NativeScriptProps<ScrollViewAttributes, ScrollView>,
            searchBar: NativeScriptProps<SearchBarAttributes, SearchBar>,
            segmentedBar: NativeScriptProps<SegmentedBarAttributes, SegmentedBar>,
            segmentedBarItem: NativeScriptProps<SegmentedBarItemAttributes, SegmentedBarItem>,
            slider: NativeScriptProps<SliderAttributes, Slider>,
            span: NativeScriptProps<SpanAttributes, Span>,
            stackLayout: NativeScriptProps<StackLayoutAttributes, StackLayout>,
            switch: NativeScriptProps<SwitchAttributes, Switch>,
            tabView: NativeScriptProps<TabViewAttributes, TabView>,
            tabViewItem: NativeScriptProps<TabViewItemAttributes, TabViewItem>,
            textField: NativeScriptProps<TextFieldAttributes, TextField>,
            textView: NativeScriptProps<TextViewAttributes, TextView>,
            timePicker: NativeScriptProps<TimePickerAttributes, TimePicker>,
            webView: NativeScriptProps<WebViewAttributes, WebView>,
            wrapLayout: NativeScriptProps<WrapLayoutAttributes, WrapLayout>,
		}

		interface ElementChildrenAttribute {
			children: {};
		}
	}
}