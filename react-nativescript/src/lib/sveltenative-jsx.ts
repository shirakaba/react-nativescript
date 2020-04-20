/**
 * Modified from David Perhouse's sveltenative-jsx.d.ts, commit `6512cc3` on 20th April 2020.
 * 
 * @see https://github.com/halfnelson/nativescript-source-to-jsx-def/blob/6512cc3c24655e241d7920c7f6c47a5d8332dcd2/sveltenative-jsx.d.ts
 */
type View = import("@nativescript/core/ui/core/view/view").View;
type NavigationButton = import("@nativescript/core/ui/action-bar/action-bar").NavigationButton;
type ActionItems = import("@nativescript/core/ui/action-bar/action-bar").ActionItems;
type AndroidActionBarSettings = import("@nativescript/core/ui/action-bar/action-bar").AndroidActionBarSettings;
type PropertyChangeData = import("@nativescript/core/data/observable/observable").PropertyChangeData;
type ActionBarCommonActionItems = import("@nativescript/core/ui/action-bar/action-bar-common").ActionItems;
type LengthDipUnit = import("@nativescript/core/ui/styling/style-properties").LengthDipUnit;
type LengthPxUnit = import("@nativescript/core/ui/styling/style-properties").LengthPxUnit;
type Color = import("@nativescript/core/color/color").Color;
type LinearGradient = import("@nativescript/core/ui/styling/gradient").LinearGradient;
type LengthPercentUnit = import("@nativescript/core/ui/styling/style-properties").LengthPercentUnit;
// type DoubleTapGestureEventData = import("@nativescript/core/ui/gestures/gestures").DoubleTapGestureEventData;
type PinchGestureEventData = import("@nativescript/core/ui/gestures/gestures").PinchGestureEventData;
type PanGestureEventData = import("@nativescript/core/ui/gestures/gestures").PanGestureEventData;
type SwipeGestureEventData = import("@nativescript/core/ui/gestures/gestures").SwipeGestureEventData;
type RotationGestureEventData = import("@nativescript/core/ui/gestures/gestures").RotationGestureEventData;
type GestureEventData = import("@nativescript/core/ui/gestures/gestures").GestureEventData;
type TouchGestureEventData = import("@nativescript/core/ui/gestures/gestures").TouchGestureEventData;
type EventData = import("@nativescript/core/data/observable/observable").EventData;
type ShownModallyData = import("@nativescript/core/ui/core/view/view").ShownModallyData;
type DOMNode = import("@nativescript/core/debugger/dom-node").DOMNode;
type ViewBase = import("@nativescript/core/ui/core/view-base/view-base").ViewBase;
type Page = import("@nativescript/core/ui/page/page").Page;
type Style = import("@nativescript/core/ui/styling/style/style").Style;
type ActionBar = import("@nativescript/core/ui/action-bar/action-bar").ActionBar;
type IOSActionItemSettings = import("@nativescript/core/ui/action-bar/action-bar").IOSActionItemSettings;
type AndroidActionItemSettings = import("@nativescript/core/ui/action-bar/action-bar").AndroidActionItemSettings;
type TabContentItem = import("@nativescript/core/ui/tab-navigation-base/tab-content-item/tab-content-item").TabContentItem;
type TabStrip = import("@nativescript/core/ui/tab-navigation-base/tab-strip/tab-strip").TabStrip;
type SelectedIndexChangedEventData = import("@nativescript/core/ui/bottom-navigation/bottom-navigation").SelectedIndexChangedEventData;
type TabNavigationBaseSelectedIndexChangedEventData = import("@nativescript/core/ui/tab-navigation-base/tab-navigation-base/tab-navigation-base").SelectedIndexChangedEventData;
type FormattedString = import("@nativescript/core/ui/text-base/formatted-string").FormattedString;
type BackstackEntry = import("@nativescript/core/ui/frame/frame").BackstackEntry;
type NavigationEntry = import("@nativescript/core/ui/frame/frame").NavigationEntry;
type NavigationTransition = import("@nativescript/core/ui/frame/frame").NavigationTransition;
type AndroidFrame = import("@nativescript/core/ui/frame/frame").AndroidFrame;
type iOSFrame = import("@nativescript/core/ui/frame/frame").iOSFrame;
type FrameInterfacesNavigationTransition = import("@nativescript/core/ui/frame/frame-interfaces").NavigationTransition;
type FrameInterfacesBackstackEntry = import("@nativescript/core/ui/frame/frame-interfaces").BackstackEntry;
type FrameInterfacesNavigationEntry = import("@nativescript/core/ui/frame/frame-interfaces").NavigationEntry;
type ImageSource = import("@nativescript/core/image-source/image-source").ImageSource;
type ItemsSource = import("@nativescript/core/ui/list-picker/list-picker").ItemsSource;
type ListViewItemsSource = import("@nativescript/core/ui/list-view/list-view").ItemsSource;
type Template = import("@nativescript/core/ui/core/view/view").Template;
type KeyedTemplate = import("@nativescript/core/ui/core/view/view").KeyedTemplate;
type ItemEventData = import("@nativescript/core/ui/list-view/list-view").ItemEventData;
type Frame = import("@nativescript/core/ui/frame/frame").Frame;
type NavigatedData = import("@nativescript/core/ui/page/page").NavigatedData;
type CreateViewEventData = import("@nativescript/core/ui/placeholder/placeholder").CreateViewEventData;
type ScrollEventData = import("@nativescript/core/ui/scroll-view/scroll-view").ScrollEventData;
type SegmentedBarItem = import("@nativescript/core/ui/segmented-bar/segmented-bar").SegmentedBarItem;
type SegmentedBarSelectedIndexChangedEventData = import("@nativescript/core/ui/segmented-bar/segmented-bar").SelectedIndexChangedEventData;
type TabViewItem = import("@nativescript/core/ui/tab-view/tab-view").TabViewItem;
type TabViewSelectedIndexChangedEventData = import("@nativescript/core/ui/tab-view/tab-view").SelectedIndexChangedEventData;
type LoadEventData = import("@nativescript/core/ui/web-view/web-view").LoadEventData;
type TabStripItem = import("@nativescript/core/ui/tab-navigation-base/tab-strip-item/tab-strip-item").TabStripItem;
type TabStripItemEventData = import("@nativescript/core/ui/tab-navigation-base/tab-strip/tab-strip").TabStripItemEventData;
type Label = import("@nativescript/core/ui/label/label").Label;
type Image = import("@nativescript/core/ui/image/image").Image;

