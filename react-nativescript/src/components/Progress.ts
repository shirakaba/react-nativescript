import * as React from "react";
import { ProgressProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { Progress as NativeScriptProgress } from "tns-core-modules/ui/progress/progress";
import { ViewComponentProps, RCTView } from "./View";

// TODO: refer to https://docs.nativescript.org/ui/ns-ui-widgets/progress for API
interface Props {
}

export type ProgressComponentProps<E extends NativeScriptProgress = NativeScriptProgress> = Props /* & typeof Progress.defaultProps */ & Partial<ProgressProps> & ViewComponentProps<E>;

export class _Progress<P extends ProgressComponentProps<E>, S extends {}, E extends NativeScriptProgress> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptProgress>()
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
            'progress',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ProgressComponentProps<NativeScriptProgress>>;

export const Progress: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptProgress>> = React.forwardRef<NativeScriptProgress, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptProgress>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Progress,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)