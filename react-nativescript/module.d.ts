import { Observable } from "tns-core-modules/data/observable";
import { Style } from "tns-core-modules/ui/styling/style/style";
import { Page } from "tns-core-modules/ui/page";
import { View, ContainerView } from "tns-core-modules/ui/core/view";
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
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { ViewBase } from "tns-core-modules/ui/core/view-base/view-base";
import { ReactNode, ClassAttributes, ReactElement, LegacyRef } from "react";
// import { default as ReactNativeScript } from "./client/ReactNativeScript";

// https://github.com/Microsoft/TypeScript/issues/3203
// https://github.com/Microsoft/TypeScript/issues/3203#issuecomment-119074260
declare namespace JSX {
    interface IntrinsicElements {
        actionBar: React.DetailedNativeScriptProps<React.NativeScriptAttributes<ActionBar>, ActionBar>
        activityIndicator: React.DetailedNativeScriptProps<React.NativeScriptAttributes<ActivityIndicator>, ActivityIndicator>
        button: React.DetailedNativeScriptProps<React.NativeScriptAttributes<Button>, Button>
        contentView: React.DetailedNativeScriptProps<React.ContentViewNativeScriptAttributes<ContentView>, ContentView>
        datePicker: React.DetailedNativeScriptProps<React.NativeScriptAttributes<DatePicker>, DatePicker>
        editableTextBase: React.DetailedNativeScriptProps<React.EditableTextBaseNativeScriptAttributes<EditableTextBase>, EditableTextBase>
        htmlView: React.DetailedNativeScriptProps<React.HtmlViewNativeScriptAttributes<HtmlView>, HtmlView>
        image: React.DetailedNativeScriptProps<React.NativeScriptAttributes<Image>, Image>
        label: React.DetailedNativeScriptProps<React.LabelNativeScriptAttributes<Label>, Label>
        layoutBase: React.DetailedNativeScriptProps<React.LayoutBaseNativeScriptAttributes<LayoutBase>, LayoutBase>
        absoluteLayout: React.DetailedNativeScriptProps<React.NativeScriptAttributes<AbsoluteLayout>, AbsoluteLayout>
        dockLayout: React.DetailedNativeScriptProps<React.DockLayoutNativeScriptAttributes<DockLayout>, DockLayout>
        flexboxLayout: React.DetailedNativeScriptProps<React.FlexboxLayoutNativeScriptAttributes<FlexboxLayout>, FlexboxLayout>
        gridLayout: React.DetailedNativeScriptProps<React.GridLayoutNativeScriptAttributes<GridLayout>, GridLayout>
        stackLayout: React.DetailedNativeScriptProps<React.NativeScriptAttributes<StackLayout>, StackLayout>
        wrapLayout: React.DetailedNativeScriptProps<React.NativeScriptAttributes<WrapLayout>, WrapLayout>
        listPicker: React.DetailedNativeScriptProps<React.NativeScriptAttributes<ListPicker>, ListPicker>
        listView: React.DetailedNativeScriptProps<React.ListViewNativeScriptAttributes<ListView>, ListView>
        placeholder: React.DetailedNativeScriptProps<React.NativeScriptAttributes<Placeholder>, Placeholder>
        progress: React.DetailedNativeScriptProps<React.NativeScriptAttributes<Progress>, Progress>
        proxyViewContainer: React.DetailedNativeScriptProps<React.NativeScriptAttributes<ProxyViewContainer>, ProxyViewContainer>
        repeater: React.DetailedNativeScriptProps<React.NativeScriptAttributes<Repeater>, Repeater>
        scrollView: React.DetailedNativeScriptProps<React.NativeScriptAttributes<ScrollView>, ScrollView>
        searchBar: React.DetailedNativeScriptProps<React.NativeScriptAttributes<SearchBar>, SearchBar>
        segmentedBar: React.DetailedNativeScriptProps<React.NativeScriptAttributes<SegmentedBar>, SegmentedBar>
        slider: React.DetailedNativeScriptProps<React.NativeScriptAttributes<Slider>, Slider>
        switch: React.DetailedNativeScriptProps<React.NativeScriptAttributes<Switch>, Switch>
        tabView: React.DetailedNativeScriptProps<React.NativeScriptAttributes<TabView>, TabView>
        textView: React.DetailedNativeScriptProps<React.TextViewNativeScriptAttributes<TextView>, TextView>
        textBase: React.DetailedNativeScriptProps<React.TextBaseNativeScriptAttributes<TextBase>, TextBase>
        textField: React.DetailedNativeScriptProps<React.TextFieldNativeScriptAttributes<TextField>, TextField>
        timePicker: React.DetailedNativeScriptProps<React.NativeScriptAttributes<TimePicker>, TimePicker>
        webView: React.DetailedNativeScriptProps<React.WebViewNativeScriptAttributes<WebView>, WebView>
        frame: React.DetailedNativeScriptProps<React.NativeScriptAttributes<Frame>, Frame>
        page: React.DetailedNativeScriptProps<React.NativeScriptAttributes<Page>, Page>
    }
}

