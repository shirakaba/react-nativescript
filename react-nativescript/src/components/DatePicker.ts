import * as React from "react";
import { DatePickerProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { DatePicker as NativeScriptDatePicker } from "tns-core-modules/ui/date-picker/date-picker";
import { ViewComponentProps, RCTView } from "./View";

interface Props {
}

export type DatePickerComponentProps<E extends NativeScriptDatePicker = NativeScriptDatePicker> = Props /* & typeof DatePicker.defaultProps */ & Partial<DatePickerProps> & ViewComponentProps<E>;

export class _DatePicker<P extends DatePickerComponentProps<E>, S extends {}, E extends NativeScriptDatePicker> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptDatePicker>()
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
            'datePicker',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<DatePickerComponentProps<NativeScriptDatePicker>>;

export const DatePicker: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptDatePicker>> = React.forwardRef<NativeScriptDatePicker, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptDatePicker>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _DatePicker,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)