import { ViewBase } from "tns-core-modules/ui/core/view-base/view-base";
import { View, ContainerView } from "tns-core-modules/ui/core/view/view";
import { ContentView } from "tns-core-modules/ui/content-view/content-view";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { Observable } from "tns-core-modules/data/observable";
import { Style } from "tns-core-modules/ui/styling/style/style";
import { elementMap, TNSElements, ConcreteViewConstructor } from "../client/ElementRegistry";
import { View as ReactView } from "../components/View";
import { ViewComponentProps } from "./View";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { FlexboxLayout } from "tns-core-modules/ui/layouts/flexbox-layout/flexbox-layout";
import { TextView } from "tns-core-modules/ui/text-view/text-view";
import { EditableTextBase } from "tns-core-modules/ui/editable-text-base/editable-text-base";
import { Label } from "tns-core-modules/ui/label/label";
import { TextField } from "tns-core-modules/ui/text-field/text-field";
import { WebView } from "tns-core-modules/ui/web-view/web-view";
import { HtmlView } from "tns-core-modules/ui/html-view/html-view";
import { ListView } from "tns-core-modules/ui/list-view/list-view";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type StylePropContents = Omit<Style, "PropertyBag"|keyof Observable>
interface PartialStyleProp {
    style: Partial<StylePropContents>
}

/**
 * This is very naive: I just picked all the public properties that weren't readonly.
 */
export type ViewBaseProps = PartialStyleProp & Pick<
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

// export type TextBaseProp<T extends TextBase> = {
//     [P in keyof T]: T[P];
// };

// export type ViewBaseProp<T extends ViewBase> = {
//     [P in keyof T]: T[P];
// };

// export type ObservableProp<T extends Observable> = {
//     [P in keyof T]: T[P];
// };