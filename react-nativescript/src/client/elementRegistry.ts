import { AbsoluteLayout } from "tns-core-modules/ui/layouts/absolute-layout/absolute-layout";
import { ActionBar, ActionItem, NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator/activity-indicator";
import { Animation } from "tns-core-modules/ui/animation/animation";
import { Button } from "tns-core-modules/ui/button/button";
import { Cache } from "tns-core-modules/ui/image-cache/image-cache";
import { Color } from "tns-core-modules/color/color";
import { ContainerView } from "tns-core-modules/ui/core/view/view";
import { ContentView } from "tns-core-modules/ui/content-view";
import { DatePicker } from "tns-core-modules/ui/date-picker/date-picker";
// import { Dialogs } from "tns-core-modules/ui/dialogs/dialogs";
import { DockLayout } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";
import { EditableTextBase } from "tns-core-modules/ui/editable-text-base/editable-text-base";
import { FadeTransition } from "tns-core-modules/ui/transition/fade-transition";
import { FlexboxLayout } from "tns-core-modules/ui/layouts/flexbox-layout/flexbox-layout";
// import { FlipTransition } from "tns-core-modules/ui/transition/flip-transition";
import { Frame } from "tns-core-modules/ui/frame/frame";
// import { Gestures } from "tns-core-modules/ui/gestures/gestures";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { HtmlView } from "tns-core-modules/ui/html-view/html-view";
import { Image } from "tns-core-modules/ui/image/image";
import { Label } from "tns-core-modules/ui/label/label";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { ListPicker } from "tns-core-modules/ui/list-picker/list-picker";
import { ListView } from "tns-core-modules/ui/list-view/list-view";
import { Observable } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Placeholder } from "tns-core-modules/ui/placeholder/placeholder";
import { Progress } from "tns-core-modules/ui/progress/progress";
import { ProxyViewContainer } from "tns-core-modules/ui/proxy-view-container/proxy-view-container";
import { Repeater } from "tns-core-modules/ui/repeater/repeater";
import { ScrollView } from "tns-core-modules/ui/scroll-view/scroll-view";
import { SearchBar } from "tns-core-modules/ui/search-bar/search-bar";
import { SegmentedBar, SegmentedBarItem } from "tns-core-modules/ui/segmented-bar/segmented-bar";
import { Slider } from "tns-core-modules/ui/slider/slider";
import { SlideTransition } from "tns-core-modules/ui/transition/slide-transition";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { Style } from "tns-core-modules/ui/styling/style/style";
import { Switch } from "tns-core-modules/ui/switch/switch";
import { TabView, TabViewItem } from "tns-core-modules/ui/tab-view/tab-view";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { TextField } from "tns-core-modules/ui/text-field/text-field";
import { TextView } from "tns-core-modules/ui/text-view/text-view";
import { TimePicker } from "tns-core-modules/ui/time-picker/time-picker";
import { Transition } from "tns-core-modules/ui/transition/transition";
import { View } from "tns-core-modules/ui/core/view";
import { ViewBase } from "tns-core-modules/ui/core/view-base/view-base";
import { WebView } from "tns-core-modules/ui/web-view/web-view";
import { WrapLayout } from "tns-core-modules/ui/layouts/wrap-layout/wrap-layout";
import * as console from "../shared/Logger";
import { Instance, Type, Props, Container, HostContext, InstanceCreator } from "../shared/HostConfigTypes";
import { RNSFriendlySegmentedBar } from "../components/SegmentedBar";
import { RNSFriendlyFormattedString } from "../components/FormattedString";
import { Span } from "tns-core-modules/text/span";

// type AnyConcreteView = ConcreteView<any>;
// type ConcreteView<T extends View> = T;

// https://stackoverflow.com/questions/36886082/abstract-constructor-type-in-typescript
export type ConcreteViewConstructor = new (...args: any[]) => View | ViewBase;
export type ConcreteArglessViewConstructor = new () => View | ViewBase;

export type TNSElements = keyof typeof elementMap;
// const el: TNSElements =  "h9";
// export const elementMap: Record<string, typeof View> = {
// TODO: see Angular implementation: https://github.com/NativeScript/nativescript-angular/blob/master/nativescript-angular/element-registry.ts#L179

