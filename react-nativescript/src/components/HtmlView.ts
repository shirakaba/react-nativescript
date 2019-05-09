import * as React from "react";
import { HtmlViewProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { HtmlView as NativeScriptHtmlView } from "tns-core-modules/ui/html-view/html-view";
import { ViewComponentProps, RCTView } from "./View";

interface Props {
    html: string
}

export type HtmlViewComponentProps<E extends NativeScriptHtmlView = NativeScriptHtmlView> = Props /* & typeof _HtmlView.defaultProps */ & Partial<HtmlViewProps> & ViewComponentProps<E>;

/**
 * Represents a view with html content. Use this component instead WebView when you want to show just static HTML content.
 * [iOS support](https://developer.apple.com/documentation/foundation/nsattributedstring/1524613-initwithdata)
 * [android support](http://developer.android.com/reference/android/text/Html.html)
 */
class _HtmlView<P extends HtmlViewComponentProps<E>, S extends {}, E extends NativeScriptHtmlView = NativeScriptHtmlView> extends RCTView<P, S, E> {
    render(){
        const {
            forwardedRef,

            onLoaded,
            onUnloaded,
            onAndroidBackPressed,
            onShowingModally,
            onShownModally,
            
            onTap,
            onDoubleTap,
            onPinch,
            onPan,
            onSwipe,
            onRotation,
            onLongPress,
            onTouch,

            onPropertyChange,

            children,

            ...rest
        } = this.props;

        if(children){
            console.warn("Ignoring 'children' prop on HtmlView; not permitted");
        }

        return React.createElement(
            'htmlView',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            null
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<HtmlViewComponentProps<NativeScriptHtmlView>>;

export const HtmlView: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptHtmlView>> = React.forwardRef<NativeScriptHtmlView, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptHtmlView>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _HtmlView,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);