import {
    AbsoluteLayout,
    ActionBar,
    ActivityIndicator,
    Animation,
    Button,
    Cache,
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
    TextBase,
    TextField,
    TextView,
    TimePicker,
    Transition,
    View,
    ViewBase,
    WebView,
    WrapLayout,
} from "../client/ElementRegistry";
import { TabViewItem } from "tns-core-modules/ui/tab-view/tab-view";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type StylePropContents = Omit<Style, "PropertyBag"|keyof Observable>
interface PartialStyleProp {
    style: Partial<StylePropContents>
}

export type ObservableProps = {};

/**
 * This is very naive: I just picked all the public properties that weren't readonly.
 */
export type ViewBaseProps = ObservableProps & PartialStyleProp & Pick<
    ViewBase,
    "left"|
    "top"|
    "effectiveLeft"|
    "effectiveTop"|
    "dock"|
    "row"|
    "col"|
    "rowSpan"|
    "colSpan"|
    "domNode"|
    "order"|
    "flexGrow"|
    "flexShrink"|
    "flexWrapBefore"|
    "alignSelf"|
    "effectiveMinWidth"|
    "effectiveMinHeight"|
    "effectiveWidth"|
    "effectiveHeight"|
    "effectiveMarginTop"|
    "effectiveMarginRight"|
    "effectiveMarginBottom"|
    "effectiveMarginLeft"|
    "effectivePaddingTop"|
    "effectivePaddingRight"|
    "effectivePaddingBottom"|
    "effectivePaddingLeft"|
    "effectiveBorderTopWidth"|
    "effectiveBorderRightWidth"|
    "effectiveBorderBottomWidth"|
    "effectiveBorderLeftWidth"|
    "ios"|
    "android"|
    "viewController"|
    "nativeViewProtected"|
    "nativeView"|
    "bindingContext"|
    "typeName"|
    "parentNode"|
    "id"|
    "className"|
    "isCollapsed"|
    "_domId"|
    "_cssState"|
    "cssClasses"|
    "cssPseudoClasses"|
    "_context"
>

export type ViewProps = ViewBaseProps & Pick<View,
    "android"|
    "ios"|
    "bindingContext"|
    "borderColor"|
    "borderTopColor"|
    "borderRightColor"|
    "borderBottomColor"|
    "borderLeftColor"|
    "borderWidth"|
    "borderTopWidth"|
    "borderRightWidth"|
    "borderBottomWidth"|
    "borderLeftWidth"|
    "borderRadius"|
    "borderTopLeftRadius"|
    "borderTopRightRadius"|
    "borderBottomRightRadius"|
    "borderBottomLeftRadius"|
    "color"|
    "background"|
    "backgroundColor"|
    "backgroundImage"|
    "minWidth"|
    "minHeight"|
    "width"|
    "height"|
    "margin"|
    "marginLeft"|
    "marginTop"|
    "marginRight"|
    "marginBottom"|
    "horizontalAlignment"|
    "verticalAlignment"|
    "visibility"|
    "opacity"|
    "rotate"|
    "translateX"|
    "translateY"|
    "scaleX"|
    "scaleY"|
    "automationText"|
    "originX"|
    "originY"|
    "isEnabled"|
    "isUserInteractionEnabled"|
    "iosOverflowSafeArea"|
    "iosOverflowSafeAreaEnabled"|
    "isLayoutValid"|
    "cssType"|
    "cssClasses"|
    "cssPseudoClasses"|
    "modal"
>;

export type ContentViewProps = ViewProps & Pick<ContentView,
    "content"|
    "layoutView"
>

export type PageProps = ContentViewProps & Pick<Page,
    "backgroundSpanUnderStatusBar"|
    "statusBarStyle"|
    "androidStatusBarBackground"|
    "actionBarHidden"|
    "enableSwipeBackNavigation"
>

export type TabViewProps = ViewProps & Pick<TabView,
    "items"|
    "selectedIndex"|
    "tabTextFontSize"|
    "tabTextColor"|
    "tabBackgroundColor"|
    "selectedTabTextColor"|
    "androidSelectedTabHighlightColor"|
    "android"|
    "ios"|
    "iosIconRenderingMode"|
    "androidOffscreenTabLimit"|
    "androidTabsPosition"|
    "androidSwipeEnabled"
