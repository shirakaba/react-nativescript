import { hot } from 'react-hot-loader/root';
import * as React from "react";

import { Frame, Page, StackLayout, ProxyViewContainer, ContentView, View, TabView } from "react-nativescript/dist/client/ElementRegistry";
import { DockLayoutTest, HMRTest } from './layout';
import { FormattedStringLabel } from "./testComponents";
import { GestureLoggingTest, PanGestureTest, PageGestureTest, StatefulPageGestureTest, StatefulPageGestureTest2 } from "./gestures";
import { GameLoopTest } from "./stateful";
import { NestedHub, NestedModalTest, HubTest, FramedHubTest, SimpleHub, ActionBarTest, TabViewTest, FrameTest, FramedLayoutTest } from "./navigation";
import { SpriteKitGameTest } from "./spriteKitGame";
import { ListViewTest, DynamicListViewWithImages } from "./list";
import { RCTContentView } from 'react-nativescript';

export const rootRef = React.createRef<any>();

// const app = () => <FramedLayoutTest forwardedRef={rootRef}/>
const app = () => <FramedHubTest forwardedRef={rootRef}/>
// const app = () => <HubTest forwardedRef={rootRef}/>
// const app = () => <DockLayoutTest/>
// const app = () => (
//     <RCTContentView ref={rootRef}>
//         <DockLayoutTest/>
//     </RCTContentView>
// );
export default hot(app);