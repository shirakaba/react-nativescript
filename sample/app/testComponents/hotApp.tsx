// if((module as any).hot) {
//     console.log(`module as any hot is true.`);
//     (module as any).hot.accept(
//         ['./list', './layout'],
//         function() {
//             // Do something with the updated library module...
//         }
//     );
// }

import { hot } from 'react-hot-loader';
import * as React from "react";

import { Frame, Page, StackLayout, ProxyViewContainer, ContentView, View, TabView } from "react-nativescript/dist/client/ElementRegistry";
import { DockLayoutTest, HMRTest } from './layout';
import { FormattedStringLabel } from "./testComponents";
import { GestureLoggingTest, PanGestureTest, PageGestureTest, StatefulPageGestureTest, StatefulPageGestureTest2 } from "./gestures";
import { GameLoopTest } from "./stateful";
import { NestedHub, NestedModalTest, HubTest, SimpleHub, ActionBarTest, TabViewTest, FrameTest } from "./navigation";
import { SpriteKitGameTest } from "./spriteKitGame";
import { ListViewTest, DynamicListViewWithImages } from "./list";

export const rootRef = React.createRef<any>();
const app = () => <HubTest forwardedRef={rootRef}/>

export default hot(module)(app);