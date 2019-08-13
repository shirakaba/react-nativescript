import * as React from "react";
import { Frame, Page, StackLayout, ProxyViewContainer, ContentView, View, TabView } from "react-nativescript/dist/client/ElementRegistry";
import { DockLayoutTest, HMRTest } from './layout';
import { FormattedStringLabel, WebViewTest, SegmentedBarIssue, } from "./testComponents";
import { GestureLoggingTest, PanGestureTest, PageGestureTest, StatefulPageGestureTest, StatefulPageGestureTest2 } from "./gestures";
import { GameLoopTest, SwitchTest, SliderTest, TimePickerTest, DatePickerTest, ListPickerTest } from "./stateful";
import { NestedHub, NestedModalTest, FramedHubTest, FramedPageWithComplexActionBarTest, SimpleHub, ActionBarTest, TabViewTest, FrameTest, FramedLayoutTest } from "./navigation";
import { SpriteKitGameTest } from "./spriteKitGame";
import { ListViewTest, DynamicListViewWithImages } from "./list";
import { $TabView, $TabViewItem, $ContentView, $StackLayout, $Label, $FlexboxLayout, $Button } from 'react-nativescript';

export const rootRef: React.RefObject<any> = React.createRef<any>();

// const AppContainer = () => (
//     <$FlexboxLayout flexDirection={"row"} height={40} backgroundColor={"purple"}>
//         <$FlexboxLayout
//             backgroundColor={"green"}
//             flexDirection={"column"}
//             flexGrow={1}
//             paddingTop={7}
//             // position={"absolute"}
//             alignItems={"center"}
//         >
//             <$Label text={"LABEL"}/>
//         </$FlexboxLayout>
//         <$FlexboxLayout
//             backgroundColor={"blue"}
//             flexDirection={"column"}
//         >
//             <$Button text={"BUTTON"} className={""}/>
//         </$FlexboxLayout>
//         {/* <$Button text={"BUTTON"} className={""}/> */}
//     </$FlexboxLayout>
// );

// const AppContainer = () => <FramedLayoutTest forwardedRef={rootRef}/>
// const AppContainer = () => <FramedHubTest forwardedRef={rootRef}/>
// const AppContainer = () => <WebViewTest forwardedRef={rootRef}/>
// const AppContainer = () => <$StackLayout ref={rootRef}><DatePickerTest/></$StackLayout>

// const AppContainer = () => (
//     <FramedPageWithComplexActionBarTest forwardedRef={rootRef}>
//         <$StackLayout backgroundColor={"orange"}>
//             <$Label>Hello, World!</$Label>
//         </$StackLayout>
//     </FramedPageWithComplexActionBarTest>
// );

// See the testComponents directory for many examples of components (and ref-forwarding).
// const AppContainer = () => (
//     // Do NOT forget to pass in this rootRef, otherwise your app will crash on startup! :)
//     <$TabView ref={rootRef} selectedIndex={0}>
//         <$TabViewItem title={"One"}>
//             <$StackLayout height={{ value: 100, unit: "%"}} width={{ value: 100, unit: "%"}}>
//                 <$Label>Uno</$Label>
//             </$StackLayout>
//         </$TabViewItem>
//         <$TabViewItem title={"Two"}>
//             <$StackLayout height={{ value: 100, unit: "%"}} width={{ value: 100, unit: "%"}}>
//                 <$Label>Dos</$Label>
//             </$StackLayout>
//         </$TabViewItem>
//     </$TabView>
// );

const AppContainer = () => (
    <SegmentedBarIssue forwardedRef={rootRef}/>
);

export default AppContainer;