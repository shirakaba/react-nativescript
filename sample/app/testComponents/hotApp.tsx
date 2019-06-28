import { hot } from 'react-nativescript-hot-loader/root';
import * as React from "react";

import { Frame, Page, StackLayout, ProxyViewContainer, ContentView, View, TabView } from "react-nativescript/dist/client/ElementRegistry";
import { DockLayoutTest, HMRTest } from './layout';
import { FormattedStringLabel } from "./testComponents";
import { GestureLoggingTest, PanGestureTest, PageGestureTest, StatefulPageGestureTest, StatefulPageGestureTest2 } from "./gestures";
import { GameLoopTest, SwitchTest, SliderTest, TimePickerTest } from "./stateful";
import { NestedHub, NestedModalTest, FramedHubTest, SimpleHub, ActionBarTest, TabViewTest, FrameTest, FramedLayoutTest } from "./navigation";
import { SpriteKitGameTest } from "./spriteKitGame";
import { ListViewTest, DynamicListViewWithImages } from "./list";
import { $ContentView, $StackLayout, $Label, $FlexboxLayout, $Button } from 'react-nativescript';

export const rootRef: React.RefObject<any> = React.createRef<any>();

// const app = () => (
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

// const app = () => <FramedLayoutTest forwardedRef={rootRef}/>
// const app = () => <FramedHubTest forwardedRef={rootRef}/>
// const app = () => <FramedHubTest forwardedRef={rootRef}/>
const app = () => <$StackLayout ref={rootRef}><SliderTest/></$StackLayout>

export default hot(app);