// ui/action-bar/action-bar.d.ts
export type ActionBarAttributes =  ViewAttributes & {
    actionItems: ActionItems;
    android: AndroidActionBarSettings;
    androidContentInset: string | number | LengthDipUnit | LengthPxUnit;
    androidContentInsetLeft: number | "auto" | LengthDipUnit | LengthPxUnit;
    androidContentInsetRight: number | "auto" | LengthDipUnit | LengthPxUnit;
    effectiveContentInsetLeft: number;
    effectiveContentInsetRight: number;
    flat: string | false | true;
    ios: any;
    iosIconRenderingMode: "automatic" | "alwaysOriginal" | "alwaysTemplate";
    navigationButton: NavigationButton;
    onFlatChange: (args: PropertyChangeData) => void;
    onIosIconRenderingModeChange: (args: PropertyChangeData) => void;
    onTitleChange: (args: PropertyChangeData) => void;
    title: string;
    titleView: View;
};

// ui/core/view/view.d.ts
export type ViewAttributes =  ViewBaseAttributes & {
    android: any;
    androidDynamicElevationOffset: number;
    androidElevation: number;
    automationText: string;
    background: string;
    backgroundColor: string | Color;
    backgroundImage: string | LinearGradient;
    bindingContext: any;
    borderBottomColor: Color;
    borderBottomLeftRadius: number | "auto" | LengthDipUnit | LengthPxUnit;
    borderBottomRightRadius: number | "auto" | LengthDipUnit | LengthPxUnit;
    borderBottomWidth: number | "auto" | LengthDipUnit | LengthPxUnit;
    borderColor: string | Color;
    borderLeftColor: Color;
    borderLeftWidth: number | "auto" | LengthDipUnit | LengthPxUnit;
    borderRadius: string | number | LengthDipUnit | LengthPxUnit;
    borderRightColor: Color;
    borderRightWidth: number | "auto" | LengthDipUnit | LengthPxUnit;
    borderTopColor: Color;
    borderTopLeftRadius: number | "auto" | LengthDipUnit | LengthPxUnit;
    borderTopRightRadius: number | "auto" | LengthDipUnit | LengthPxUnit;
    borderTopWidth: number | "auto" | LengthDipUnit | LengthPxUnit;
    borderWidth: string | number | LengthDipUnit | LengthPxUnit;
    color: Color;
    column: string | number;
    columnSpan: string | number;
    css: string;
    cssClasses: Set<string>;
    cssPseudoClasses: Set<string>;
    cssType: string;
    dock: "left" | "top" | "right" | "bottom";
    height: number | "auto" | LengthDipUnit | LengthPxUnit | LengthPercentUnit;
    horizontalAlignment: "left" | "right" | "center" | "stretch";
    ios: any;
    iosOverflowSafeArea: false | true;
    iosOverflowSafeAreaEnabled: false | true;
    isEnabled: false | true;
    isLayoutRequired: false | true;
    isLayoutValid: false | true;
    isUserInteractionEnabled: false | true;
    left: string | number | "auto" | LengthDipUnit | LengthPxUnit;
    margin: string | number | LengthDipUnit | LengthPxUnit | LengthPercentUnit;
    marginBottom: number | "auto" | LengthDipUnit | LengthPxUnit | LengthPercentUnit;
    marginLeft: number | "auto" | LengthDipUnit | LengthPxUnit | LengthPercentUnit;
    marginRight: number | "auto" | LengthDipUnit | LengthPxUnit | LengthPercentUnit;
    marginTop: number | "auto" | LengthDipUnit | LengthPxUnit | LengthPercentUnit;
    minHeight: number | "auto" | LengthDipUnit | LengthPxUnit;
    minWidth: number | "auto" | LengthDipUnit | LengthPxUnit;
    modal: View;
    onAndroidBackPressed: (args: EventData) => void;
    onColumnChange: (args: PropertyChangeData) => void;
    onColumnSpanChange: (args: PropertyChangeData) => void;
    onDockChange: (args: PropertyChangeData) => void;
    onDoubleTap: (arg: GestureEventData) => any;
    onLeftChange: (args: PropertyChangeData) => void;
    onLoaded: (args: EventData) => void;
    onLongPress: (arg: GestureEventData) => any;
    onPan: (arg: PanGestureEventData) => any;
    onPinch: (arg: PinchGestureEventData) => any;
    onRotation: (arg: RotationGestureEventData) => any;
    onRowChange: (args: PropertyChangeData) => void;
    onRowSpanChange: (args: PropertyChangeData) => void;
    onShowingModally: (args: ShownModallyData) => void;
    onShownModally: (args: ShownModallyData) => void;
    onSwipe: (arg: SwipeGestureEventData) => any;
    onTap: (arg: GestureEventData) => any;
    onTopChange: (args: PropertyChangeData) => void;
    onTouch: (arg: TouchGestureEventData) => any;
    onUnloaded: (args: EventData) => void;
    opacity: number;
    originX: number;
    originY: number;
    perspective: number;
    rotate: number;
    rotateX: number;
    rotateY: number;
    row: string | number;
    rowSpan: string | number;
    scaleX: number;
    scaleY: number;
    top: string | number | "auto" | LengthDipUnit | LengthPxUnit;
    translateX: number;
    translateY: number;
    verticalAlignment: "top" | "bottom" | "stretch" | "middle";
    visibility: "visible" | "hidden" | "collapse";
    width: number | "auto" | LengthDipUnit | LengthPxUnit | LengthPercentUnit;
};

