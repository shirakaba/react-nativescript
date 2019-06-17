import * as React from "react";
import { TimePickerProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { TimePicker as NativeScriptTimePicker } from "tns-core-modules/ui/time-picker/time-picker";
import { ViewComponentProps, RCTView } from "./View";

interface Props {
}

export type TimePickerComponentProps<E extends NativeScriptTimePicker = NativeScriptTimePicker> = Props /* & typeof TimePicker.defaultProps */ & Partial<TimePickerProps> & ViewComponentProps<E>;

export class _TimePicker<P extends TimePickerComponentProps<E>, S extends {}, E extends NativeScriptTimePicker> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptTimePicker>()
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
            'timePicker',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<TimePickerComponentProps<NativeScriptTimePicker>>;

export const TimePicker: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptTimePicker>> = React.forwardRef<NativeScriptTimePicker, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptTimePicker>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _TimePicker,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)