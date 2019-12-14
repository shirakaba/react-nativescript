/**
 * Code in here referenced from: https://github.com/gaearon/react/blob/1c7af862246e24574540f05c459f5fac0fad7086/src/renderers/dom/fiber/ReactDOMFiberEntry.js which carries the following copyright:
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * They have since moved to a MIT-style licence, which is reproduced in React-LICENSE.txt.
 */

import * as ReactReconciler from "react-reconciler";
import { reactReconcilerInst } from "./HostConfig";
import { Container } from "../shared/HostConfigTypes";
import * as React from "react";
import { ReactPortal, createElement, createRef } from "react";
import { createPortal as _createPortal } from "./ReactPortal";
import { run, hasLaunched, getRootView } from "tns-core-modules/application";
import { Frame, Page, TabView, View, ContentView, ProxyViewContainer } from "../client/ElementRegistry";
import { AbsoluteLayout as $AbsoluteLayout } from "../components/AbsoluteLayout";
import { ActionBar as $ActionBar } from "../components/ActionBar";
import { ActionItem as $ActionItem } from "../components/ActionItem";
import { Button as $Button } from "../components/Button";
import { Frame as $Frame } from "../components/Frame";
import { ActivityIndicator as $ActivityIndicator } from "../components/ActivityIndicator";
import { DatePicker as $DatePicker } from "../components/DatePicker";
import { ScrollView as $ScrollView } from "../components/ScrollView";
import { SearchBar as $SearchBar } from "../components/SearchBar";
import { SegmentedBar as $SegmentedBar } from "../components/SegmentedBar";
import { SegmentedBarItem as $SegmentedBarItem } from "../components/SegmentedBarItem";
import { Slider as $Slider } from "../components/Slider";
import { DockLayout as $DockLayout } from "../components/DockLayout";
import { FlexboxLayout as $FlexboxLayout } from "../components/FlexboxLayout";
import { FormattedString as $FormattedString } from "../components/FormattedString";
import { Span as $Span } from "../components/Span";
import { GridLayout as $GridLayout } from "../components/GridLayout";
import { HtmlView as $HtmlView } from "../components/HtmlView";
import { Label as $Label } from "../components/Label";
import { ListView as $ListView } from "../components/ListView";
import { ListPicker as $ListPicker } from "../components/ListPicker";
// import { Portal as $Portal } from "../components/Portal";
import { NavigationButton as $NavigationButton } from "../components/NavigationButton";
import { Placeholder as $Placeholder } from "../components/Placeholder";
import { Progress as $Progress } from "../components/Progress";
import { StackLayout as $StackLayout } from "../components/StackLayout";
import { Switch as $Switch } from "../components/Switch";
import { TextField as $TextField } from "../components/TextField";
import { TextView as $TextView } from "../components/TextView";
import { TabView as $TabView } from "../components/TabView";
import { TabViewItem as $TabViewItem } from "../components/TabViewItem";
import { TimePicker as $TimePicker } from "../components/TimePicker";
import { ContentView as $ContentView } from "../components/ContentView";
import { WebView as $WebView } from "../components/WebView";
import { WrapLayout as $WrapLayout } from "../components/WrapLayout";
import { Page as $Page } from "../components/Page";
import { Image as $Image } from "../components/Image";
import * as console from "../shared/Logger";

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
 * @param refToApp - ref to the root element of <App/>.
 *
 * You can create a ref like so:
 *   const refToApp: React.RefObject<any> = React.createRef<any>();
 */
export function start(app: ReactReconciler.ReactNodeList, refToApp: React.RefObject<View>): void {
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
            render(app, null, () => console.log(`Container updated!`), "__APP_ROOT__");

            return refToApp.current;
        },
    });
}

export {
    // $Dialogs,
    // $Gestures,
    $AbsoluteLayout,
    $ActionBar,
    $ActionItem,
    $ActivityIndicator,
    $Button,
    $ContentView,
    $DatePicker,
    $DockLayout,
    $FlexboxLayout,
    $FormattedString,
    $Frame,
    $GridLayout,
    $HtmlView,
    $Image,
    $Label,
    $ListView,
    $ListPicker,
    $NavigationButton,
    $Page,
    $Placeholder,
    $Progress,
    $ScrollView,
    $SearchBar,
    $SegmentedBar,
    $SegmentedBarItem,
    $Slider,
    $Span,
    $StackLayout,
    $Switch,
    $TabView,
    $TabViewItem,
    $TextField,
    $TextView,
    $TimePicker,
    $WebView,
    $WrapLayout,
};