// ui/core/view-base/view-base.d.ts
export type ViewBaseAttributes =  ObservableAttributes & {
    alignSelf: "auto" | "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
    android: any;
    automationText: string;
    bindingContext: string | any;
    className: string;
    col: number;
    colSpan: number;
    column: number;
    columnSpan: number;
    cssClasses: Set<string>;
    cssPseudoClasses: Set<string>;
    dock: "left" | "top" | "right" | "bottom";
    domNode: DOMNode;
    effectiveBorderBottomWidth: number;
    effectiveBorderLeftWidth: number;
    effectiveBorderRightWidth: number;
    effectiveBorderTopWidth: number;
    effectiveHeight: number;
    effectiveLeft: number;
    effectiveMarginBottom: number;
    effectiveMarginLeft: number;
    effectiveMarginRight: number;
    effectiveMarginTop: number;
    effectiveMinHeight: number;
    effectiveMinWidth: number;
    effectivePaddingBottom: number;
    effectivePaddingLeft: number;
    effectivePaddingRight: number;
    effectivePaddingTop: number;
    effectiveTop: number;
    effectiveWidth: number;
    flexGrow: number;
    flexShrink: number;
    flexWrapBefore: false | true;
    id: string;
    ios: any;
    iosOverflowSafeArea: string | false | true;
    iosOverflowSafeAreaEnabled: string | false | true;
    isCollapsed: false | true;
    isEnabled: string | false | true;
    isLoaded: false | true;
    isUserInteractionEnabled: string | false | true;
    left: number | "auto" | LengthDipUnit | LengthPxUnit;
    nativeView: any;
    onAutomationTextChange: (args: PropertyChangeData) => void;
    onBindingContextChange: (args: PropertyChangeData) => void;
    onClassNameChange: (args: PropertyChangeData) => void;
    onIdChange: (args: PropertyChangeData) => void;
    onIosOverflowSafeAreaChange: (args: PropertyChangeData) => void;
    onIosOverflowSafeAreaEnabledChange: (args: PropertyChangeData) => void;
    onIsEnabledChange: (args: PropertyChangeData) => void;
    onIsUserInteractionEnabledChange: (args: PropertyChangeData) => void;
    onOriginXChange: (args: PropertyChangeData) => void;
    onOriginYChange: (args: PropertyChangeData) => void;
    order: number;
    originX: string | number;
    originY: string | number;
    page: Page;
    parent: ViewBase;
    parentNode: ViewBase;
    recycleNativeView: "always" | "never" | "auto";
    row: number;
    rowSpan: number;
    style: Style;
    top: number | "auto" | LengthDipUnit | LengthPxUnit;
    typeName: string;
    viewController: any;
};

