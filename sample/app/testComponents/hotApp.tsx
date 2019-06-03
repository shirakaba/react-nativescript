import { hot } from 'react-nativescript-hot-loader/root';
import * as React from "react";

import { Frame, Page, StackLayout, ProxyViewContainer, ContentView, View, TabView } from "react-nativescript/dist/client/ElementRegistry";
import { DockLayoutTest, HMRTest } from './layout';
import { FormattedStringLabel } from "./testComponents";
import { GestureLoggingTest, PanGestureTest, PageGestureTest, StatefulPageGestureTest, StatefulPageGestureTest2 } from "./gestures";
import { GameLoopTest } from "./stateful";
import { NestedHub, NestedModalTest, HubTest, FramedHubTest, SimpleHub, ActionBarTest, TabViewTest, FrameTest, FramedLayoutTest } from "./navigation";
import { SpriteKitGameTest } from "./spriteKitGame";
import { ListViewTest, DynamicListViewWithImages } from "./list";
import { RCTContentView, RCTStackLayout, RCTLabel, RCTFlexboxLayout, RCTButton } from 'react-nativescript';
import { RNTesterFramed } from '../RNTester/components/RNTesterFramed';
const RNTesterApp = require('../RNTester/RNTesterApp').RNTesterApp;

export const rootRef = React.createRef<any>();

// const app = () => (
//     <RCTFlexboxLayout flexDirection={"row"} height={40} backgroundColor={"purple"}>
//         <RCTFlexboxLayout
//             backgroundColor={"green"}
//             flexDirection={"column"}
//             flexGrow={1}
//             paddingTop={7}
//             // position={"absolute"}
//             alignItems={"center"}
//         >
//             <RCTLabel text={"LABEL"}/>
//         </RCTFlexboxLayout>
//         <RCTFlexboxLayout
//             backgroundColor={"blue"}
//             flexDirection={"column"}
//         >
//             <RCTButton text={"BUTTON"} className={""}/>
//         </RCTFlexboxLayout>
//         {/* <RCTButton text={"BUTTON"} className={""}/> */}
//     </RCTFlexboxLayout>
// );

// const app = () => <FramedLayoutTest forwardedRef={rootRef}/>
// const app = () => <FramedHubTest forwardedRef={rootRef}/>
// const app = () => <HubTest forwardedRef={rootRef}/>
// const app = () => <RNTesterApp exampleFromAppetizeParams={`rntester://example/${"Button"}Example`}/>
const app = () => <RNTesterFramed forwardedRef={rootRef}/>

// const app = () => (
//     <RCTContentView ref={rootRef}>
//         <RNTesterApp exampleFromAppetizeParams={`rntester://example/${"Button"}Example`}/>
//     </RCTContentView>
// );
export default hot(app);