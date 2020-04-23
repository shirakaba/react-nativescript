import { hot } from 'react-hot-loader/root';
import * as React from "react";
import { Frame, Page, StackLayout, ContentView, View, TabView } from "react-nativescript/dist/client/ElementRegistry";
import { DockLayoutTest, HMRTest } from './layout';
import { FormattedStringLabel, WebViewTest, SegmentedBarIssue, } from "./testComponents";
import { GestureLoggingTest, PanGestureTest, PageGestureTest, StatefulPageGestureTest, StatefulPageGestureTest2 } from "./gestures";
import { GameLoopTest, SwitchTest, SliderTest, TimePickerTest, DatePickerTest, ListPickerTest } from "./stateful";
import { NestedHub, NestedModalTest, FramedHubTest, FramedPageWithComplexActionBarTest, SimpleHub, ActionBarTest, TabViewTest, FrameTest, FramedLayoutTest } from "./navigation";
import { SpriteKitGameTest } from "./spriteKitGame";
import { ListViewTest, DynamicListViewWithImages } from "./list";
import { DeletePropFromScrollViewTest } from "./propDeletion";
import { FormattedStringTest } from './text';

export const rootRef: React.RefObject<any> = React.createRef<any>();

// const AppContainer = () => (
//     <flexboxLayout flexDirection={"row"} height={40} backgroundColor={"purple"}>
//         <flexboxLayout
//             backgroundColor={"green"}
//             flexDirection={"column"}
//             flexGrow={1}
//             paddingTop={7}
//             // position={"absolute"}
//             alignItems={"center"}
//         >
//             <label text={"LABEL"}/>
//         </flexboxLayout>
//         <flexboxLayout
//             backgroundColor={"blue"}
//             flexDirection={"column"}
//         >
//             <button text={"BUTTON"} className={""}/>
//         </flexboxLayout>
//         {/* <button text={"BUTTON"} className={""}/> */}
//     </flexboxLayout>
// );

// const AppContainer = () => <FramedLayoutTest forwardedRef={rootRef}/>
// const AppContainer = () => <FramedHubTest forwardedRef={rootRef}/>
// const AppContainer = () => <WebViewTest forwardedRef={rootRef}/>
// const AppContainer = () => <stackLayout ref={rootRef}><DatePickerTest/></stackLayout>

// const AppContainer = () => (
//     <FramedPageWithComplexActionBarTest forwardedRef={rootRef}>
//         <stackLayout backgroundColor={"orange"}>
//             <label>Hello, World!</label>
//         </stackLayout>
//     </FramedPageWithComplexActionBarTest>
// );

// const AppContainer = () => (
//     <SegmentedBarIssue forwardedRef={rootRef}/>
// );

/* See the testComponents directory for many examples of components (and ref-forwarding). */
// const AppContainer = () => (
//     // Do NOT forget to pass in this rootRef, otherwise your app will crash on startup! :)
//     <tabView ref={rootRef} selectedIndex={0}>
//         <tabViewItem title={"One"}>
//             <stackLayout height={{ value: 100, unit: "%"}} width={{ value: 100, unit: "%"}}>
//                 <label>Uno</label>
//             </stackLayout>
//         </tabViewItem>
//         <tabViewItem title={"Two"}>
//             <stackLayout height={{ value: 100, unit: "%"}} width={{ value: 100, unit: "%"}}>
//                 <label>Dos</label>
//             </stackLayout>
//         </tabViewItem>
//     </tabView>
// );

const AppContainer = () => (
    <FormattedStringTest forwardedRef={rootRef}/>
);

export default hot(AppContainer);
// export default AppContainer;