// data/observable/observable.d.ts
type ObservableAttributes =  {
    onPropertyChange: (data: EventData) => void;
};

// ui/action-bar/action-bar.d.ts
export type ActionItemAttributes =  ViewBaseAttributes & {
    actionBar: ActionBar;
    actionView: View;
    android: AndroidActionItemSettings;
    icon: string;
    ios: IOSActionItemSettings;
    onIconChange: (args: PropertyChangeData) => void;
    onTap: (args: EventData) => void;
    onTextChange: (args: PropertyChangeData) => void;
    onVisibilityChange: (args: PropertyChangeData) => void;
    text: string;
    visibility: string;
};

// ui/action-bar/action-bar.d.ts
export type NavigationButtonAttributes =  ActionItemAttributes & {

};

// ui/activity-indicator/activity-indicator.d.ts
export type ActivityIndicatorAttributes =  ViewAttributes & {
    android: any;
    busy: string | false | true;
    ios: any;
    onBusyChange: (args: PropertyChangeData) => void;
};

// ui/border/border.d.ts
export type BorderAttributes =  ContentViewAttributes & {
    cornerRadius: number;
};

// ui/content-view/content-view.d.ts
export type ContentViewAttributes =  ViewAttributes & {
    content: View;
    layoutView: View;
};

// ui/bottom-navigation/bottom-navigation.d.ts
export type BottomNavigationAttributes =  TabNavigationBaseAttributes & {
    android: any;
    ios: any;
    items: TabContentItem[];
    onSelectedIndexChanged: (args: SelectedIndexChangedEventData) => void;
    selectedIndex: number;
    tabStrip: TabStrip;
};

// ui/tab-navigation-base/tab-navigation-base/tab-navigation-base.d.ts
export type TabNavigationBaseAttributes =  ViewAttributes & {
    android: any;
    ios: any;
    items: string | TabContentItem[];
    onItemsChange: (args: PropertyChangeData) => void;
    onSelectedIndexChange: (args: PropertyChangeData) => void;
    onSelectedIndexChanged: (args: TabNavigationBaseSelectedIndexChangedEventData) => void;
    onTabStripChange: (args: PropertyChangeData) => void;
    selectedIndex: string | number;
    tabStrip: string | TabStrip;
};

// ui/button/button.d.ts
export type ButtonAttributes =  TextBaseAttributes & {
    android: any;
    ios: any;
    onTap: (args: EventData) => void;
    textWrap: false | true;
};

// ui/text-base/text-base.d.ts
export type TextBaseAttributes =  ViewAttributes & {
    fontSize: number;
    formattedText: string | FormattedString;
    letterSpacing: number;
    lineHeight: number;
    onFormattedTextChange: (args: PropertyChangeData) => void;
    onTextChange: (args: PropertyChangeData) => void;
    padding: string | number | LengthDipUnit | LengthPxUnit;
    paddingBottom: number | "auto" | LengthDipUnit | LengthPxUnit;
    paddingLeft: number | "auto" | LengthDipUnit | LengthPxUnit;
    paddingRight: number | "auto" | LengthDipUnit | LengthPxUnit;
    paddingTop: number | "auto" | LengthDipUnit | LengthPxUnit;
    text: string;
    textAlignment: "left" | "right" | "center" | "initial";
    textDecoration: "none" | "underline" | "line-through" | "underline line-through";
    textTransform: "none" | "initial" | "capitalize" | "uppercase" | "lowercase";
    whiteSpace: "initial" | "normal" | "nowrap";
};

