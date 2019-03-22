import { Page } from "tns-core-modules/ui/page";
import { View } from "tns-core-modules/ui/core/view";
import { ContentView } from "tns-core-modules/ui/content-view";
import { ActionBar } from "tns-core-modules/ui/action-bar/action-bar";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator/activity-indicator";
import { Animation } from "tns-core-modules/ui/animation/animation";
import { Button } from "tns-core-modules/ui/button/button";
import { DatePicker } from "tns-core-modules/ui/date-picker/date-picker";
// import { Dialogs } from "tns-core-modules/ui/dialogs/dialogs";
import { EditableTextBase } from "tns-core-modules/ui/editable-text-base/editable-text-base";
import { Frame } from "tns-core-modules/ui/frame/frame";
// import { Gestures } from "tns-core-modules/ui/gestures/gestures";
import { HtmlView } from "tns-core-modules/ui/html-view/html-view";
import { Image } from "tns-core-modules/ui/image/image";
import { Cache } from "tns-core-modules/ui/image-cache/image-cache";
import { Label } from "tns-core-modules/ui/label/label";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { AbsoluteLayout } from "tns-core-modules/ui/layouts/absolute-layout/absolute-layout";
import { DockLayout } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";
import { FlexboxLayout } from "tns-core-modules/ui/layouts/flexbox-layout/flexbox-layout";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { WrapLayout } from "tns-core-modules/ui/layouts/wrap-layout/wrap-layout";
import { ListPicker } from "tns-core-modules/ui/list-picker/list-picker";
import { ListView } from "tns-core-modules/ui/list-view/list-view";
import { Placeholder } from "tns-core-modules/ui/placeholder/placeholder";
import { Progress } from "tns-core-modules/ui/progress/progress";
import { ProxyViewContainer } from "tns-core-modules/ui/proxy-view-container/proxy-view-container";
import { Repeater } from "tns-core-modules/ui/repeater/repeater";
import { ScrollView } from "tns-core-modules/ui/scroll-view/scroll-view";
import { SearchBar } from "tns-core-modules/ui/search-bar/search-bar";
import { SegmentedBar } from "tns-core-modules/ui/segmented-bar/segmented-bar";
import { Slider } from "tns-core-modules/ui/slider/slider";
import { Switch } from "tns-core-modules/ui/switch/switch";
import { TabView } from "tns-core-modules/ui/tab-view/tab-view";
import { TextView } from "tns-core-modules/ui/text-view/text-view";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { TextField } from "tns-core-modules/ui/text-field/text-field";
import { TimePicker } from "tns-core-modules/ui/time-picker/time-picker";
import { Transition } from "tns-core-modules/ui/transition/transition";
import { FadeTransition } from "tns-core-modules/ui/transition/fade-transition";
import { FlipTransition } from "tns-core-modules/ui/transition/flip-transition";
import { SlideTransition } from "tns-core-modules/ui/transition/slide-transition";
import { WebView } from "tns-core-modules/ui/web-view/web-view";

// type AnyConcreteView = ConcreteView<any>;
// type ConcreteView<T extends View> = T;

// https://stackoverflow.com/questions/36886082/abstract-constructor-type-in-typescript
export type ConcreteViewConstructor = new (...args: any[]) => View;

export type TNSElements = keyof typeof elementMap;
// export const elementMap: Record<string, typeof View> = {
export const elementMap: Record<string, ConcreteViewConstructor> = {
    "ActionBar": ActionBar,
    "ActivityIndicator": ActivityIndicator,
    // "Animation": Animation,
    // Border
    // Builder,
    "Button": Button,
    "ContentView": ContentView,
    "DatePicker": DatePicker,
    // "Dialogs": Dialogs, // No components in here.
    "EditableTextBase": EditableTextBase,
    "HtmlView": HtmlView,
    "Image": Image,
    // "Cache": Cache, // Observable.observable, but doesn't extend View.
    "Label": Label,
    "LayoutBase": LayoutBase,
    "AbsoluteLayout": AbsoluteLayout,
    "DockLayout": DockLayout,
    "FlexboxLayout": FlexboxLayout,
    "StackLayout": StackLayout,
    "WrapLayout": WrapLayout,
    "ListPicker": ListPicker,
    "ListView": ListView,
    "Placeholder": Placeholder,
    "Progress": Progress,
    "ProxyViewContainer": ProxyViewContainer,
    "Repeater": Repeater,
    "ScrollView": ScrollView,
    "SearchBar": SearchBar,
    "SegmentedBar": SegmentedBar,
    "Slider": Slider,
    "Switch": Switch,
    "TabView": TabView,
    "TextView": TextView,
    "TextBase": TextBase,
    "TextField": TextField,
    "TimePicker": TimePicker,
    // "Transition": Transition,
    // "FadeTransition": FadeTransition,
    // "FlipTransition": FlipTransition,
    // "SlideTransition": SlideTransition,
    "WebView": WebView,
    // There's a whole "styling" folder, but nothing is a component.
    "Frame": Frame,
    // "View": View,
    "Page": Page
};