declare namespace React {
    type DetailedNativeScriptProps<E extends NativeScriptAttributes<T>, T> = ClassAttributes<T> & E;

    interface NativeScriptFactory<T extends ViewBase> extends DetailedNativeScriptFactory<AllNativeScriptAttributes<T>, T> {}

    /* Attributes that would be common to all NativeScript nodes.
     * Theoretically, even ones that don't extend ViewBase. */
    interface NativeScriptAttributes<T> extends NativeScriptDOMAttributes<T> {
        /* From HTMLAttributes<T>, which extends DOMAttributes<T> */

        /* React-specific Attributes */
        defaultChecked?: boolean;
        defaultValue?: string | string[];
        suppressContentEditableWarning?: boolean;
        suppressHydrationWarning?: boolean;

        /* Standard NativeScript Attributes */
        // accessKey?: string;
        className?: string;
        contentEditable?: boolean;
        // contextMenu?: string;
        // dir?: string;
        // draggable?: boolean;
        hidden?: boolean;
        id?: string;
        // lang?: string;
        // placeholder?: string;
        // slot?: string;
        // spellCheck?: boolean;
        // style?: Partial<StylePropContents>;
        // tabIndex?: number;
        // title?: string;

        /* ARIA accessibility attributes may be merged in future. */
    }

    interface NativeScriptDOMAttributes<T> {
        /* From DOMAttributes<T> */
        children?: ReactNode;

        // Events may go in here in future, too
    }



    interface AllNativeScriptAttributes<T> extends NativeScriptAttributes<T> {
        // Standard HTML Attributes
        // accept?: string;
        // acceptCharset?: string;
        // action?: string;
    }

    interface DetailedNativeScriptFactory<P extends NativeScriptDOMAttributes<T>, T extends ViewBase> extends NativeScriptDOMFactory<P, T> {
        (props?: ClassAttributes<T> & P | null, ...children: ReactNode[]): DetailedReactNativeScriptElement<P, T>;
    }

    interface DetailedReactNativeScriptElement<P extends NativeScriptAttributes<T>, T extends NativeScriptElement> extends NativeScriptDOMElement<P, T> {
        type: keyof ReactNativeScript;
    }

    /* To be substituted both in cases of HTMLElement and Element, as there are no equivalent concepts in NativeScript. */
    type NativeScriptElement = ViewBase;

    type NativeScriptDOMFactory<P extends NativeScriptDOMAttributes<T>, T extends NativeScriptElement> = (props?: ClassAttributes<T> & P | null, ...children: ReactNode[]) => NativeScriptDOMElement<P, T>;

    interface NativeScriptDOMElement<P extends NativeScriptAttributes<T>, T extends NativeScriptElement> extends ReactElement<P, string>
    {
        ref: LegacyRef<T>;
    }

    function createElement<P extends NativeScriptAttributes<T>, T extends NativeScriptElement>(
        type: keyof ReactNativeScript,
        props?: ClassAttributes<T> & P | null,
        ...children: ReactNode[]): DetailedReactNativeScriptElement<P, T>;

    function cloneElement<P extends NativeScriptAttributes<T>, T extends NativeScriptElement>(
        element: DetailedReactNativeScriptElement<P, T>,
        props?: P,
        ...children: ReactNode[]): DetailedReactNativeScriptElement<P, T>;
    // ReactNativeScriptElement, less specific
    // function cloneElement<P extends NativeScriptAttributes<T>, T extends NativeScriptElement>(
    //     element: ReactNativeScriptElement<T>,
    //     props?: P,
    //     ...children: ReactNode[]): ReactNativeScriptElement<T>;

    type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
    type StyleAttributeContents = Omit<Style, "PropertyBag"|keyof Observable>
    interface PartialStyleAttribute {
        style: Partial<StyleAttributeContents>
    }

    type _ViewBaseNativeScriptAttributes<T> = NativeScriptAttributes<T> & PartialStyleAttribute & Pick<
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
    type ViewBaseNativeScriptAttributes<T> = Partial<_ViewBaseNativeScriptAttributes<T>>;

