import * as React from "react";
import { ContentViewProps } from "../shared/NativeScriptComponentTypings";
import { ContentView as NativeScriptContentView } from "tns-core-modules/ui/content-view/content-view";
import { ViewComponentProps, RCTView } from "./View";

interface Props {
}

export type ContentViewComponentProps<E extends NativeScriptContentView = NativeScriptContentView> = Props /* & typeof ContentView.defaultProps */ & Partial<ContentViewProps> & ViewComponentProps<E>;

export class ContentView<P extends ContentViewComponentProps<E>, S extends {}, E extends NativeScriptContentView> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptContentView>()
    // };

    render(): React.ReactNode {
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

        return React.createElement(
            'contentView',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}