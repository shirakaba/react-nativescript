import * as React from "react";
import { ActivityIndicatorProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ActivityIndicator as NativeScriptActivityIndicator } from "tns-core-modules/ui/activity-indicator/activity-indicator";
import { ViewComponentProps, RCTView } from "./View";

interface Props {
}

export type ActivityIndicatorComponentProps<E extends NativeScriptActivityIndicator = NativeScriptActivityIndicator> = Props /* & typeof ActivityIndicator.defaultProps */ & Partial<ActivityIndicatorProps> & ViewComponentProps<E>;

export class _ActivityIndicator<P extends ActivityIndicatorComponentProps<E>, S extends {}, E extends NativeScriptActivityIndicator> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptActivityIndicator>()
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
            'activityIndicator',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ActivityIndicatorComponentProps<NativeScriptActivityIndicator>>;

export const ActivityIndicator: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptActivityIndicator>> = React.forwardRef<NativeScriptActivityIndicator, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptActivityIndicator>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _ActivityIndicator,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)