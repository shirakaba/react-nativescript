import {
    ActionBar,
    TNSElements,
    elementMap,
    ConcreteViewConstructor,
    ContentView,
    GridLayout,
    LayoutBase,
    Page,
    TextBase,
    TextView,
    View,
    ViewBase,
    TabView,
    TabViewItem,
    SegmentedBar,
    ScrollView,
    ActionItem,
    NavigationButton,
} from "../client/ElementRegistry";

export type Type = TNSElements | React.JSXElementConstructor<any>;
export type Props = any;
export type Container = View; // The root node of the app. Typically Frame, but View is more flexible.
/* Of which only LayoutBase|ContentView can take child Views (e.g. TextBase can't, but CAN take child texts; and there are special cases like ActionBar). */
export type Instance = ViewBase;
export type TextInstance = TextBase;
export type HydratableInstance = any;
export type PublicInstance = any;
export type HostContext = {
    isInAParentText: boolean;
    isInADockLayout: boolean;
    isInAGridLayout: boolean;
    isInAnAbsoluteLayout: boolean;
    isInAFlexboxLayout: boolean;
};
export type InstanceCreator = (
    type: Type,
    props: Props,
    rootContainerInstance: Container,
    hostContext: HostContext,
) => Instance;