    type _ContentViewNativeScriptAttributes<T> = ViewNativeScriptAttributes<T> & Pick<ContentView,
        "content"|
        "layoutView"
    >
    type ContentViewNativeScriptAttributes<T> = Partial<_ContentViewNativeScriptAttributes<T>>;

    type _ViewNativeScriptAttributes<T> = ViewBaseNativeScriptAttributes<T> & Pick<View,
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
    type ViewNativeScriptAttributes<T> = Partial<_ViewNativeScriptAttributes<T>>;

    type _TextBaseNativeScriptAttributes<T> = ViewNativeScriptAttributes<T> & Pick<
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
    type TextBaseNativeScriptAttributes<T> = Partial<_TextBaseNativeScriptAttributes<T>>;

    type _EditableTextBaseNativeScriptAttributes<T> = TextBaseNativeScriptAttributes<T> & Pick<
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
    type EditableTextBaseNativeScriptAttributes<T> = Partial<_EditableTextBaseNativeScriptAttributes<T>>;

    type _TextViewNativeScriptAttributes<T> = EditableTextBaseNativeScriptAttributes<T> & Pick<TextView, "android"|"ios">;
    type TextViewNativeScriptAttributes<T> = Partial<_TextViewNativeScriptAttributes<T>>;

    type _TextFieldNativeScriptAttributes<T> = EditableTextBaseNativeScriptAttributes<T> & Pick<TextField, "android"|"ios"|"secure">;
    type TextFieldNativeScriptAttributes<T> = Partial<_TextFieldNativeScriptAttributes<T>>;

    type _LabelNativeScriptAttributes<T> = TextBaseNativeScriptAttributes<T> & Pick<Label, "android"|"ios"|"textWrap">;
    type LabelNativeScriptAttributes<T> = Partial<_LabelNativeScriptAttributes<T>>;

    type _ContainerViewNativeScriptAttributes<T> = ViewNativeScriptAttributes<T> & Pick<
        ContainerView,
        "iosOverflowSafeArea"
    >
    type ContainerViewNativeScriptAttributes<T> = _ContainerViewNativeScriptAttributes<T>;

    type _CustomLayoutViewNativeScriptAttributes<T> = ContainerViewNativeScriptAttributes<T>;
    type CustomLayoutViewNativeScriptAttributes<T> = Partial<_CustomLayoutViewNativeScriptAttributes<T>>;

    type _LayoutBaseNativeScriptAttributes<T> = CustomLayoutViewNativeScriptAttributes<T> & Pick<
        LayoutBase,
        "padding"|
        "paddingBottom"|
        "paddingLeft"|
        "paddingRight"|
        "paddingTop"|
        "clipToBounds"|
        "isPassThroughParentEnabled"    
    >;
    type LayoutBaseNativeScriptAttributes<T> = Partial<_LayoutBaseNativeScriptAttributes<T>>;

    type _FlexboxLayoutNativeScriptAttributes<T> = LayoutBaseNativeScriptAttributes<T> & Pick<
        FlexboxLayout,
        "flexDirection"|
        "flexWrap"|
        "justifyContent"|
        "alignItems"|
        "alignContent"
    >;
    type FlexboxLayoutNativeScriptAttributes<T> = Partial<_FlexboxLayoutNativeScriptAttributes<T>>;

    type _DockLayoutNativeScriptAttributes<T> = LayoutBaseNativeScriptAttributes<T> & Pick<
        DockLayout,
        "stretchLastChild"
    >;
    type DockLayoutNativeScriptAttributes<T> = Partial<_DockLayoutNativeScriptAttributes<T>>;

    /* No NativeScriptAttributes on GridLayout; just getters and setters. */
    type _GridLayoutNativeScriptAttributes<T> = LayoutBaseNativeScriptAttributes<T>; 
    // & Pick<
    //     GridLayout,
    // >;
    type GridLayoutNativeScriptAttributes<T> = Partial<_GridLayoutNativeScriptAttributes<T>>;

    type _ListViewNativeScriptAttributes<T> = ViewNativeScriptAttributes<T> & Pick<
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
    type ListViewNativeScriptAttributes<T> = Partial<_ListViewNativeScriptAttributes<T>>;

    type _HtmlViewNativeScriptAttributes<T> = LayoutBaseNativeScriptAttributes<T> & Pick<
        HtmlView,
        "android"|
        "ios"|
        "html"
    >;
    type HtmlViewNativeScriptAttributes<T> = Partial<_HtmlViewNativeScriptAttributes<T>>;