>

export type TabViewItemProps = ViewBaseProps & Pick<TabViewItem,
    "title"|
    // "view"| /* We provide a StackLayout and implicitly map children into it */
    "iconSource"|
    "textTransform"
    // "canBeLoaded"
>

export type TextBaseProps = ViewProps & Pick<
    TextBase,
    "text"|
    "formattedText"|
    "fontSize"|
    "letterSpacing"|
    "lineHeight"|
    "textAlignment"|
    "textDecoration"|
    "textTransform"|
    "whiteSpace"|
    "padding"|
    "paddingBottom"|
    "paddingLeft"|
    "paddingRight"|
    "paddingTop"
>

export type EditableTextBaseProps = TextBaseProps & Pick<
EditableTextBase,
    "keyboardType"|
    "returnKeyType"|
    "updateTextTrigger"|
    "autocapitalizationType"|
    "editable"|
    "autocorrect"|
    "hint"|
    "maxLength"
>;

export type TextViewProps = EditableTextBaseProps & Pick<TextView, "android"|"ios">
export type TextFieldProps = EditableTextBaseProps & Pick<TextField, "android"|"ios"|"secure">
export type LabelProps = TextBaseProps & Pick<Label, "android"|"ios"|"textWrap">

export type ContainerViewProps = ViewProps & Pick<
    ContainerView,
    "iosOverflowSafeArea"
>

export type CustomLayoutViewProps = ContainerViewProps;

export type LayoutBaseProps = CustomLayoutViewProps & Pick<
    LayoutBase,
    "padding"|
    "paddingBottom"|
    "paddingLeft"|
    "paddingRight"|
    "paddingTop"|
    "clipToBounds"|
    "isPassThroughParentEnabled"    
>;

export type FlexboxLayoutProps = LayoutBaseProps & Pick<
    FlexboxLayout,
    "flexDirection"|
    "flexWrap"|
    "justifyContent"|
    "alignItems"|
    "alignContent"
>;

export type DockLayoutProps = LayoutBaseProps & Pick<
    DockLayout,
    "stretchLastChild"
>;

/* No props on GridLayout; just getters and setters. */
export type GridLayoutProps = LayoutBaseProps; 
// & Pick<
//     GridLayout,
// >;

export type StackLayoutProps = LayoutBaseProps & Pick<
    StackLayout,
    "orientation"
>;

export type WrapLayoutProps = LayoutBaseProps & Pick<
    WrapLayout,
    "orientation"|
    "itemWidth"|
    "itemHeight"
>;

/* No props on AbsoluteLayout; just getters and setters. */
export type AbsoluteLayoutProps = LayoutBaseProps;
//  & Pick<
//     AbsoluteLayout,
// >;

export type ListViewProps = ViewProps & Pick<
    ListView,
    "android"|
    "ios"|
    "items"|
    "itemTemplate"|
    "itemTemplates"|
    "itemTemplateSelector"|
    "itemIdGenerator"|
    "separatorColor"|
    "rowHeight"|
    "iosEstimatedRowHeight"
>;

export type HtmlViewProps = LayoutBaseProps & Pick<
    HtmlView,
    "android"|
    "ios"|
    "html"
>;

export type WebViewProps = LayoutBaseProps & Pick<
    WebView,
    "android"|
    "ios"|
    "src"|
    "canGoBack"|
    "canGoForward"
>;

export type ActionBarProps = LayoutBaseProps & Pick<
    ActionBar,
    "title"|
    "titleView"|
    "navigationButton"|
    "flat"
>;

export type ButtonProps = TextBaseProps & Pick<
    Button,
    "textWrap"
>;

// export type TextBaseProp<T extends TextBase> = {
//     [P in keyof T]: T[P];
// };

// export type ViewBaseProp<T extends ViewBase> = {
//     [P in keyof T]: T[P];
// };

// export type ObservableProp<T extends Observable> = {
//     [P in keyof T]: T[P];
// };