// FIXME: provide list of keys (TNSElements) without losing type-safety of Record<string, ConcreteViewConstructor>.
export const elementMap: Record<string, InstanceCreator> = {
    // export const elementMap = {
    actionBar: () => new ActionBar(), // √
    actionItem: () => new ActionItem(), // √
    activityIndicator: () => new ActivityIndicator(), // √
    // "animation": () => new Animation(),
    // "border": () => new Border()
    // "builder": () => new Builder(),
    button: () => new Button(), // √ Pending event listeners.
    contentView: () => new ContentView(), // √ Pending event listeners.
    datePicker: () => new DatePicker(), // √
    formattedString: () => new RNSFriendlyFormattedString(), // This one is special! It's an example of the new CustomNodeHierarchyManager pattern.
    span: () => new Span(), // √
    // "dialogs": () => new Dialogs(), // No components in here.
    // "editableTextBase": () => new EditableTextBase(),
    htmlView: () => new HtmlView(), // √
    image: () => new Image(), // √
    // "cache": () => new Cache(), // Observable.observable, but doesn't extend View.
    label: () => new Label(), // √
    // "layoutBase": () => new LayoutBase(), // ? A concrete class, but not sure whether you can use it as a view in practice...
    absoluteLayout: () => new AbsoluteLayout(), // √
    dockLayout: () => new DockLayout(), // √
    flexboxLayout: () => new FlexboxLayout(), // √
    gridLayout: () => new GridLayout(), // √
    stackLayout: () => new StackLayout(), // √
    wrapLayout: () => new WrapLayout(), // √
    listPicker: () => new ListPicker(), // √
    listView: () => new ListView(), // √
    navigationButton: () => new NavigationButton(), // √
    placeholder: () => new Placeholder(), // √
    progress: () => new Progress(), // √
    proxyViewContainer: () => new ProxyViewContainer(),
    // "repeater": () => new Repeater(), // Doesn't translate to React properly. Just use a regular LayoutBase instead
    scrollView: () => new ScrollView(), // √
    searchBar: () => new SearchBar(), // √
    segmentedBar: () => new RNSFriendlySegmentedBar(), // This one is special! It's an example of the new CustomNodeHierarchyManager pattern.
    segmentedBarItem: () => new SegmentedBarItem(),
    slider: () => new Slider(), // √
    switch: () => new Switch(), // √
    tabView: () => new TabView(), // √
    tabViewItem: () => new TabViewItem(), // √
    textView: () => new TextView(), // √
    // "textBase": () => new TextBase(), // ? A concrete class, but not sure whether you can use it as a view in practice...
    textField: () => new TextField(), // √
    timePicker: () => new TimePicker(), // √
    // "transition": () => new Transition(),
    // "fadeTransition": () => new FadeTransition(),
    // "flipTransition": () => new FlipTransition(),
    // "slideTransition": () => new SlideTransition(),
    webView: () => new WebView(), // √ Pending event listeners.
    // There's a whole "styling" folder, but nothing is a component.
    frame: () => new Frame(), // √
    // "view": () => new View(),
    page: () => new Page(), // √
};

export function register(key: string, instanceCreator: InstanceCreator): void {
    const incumbent = elementMap[key];
    if (incumbent) {
        // No-op; registration may simply happen as a side-effect each time the module is imported.
        return;
    } else {
        elementMap[key] = instanceCreator;
    }
}

export {
    AbsoluteLayout,
    ActionBar,
    ActionItem,
    ActivityIndicator,
    Animation,
    Button,
    Cache,
    Color,
    ContentView,
    ContainerView,
    DatePicker,
    // Dialogs,
    DockLayout,
    EditableTextBase,
    FadeTransition,
    FlexboxLayout,
    // FlipTransition,
    Frame,
    // Gestures,
    GridLayout,
    HtmlView,
    Image,
    Label,
    LayoutBase,
    ListPicker,
    ListView,
    NavigationButton,
    Observable,
    Page,
    Placeholder,
    Progress,
    ProxyViewContainer,
    Repeater,
    ScrollView,
    SearchBar,
    SegmentedBar,
    Slider,
    SlideTransition,
    StackLayout,
    Switch,
    Style,
    TabView,
    TabViewItem,
    TextBase,
    TextField,
    TextView,
    TimePicker,
    Transition,
    View,
    ViewBase,
    WebView,
    WrapLayout,
};