// ui/date-picker/date-picker.d.ts
export type DatePickerAttributes =  ViewAttributes & {
    android: any;
    date: string | Date;
    day: string | number;
    ios: any;
    maxDate: string | Date;
    minDate: string | Date;
    month: string | number;
    onDateChange: (args: PropertyChangeData) => void;
    onDayChange: (args: PropertyChangeData) => void;
    onMaxDateChange: (args: PropertyChangeData) => void;
    onMinDateChange: (args: PropertyChangeData) => void;
    onMonthChange: (args: PropertyChangeData) => void;
    onYearChange: (args: PropertyChangeData) => void;
    year: string | number;
};

// ui/frame/frame.d.ts
export type FrameAttributes =  ViewAttributes & {
    actionBarVisibility: "always" | "never" | "auto";
    android: AndroidFrame;
    animated: false | true;
    backStack: BackstackEntry[];
    currentEntry: NavigationEntry;
    currentPage: Page;
    defaultPage: string;
    ios: iOSFrame;
    navigationBarHeight: number;
    onActionBarVisibilityChange: (args: PropertyChangeData) => void;
    onDefaultPageChange: (args: PropertyChangeData) => void;
    transition: NavigationTransition;
};

// ui/html-view/html-view.d.ts
export type HtmlViewAttributes =  ViewAttributes & {
    android: any;
    html: string;
    ios: any;
    onHtmlChange: (args: PropertyChangeData) => void;
};

// ui/image/image.d.ts
export type ImageAttributes =  ViewAttributes & {
    android: any;
    decodeHeight: string | number | "auto" | LengthDipUnit | LengthPxUnit;
    decodeWidth: string | number | "auto" | LengthDipUnit | LengthPxUnit;
    imageSource: string | ImageSource;
    ios: any;
    isLoading: string | false | true;
    loadMode: "sync" | "async";
    onDecodeHeightChange: (args: PropertyChangeData) => void;
    onDecodeWidthChange: (args: PropertyChangeData) => void;
    onImageSourceChange: (args: PropertyChangeData) => void;
    onIsLoadingChange: (args: PropertyChangeData) => void;
    onLoadModeChange: (args: PropertyChangeData) => void;
    onSrcChange: (args: PropertyChangeData) => void;
    onStretchChange: (args: PropertyChangeData) => void;
    src: string | any;
    stretch: "none" | "aspectFill" | "aspectFit" | "fill";
    tintColor: Color;
};

// ui/label/label.d.ts
export type LabelAttributes =  TextBaseAttributes & {
    android: any;
    ios: any;
    textWrap: false | true;
};

// ui/list-picker/list-picker.d.ts
export type ListPickerAttributes =  ViewAttributes & {
    android: any;
    ios: any;
    isItemsSource: false | true;
    items: string | any[] | ItemsSource;
    onItemsChange: (args: PropertyChangeData) => void;
    onSelectedIndexChange: (args: PropertyChangeData) => void;
    onSelectedValueChange: (args: PropertyChangeData) => void;
    onTextFieldChange: (args: PropertyChangeData) => void;
    onValueFieldChange: (args: PropertyChangeData) => void;
    selectedIndex: string | number;
    selectedValue: string;
    textField: string;
    valueField: string;
};

// ui/list-view/list-view.d.ts
export type ListViewAttributes =  ViewAttributes & {
    android: any;
    ios: any;
    iosEstimatedRowHeight: string | number | "auto" | LengthDipUnit | LengthPxUnit;
    itemIdGenerator: (item: any, index: number, items: any) => number;
    itemTemplate: string | string | Template;
    itemTemplateSelector: string | ((item: any, index: number, items: any) => string);
    itemTemplates: string | string | KeyedTemplate[];
    items: string | any[] | ListViewItemsSource;
    onIosEstimatedRowHeightChange: (args: PropertyChangeData) => void;
    onItemLoading: (args: ItemEventData) => void;
    onItemTap: (args: ItemEventData) => void;
    onItemTemplateChange: (args: PropertyChangeData) => void;
    onItemTemplatesChange: (args: PropertyChangeData) => void;
    onItemsChange: (args: PropertyChangeData) => void;
    onLoadMoreItems: (args: EventData) => void;
    onRowHeightChange: (args: PropertyChangeData) => void;
    rowHeight: string | number | "auto" | LengthDipUnit | LengthPxUnit;
    separatorColor: Color;
};

