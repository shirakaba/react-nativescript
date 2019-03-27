import { ViewBase } from "tns-core-modules/ui/core/view-base/view-base";
import { View, ContainerView } from "tns-core-modules/ui/core/view/view";
import { TextBase } from "tns-core-modules/ui/text-base/text-base";
import { Observable } from "tns-core-modules/data/observable";

/* Emits unreadable typings */
// export type DeepPartial<T> = {
//     [P in keyof T]?: T[P] extends Array<infer U>
//         ? Array<DeepPartial<U>>
//             : T[P] extends ReadonlyArray<infer U>
//             ? ReadonlyArray<DeepPartial<U>>
//                 : DeepPartial<T[P]>
// };

/**
 * This is very naive: I just picked all the public properties that weren't readonly.
 */
export type ViewBaseProps = Pick<
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

export type ViewProps = Pick<View,
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

export type ContainerViewProps = ViewProps & Pick<
    ContainerView,
    "iosOverflowSafeArea"
>

// export type TextBaseProp<T extends TextBase> = {
//     [P in keyof T]: T[P];
// };

// export type ViewBaseProp<T extends ViewBase> = {
//     [P in keyof T]: T[P];
// };

// export type ObservableProp<T extends Observable> = {
//     [P in keyof T]: T[P];
// };