    type _WebViewNativeScriptAttributes<T> = LayoutBaseNativeScriptAttributes<T> & Pick<
        WebView,
        "android"|
        "ios"|
        "src"|
        "canGoBack"|
        "canGoForward"
    >;
    type WebViewNativeScriptAttributes<T> = Partial<_WebViewNativeScriptAttributes<T>>;
    
    interface ReactNativeScript {
        actionBar: DetailedNativeScriptFactory<NativeScriptAttributes<ActionBar>, ActionBar>,
        activityIndicator: DetailedNativeScriptFactory<NativeScriptAttributes<ActivityIndicator>, ActivityIndicator>,
        button: DetailedNativeScriptFactory<NativeScriptAttributes<Button>, Button>,
        contentView: DetailedNativeScriptFactory<ContentViewNativeScriptAttributes<ContentView>, ContentView>,
        datePicker: DetailedNativeScriptFactory<NativeScriptAttributes<DatePicker>, DatePicker>,
        editableTextBase: DetailedNativeScriptFactory<EditableTextBaseNativeScriptAttributes<EditableTextBase>, EditableTextBase>,
        htmlView: DetailedNativeScriptFactory<HtmlViewNativeScriptAttributes<HtmlView>, HtmlView>,
        image: DetailedNativeScriptFactory<NativeScriptAttributes<Image>, Image>,
        label: DetailedNativeScriptFactory<LabelNativeScriptAttributes<Label>, Label>,
        layoutBase: DetailedNativeScriptFactory<LayoutBaseNativeScriptAttributes<LayoutBase>, LayoutBase>,
        absoluteLayout: DetailedNativeScriptFactory<NativeScriptAttributes<AbsoluteLayout>, AbsoluteLayout>,
        dockLayout: DetailedNativeScriptFactory<DockLayoutNativeScriptAttributes<DockLayout>, DockLayout>,
        flexboxLayout: DetailedNativeScriptFactory<FlexboxLayoutNativeScriptAttributes<FlexboxLayout>, FlexboxLayout>,
        gridLayout: DetailedNativeScriptFactory<GridLayoutNativeScriptAttributes<GridLayout>, GridLayout>,
        wrapLayout: DetailedNativeScriptFactory<NativeScriptAttributes<WrapLayout>, WrapLayout>,
        listPicker: DetailedNativeScriptFactory<NativeScriptAttributes<ListPicker>, ListPicker>,
        listView: DetailedNativeScriptFactory<ListViewNativeScriptAttributes<ListView>, ListView>,
        placeholder: DetailedNativeScriptFactory<NativeScriptAttributes<Placeholder>, Placeholder>,
        progress: DetailedNativeScriptFactory<NativeScriptAttributes<Progress>, Progress>,
        proxyViewContainer: DetailedNativeScriptFactory<NativeScriptAttributes<ProxyViewContainer>, ProxyViewContainer>,
        repeater: DetailedNativeScriptFactory<NativeScriptAttributes<Repeater>, Repeater>,
        scrollView: DetailedNativeScriptFactory<NativeScriptAttributes<ScrollView>, ScrollView>,
        searchBar: DetailedNativeScriptFactory<NativeScriptAttributes<SearchBar>, SearchBar>,
        segmentedBar: DetailedNativeScriptFactory<NativeScriptAttributes<SegmentedBar>, SegmentedBar>,
        slider: DetailedNativeScriptFactory<NativeScriptAttributes<Slider>, Slider>,
        switch: DetailedNativeScriptFactory<NativeScriptAttributes<Switch>, Switch>,
        tabView: DetailedNativeScriptFactory<NativeScriptAttributes<TabView>, TabView>,
        textView: DetailedNativeScriptFactory<TextViewNativeScriptAttributes<TextView>, TextView>,
        textBase: DetailedNativeScriptFactory<TextBaseNativeScriptAttributes<TextBase>, TextBase>,
        textField: DetailedNativeScriptFactory<TextFieldNativeScriptAttributes<TextField>, TextField>,
        timePicker: DetailedNativeScriptFactory<NativeScriptAttributes<TimePicker>, TimePicker>,
        webView: DetailedNativeScriptFactory<WebViewNativeScriptAttributes<WebView>, WebView>,
        frame: DetailedNativeScriptFactory<NativeScriptAttributes<Frame>, Frame>,
        page: DetailedNativeScriptFactory<NativeScriptAttributes<Page>, Page>,
    }
}

declare global {
    /* Can add any globals into here, e.g. __DEV__: */
    // const __DEV__: boolean;
}

/* Could re-export the ReactNativeScript module from here. */
// export default ReactNativeScript;