// ui/page/page.d.ts
export type PageAttributes =  ContentViewAttributes & {
    actionBar: ActionBar;
    actionBarHidden: string | false | true;
    androidStatusBarBackground: Color;
    backgroundSpanUnderStatusBar: string | false | true;
    enableSwipeBackNavigation: string | false | true;
    frame: Frame;
    hasActionBar: false | true;
    navigationContext: any;
    onActionBarHiddenChange: (args: PropertyChangeData) => void;
    onBackgroundSpanUnderStatusBarChange: (args: PropertyChangeData) => void;
    onEnableSwipeBackNavigationChange: (args: PropertyChangeData) => void;
    onNavigatedFrom: (args: NavigatedData) => void;
    onNavigatedTo: (args: NavigatedData) => void;
    onNavigatingFrom: (args: NavigatedData) => void;
    onNavigatingTo: (args: NavigatedData) => void;
    page: Page;
    statusBarStyle: "light" | "dark";
};

// ui/placeholder/placeholder.d.ts
export type PlaceholderAttributes =  ViewAttributes & {
    onCreatingView: (args: CreateViewEventData) => void;
};

// ui/progress/progress.d.ts
export type ProgressAttributes =  ViewAttributes & {
    android: any;
    ios: any;
    maxValue: string | number;
    onMaxValueChange: (args: PropertyChangeData) => void;
    onValueChange: (args: PropertyChangeData) => void;
    value: string | number;
};

// ui/proxy-view-container/proxy-view-container.d.ts
export type ProxyViewContainerAttributes =  LayoutBaseAttributes & {
    onProxyChange: (args: PropertyChangeData) => void;
    proxy: string;
};

// ui/layouts/layout-base.d.ts
export type LayoutBaseAttributes =  CustomLayoutViewAttributes & {
    clipToBounds: string | false | true;
    isPassThroughParentEnabled: string | false | true;
    onClipToBoundsChange: (args: PropertyChangeData) => void;
    onIsPassThroughParentEnabledChange: (args: PropertyChangeData) => void;
    padding: string | number | LengthDipUnit | LengthPxUnit;
    paddingBottom: number | "auto" | LengthDipUnit | LengthPxUnit;
    paddingLeft: number | "auto" | LengthDipUnit | LengthPxUnit;
    paddingRight: number | "auto" | LengthDipUnit | LengthPxUnit;
    paddingTop: number | "auto" | LengthDipUnit | LengthPxUnit;
};

// ui/core/view/view.d.ts
export type CustomLayoutViewAttributes =  ContainerViewAttributes & {

};

// ui/core/view/view.d.ts
export type ContainerViewAttributes =  ViewAttributes & {
    iosOverflowSafeArea: false | true;
};

// ui/scroll-view/scroll-view.d.ts
export type ScrollViewAttributes =  ContentViewAttributes & {
    horizontalOffset: number;
    isScrollEnabled: string | false | true;
    onIsScrollEnabledChange: (args: PropertyChangeData) => void;
    onOrientationChange: (args: PropertyChangeData) => void;
    onScroll: (args: ScrollEventData) => void;
    onScrollBarIndicatorVisibleChange: (args: PropertyChangeData) => void;
    orientation: "horizontal" | "vertical";
    scrollBarIndicatorVisible: string | false | true;
    scrollableHeight: number;
    scrollableWidth: number;
    verticalOffset: number;
};

// ui/search-bar/search-bar.d.ts
export type SearchBarAttributes =  ViewAttributes & {
    android: any;
    hint: string;
    ios: any;
    onClose: (args: EventData) => void;
    onHintChange: (args: PropertyChangeData) => void;
    onSubmit: (args: EventData) => void;
    onTextChange: (args: PropertyChangeData) => void;
    onTextFieldBackgroundColorChange: (args: PropertyChangeData) => void;
    onTextFieldHintColorChange: (args: PropertyChangeData) => void;
    text: string;
    textFieldBackgroundColor: string | Color;
    textFieldHintColor: string | Color;
};

// ui/segmented-bar/segmented-bar.d.ts
export type SegmentedBarItemAttributes =  ViewBaseAttributes & {
    title: string;
};

// ui/segmented-bar/segmented-bar.d.ts
export type SegmentedBarAttributes =  ViewAttributes & {
    items: string | SegmentedBarItem[];
    onItemsChange: (args: PropertyChangeData) => void;
    onSelectedIndexChange: (args: PropertyChangeData) => void;
    onSelectedIndexChanged: (args: SegmentedBarSelectedIndexChangedEventData) => void;
    selectedBackgroundColor: Color;
    selectedIndex: string | number;
};

