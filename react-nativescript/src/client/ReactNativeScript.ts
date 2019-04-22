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

import * as ReactReconciler from 'react-reconciler';
import { reactReconcilerInst, Container } from "./HostConfig";
import * as React from "react";
import { ReactPortal, createElement, createRef } from "react";
import { createPortal as _createPortal } from './ReactPortal';
import { run } from "tns-core-modules/application";
import { Frame, Page, TabView, View, ContentView, ProxyViewContainer } from "../client/ElementRegistry";
import { AbsoluteLayout as AbsoluteLayoutComponent } from "../components/AbsoluteLayout";
import { ActionBar as ActionBarComponent } from "../components/ActionBar";
import { Button as ButtonComponent } from "../components/Button";
import { DockLayout as DockLayoutComponent } from "../components/DockLayout";
import { FlexboxLayout as FlexboxLayoutComponent } from "../components/FlexboxLayout";
import { GridLayout as GridLayoutComponent } from "../components/GridLayout";
import { HtmlView as HtmlViewComponent } from "../components/HtmlView";
import { Label as LabelComponent } from "../components/Label";
import { ListView as ListViewComponent } from "../components/ListView";
import { ListViewCell as ListViewCellComponent } from "../components/ListViewCell";
// import { Portal as PortalComponent } from "../components/Portal";
import { StackLayout as StackLayoutComponent } from "../components/StackLayout";
import { TextField as TextFieldComponent } from "../components/TextField";
import { TextView as TextViewComponent } from "../components/TextView";
import { TabView as TabViewComponent } from "../components/TabView";
import { TabViewItem as TabViewItemComponent } from "../components/TabViewItem";
import { ContentView as ContentViewComponent } from "../components/ContentView";
import { WebView as WebViewComponent } from "../components/WebView";
import { WrapLayout as WrapLayoutComponent } from "../components/WrapLayout";
import { Page as PageComponent } from "../components/Page";

// declare global {
//     var __DEV__: boolean|undefined;
// }

(global as any).__DEV__ = false;

// https://blog.atulr.com/react-custom-renderer-1/
export function createPortal(
    children: ReactReconciler.ReactNodeList,
    container: Container,
    key: string|null = null,
): ReactPortal {
    // invariant(
    //   isValidContainer(container),
    //   'Target container is not a DOM element.',
    // );
    // TODO (from Facebook): pass ReactDOM portal implementation as third argument
    const portal = _createPortal(children, container, key);
    // console.log(`Created portal:`, portal);
    return portal;
}

/**
 * React NativeScript can render into any container that extends View,
 * but it makes sense to use the Frame > Page model if your whole app
 * (rather than a portion of it) will be described using React NativeScript.
 * 
 * @param reactElement - Your <App/> component.
 * @param domElement - Your root component; typically Page, but can be any View.
 * @param callback - A callback to run after the component (typically <App/>) is rendered.
 */
export function render(
    reactElement: ReactReconciler.ReactNodeList,
    domElement: Container,
    callback: () => void|null|undefined = () => undefined
){
    // console.log("Creating container from domElement", domElement);
    const container = reactReconcilerInst.createContainer(domElement, false, false);

    return reactReconcilerInst.updateContainer(
        reactElement,
        container,
        null,
        callback
    );
}

/**
 * Convenience function to start your React NativeScript app.
 * This should be placed as the final line of your app.ts file, as no
 * code will run after it (at least on iOS).
 * 
 *  
 * @param app - Your <App/> component.
 * @param frame - The top frame for your NativeScript app (optional).
 * @param page - A custom Page for your NativeScript app (optional).
 */
export function startWithFrame(
    app: ReactReconciler.ReactNodeList,
    frame: Frame = new Frame(),
    // page: Page = new Page(),
    refToPage: React.RefObject<Page>
): void {
    run({
        create: () => {
            frame.navigate({
                create: () => {
                    console.log(`[frame.navigate() -> create()] Rendering app. refToPage.current:`, refToPage.current);

                    render(
                        app,
                        /* Any view would do here - ProxyViewContainer is not being used for anything clever;
                         * I prevent the HostConfig from calling appendChild() when the child is a Page. */
                        new ProxyViewContainer(),
                        () => {
                            console.log(`Container updated!`);
                        }
                    );

                    console.log(`render() hopefully complete; refToPage.current:`, refToPage.current);

                    return refToPage.current;
                }
            });

            return frame;
        }
    });
}

/**
 * Convenience function to start your React NativeScript app.
 * This should be placed as the final line of your app.ts file, as no
 * code will run after it (at least on iOS).
 * 
 *  
 * @param app - Your <App/> component.
 * @param rootView - The root view for your NativeScript app
 */
export function startWithView(
    app: ReactReconciler.ReactNodeList,
    rootView: View = new ContentView(),
): void {
    if(
        !(rootView instanceof TabView || rootView instanceof Frame)
    ){
        console.warn(
            `Support for root view components other than Frame or TabView is limited.`
        );
    }

    run({
        create: () => {
            render(
                app,
                rootView,
                () => {
                    console.log(`Container updated!`);
                }
            );

            return rootView;
        }
    });
}

export {
    AbsoluteLayoutComponent as AbsoluteLayout,
    ActionBarComponent as ActionBar,
    ButtonComponent as Button,
    // DialogsComponent as Dialogs,
    DockLayoutComponent as DockLayout,
    FlexboxLayoutComponent as FlexboxLayout,
    // GesturesComponent as Gestures,
    GridLayoutComponent as GridLayout,
    HtmlViewComponent as HtmlView,
    LabelComponent as Label,
    ListViewComponent as ListView,
    PageComponent as Page,
    StackLayoutComponent as StackLayout,
    TabViewComponent as TabView,
    TabViewItemComponent as TabViewItem,
    TextFieldComponent as TextField,
    TextViewComponent as TextView,
    ContentViewComponent as ContentView,
    WebViewComponent as WebView,
    WrapLayoutComponent as WrapLayout,
};