// ui/slider/slider.d.ts
export type SliderAttributes =  ViewAttributes & {
    android: any;
    ios: any;
    maxValue: string | number;
    minValue: string | number;
    onMaxValueChange: (args: PropertyChangeData) => void;
    onMinValueChange: (args: PropertyChangeData) => void;
    onValueChange: (args: PropertyChangeData) => void;
    value: string | number;
};

// ui/switch/switch.d.ts
export type SwitchAttributes =  ViewAttributes & {
    android: any;
    checked: string | false | true;
    ios: any;
    offBackgroundColor: string | Color;
    onCheckedChange: (args: PropertyChangeData) => void;
    onOffBackgroundColorChange: (args: PropertyChangeData) => void;
};

// ui/tab-view/tab-view.d.ts
export type TabViewItemAttributes =  ViewBaseAttributes & {
    canBeLoaded: false | true;
    iconSource: string;
    textTransform: "none" | "initial" | "capitalize" | "uppercase" | "lowercase";
    title: string;
    view: View;
};

// ui/tab-view/tab-view.d.ts
export type TabViewAttributes =  ViewAttributes & {
    android: any;
    androidOffscreenTabLimit: string | number;
    androidSelectedTabHighlightColor: Color;
    androidSwipeEnabled: string | false | true;
    androidTabsPosition: "top" | "bottom";
    ios: any;
    iosIconRenderingMode: "automatic" | "alwaysOriginal" | "alwaysTemplate";
    items: string | TabViewItem[];
    onAndroidOffscreenTabLimitChange: (args: PropertyChangeData) => void;
    onAndroidSwipeEnabledChange: (args: PropertyChangeData) => void;
    onAndroidTabsPositionChange: (args: PropertyChangeData) => void;
    onIosIconRenderingModeChange: (args: PropertyChangeData) => void;
    onItemsChange: (args: PropertyChangeData) => void;
    onSelectedIndexChange: (args: PropertyChangeData) => void;
    onSelectedIndexChanged: (args: TabViewSelectedIndexChangedEventData) => void;
    selectedIndex: string | number;
    selectedTabTextColor: Color;
    tabBackgroundColor: Color;
    tabTextColor: Color;
    tabTextFontSize: number;
};

// ui/tabs/tabs.d.ts
export type TabsAttributes =  TabNavigationBaseAttributes & {
    android: any;
    iOSTabBarItemsAlignment: "center" | "leading" | "justified" | "centerSelected";
    ios: any;
    items: TabContentItem[];
    offscreenTabLimit: string | number;
    onIOsTabBarItemsAlignmentChange: (args: PropertyChangeData) => void;
    onOffscreenTabLimitChange: (args: PropertyChangeData) => void;
    onSelectedIndexChanged: (args: TabNavigationBaseSelectedIndexChangedEventData) => void;
    onSwipeEnabledChange: (args: PropertyChangeData) => void;
    onTabsPositionChange: (args: PropertyChangeData) => void;
    selectedIndex: number;
    swipeEnabled: string | false | true;
    tabStrip: TabStrip;
    tabsPosition: "top" | "bottom";
};

// ui/text-field/text-field.d.ts
export type TextFieldAttributes =  EditableTextBaseAttributes & {
    android: any;
    ios: any;
    onSecureChange: (args: PropertyChangeData) => void;
    secure: string | false | true;
};

// ui/editable-text-base/editable-text-base.d.ts
export type EditableTextBaseAttributes =  TextBaseAttributes & {
    autocapitalizationType: "none" | "words" | "sentences" | "allcharacters";
    autocorrect: string | false | true;
    editable: string | false | true;
    hint: string;
    keyboardType: "number" | "datetime" | "phone" | "url" | "email" | "integer";
    maxLength: string | number;
    maxLines: string | number;
    onAutocapitalizationTypeChange: (args: PropertyChangeData) => void;
    onAutocorrectChange: (args: PropertyChangeData) => void;
    onEditableChange: (args: PropertyChangeData) => void;
    onHintChange: (args: PropertyChangeData) => void;
    onKeyboardTypeChange: (args: PropertyChangeData) => void;
    onMaxLengthChange: (args: PropertyChangeData) => void;
    onMaxLinesChange: (args: PropertyChangeData) => void;
    onReturnKeyTypeChange: (args: PropertyChangeData) => void;
    onUpdateTextTriggerChange: (args: PropertyChangeData) => void;
    returnKeyType: "done" | "next" | "go" | "search" | "send";
    updateTextTrigger: "focusLost" | "textChanged";
};

// ui/text-view/text-view.d.ts
export type TextViewAttributes =  EditableTextBaseAttributes & {
    android: any;
    ios: any;
    maxLines: number;
};

// ui/time-picker/time-picker.d.ts
export type TimePickerAttributes =  ViewAttributes & {
    android: any;
    hour: string | number;
    ios: any;
    maxHour: string | number;
    maxMinute: string | number;
    minHour: string | number;
    minMinute: string | number;
    minute: string | number;
    minuteInterval: string | number;
    onHourChange: (args: PropertyChangeData) => void;
    onMaxHourChange: (args: PropertyChangeData) => void;
    onMaxMinuteChange: (args: PropertyChangeData) => void;
    onMinHourChange: (args: PropertyChangeData) => void;
    onMinMinuteChange: (args: PropertyChangeData) => void;
    onMinuteChange: (args: PropertyChangeData) => void;
    onMinuteIntervalChange: (args: PropertyChangeData) => void;
    onTimeChange: (args: PropertyChangeData) => void;
    time: string | Date;
};

// ui/web-view/web-view.d.ts
export type WebViewAttributes =  ViewAttributes & {
    android: any;
    canGoBack: false | true;
    canGoForward: false | true;
    ios: any;
    onLoadFinished: (args: LoadEventData) => void;
    onLoadStarted: (args: LoadEventData) => void;
    src: string;
};

// ui/layouts/absolute-layout/absolute-layout.d.ts
export type AbsoluteLayoutAttributes =  LayoutBaseAttributes & {

};

// ui/layouts/dock-layout/dock-layout.d.ts
export type DockLayoutAttributes =  LayoutBaseAttributes & {
    onStretchLastChildChange: (args: PropertyChangeData) => void;
    stretchLastChild: string | false | true;
};

// ui/layouts/flexbox-layout/flexbox-layout.d.ts
export type FlexboxLayoutAttributes =  LayoutBaseAttributes & {
    alignContent: "flex-start" | "flex-end" | "center" | "stretch" | "space-between" | "space-around";
    alignItems: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
    flexDirection: "row" | "column" | "row-reverse" | "column-reverse";
    flexWrap: "nowrap" | "wrap" | "wrap-reverse";
    justifyContent: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
};

// ui/layouts/grid-layout/grid-layout.d.ts
export type GridLayoutAttributes =  LayoutBaseAttributes & {
    columns: string;
    rows: string;
};

// ui/layouts/stack-layout/stack-layout.d.ts
export type StackLayoutAttributes =  LayoutBaseAttributes & {
    onOrientationChange: (args: PropertyChangeData) => void;
    orientation: "horizontal" | "vertical";
};

// ui/layouts/wrap-layout/wrap-layout.d.ts
export type WrapLayoutAttributes =  LayoutBaseAttributes & {
    effectiveItemHeight: number;
    effectiveItemWidth: number;
    itemHeight: string | number | "auto" | LengthDipUnit | LengthPxUnit;
    itemWidth: string | number | "auto" | LengthDipUnit | LengthPxUnit;
    onItemHeightChange: (args: PropertyChangeData) => void;
    onItemWidthChange: (args: PropertyChangeData) => void;
    onOrientationChange: (args: PropertyChangeData) => void;
    orientation: "horizontal" | "vertical";
};

// ui/tab-navigation-base/tab-content-item/tab-content-item.d.ts
export type TabContentItemAttributes =  ContentViewAttributes & {
    canBeLoaded: false | true;
};

// ui/tab-navigation-base/tab-strip/tab-strip.d.ts
export type TabStripAttributes =  ViewAttributes & {
    highlightColor: string | Color;
    iosIconRenderingMode: "automatic" | "alwaysOriginal" | "alwaysTemplate";
    isIconSizeFixed: string | false | true;
    items: string | TabStripItem[];
    onHighlightColorChange: (args: PropertyChangeData) => void;
    onIosIconRenderingModeChange: (args: PropertyChangeData) => void;
    onIsIconSizeFixedChange: (args: PropertyChangeData) => void;
    onItemTap: (args: TabStripItemEventData) => void;
    onItemsChange: (args: PropertyChangeData) => void;
    onSelectedItemColorChange: (args: PropertyChangeData) => void;
    onUnSelectedItemColorChange: (args: PropertyChangeData) => void;
    selectedItemColor: string | Color;
    unSelectedItemColor: string | Color;
};

// ui/tab-navigation-base/tab-strip-item/tab-strip-item.d.ts
export type TabStripItemAttributes =  ViewAttributes & {
    iconClass: string;
    iconSource: string;
    image: Image;
    label: Label;
    onTap: (args: EventData) => void;
    title: string;
};