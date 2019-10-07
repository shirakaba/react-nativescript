import * as console from "../shared/Logger";
import * as React from "react";
import { DatePickerProps, PropsWithoutForwardedRef, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { DatePicker as NativeScriptDatePicker } from "tns-core-modules/ui/date-picker/date-picker";
import { ViewComponentProps, RCTView } from "./View";
import { EventData } from "tns-core-modules/data/observable/observable";
import { updateListener } from "../client/EventHandling";

type NativeScriptUIElement = NativeScriptDatePicker;

interface Props {
    onDateChange?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
}

export type DatePickerComponentProps<
    E extends NativeScriptUIElement = NativeScriptUIElement
> = Props /* & typeof DatePicker.defaultProps */ & Partial<DatePickerProps> & ViewComponentProps<E>;

export class _DatePicker<
    P extends DatePickerComponentProps<E>,
    S extends {},
    E extends NativeScriptUIElement
> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptUIElement>()
    // };

    /**
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, "dateChange", this.props.onDateChange, nextProps.onDateChange);
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if (this.props.onDateChange) method("dateChange", this.props.onDateChange);
        }
    }

    render(): React.ReactNode {
        const {
            forwardedRef,

            onDateChange,

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
            "datePicker",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<DatePickerComponentProps<NativeScriptUIElement>>;

export const DatePicker: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptUIElement>
> = React.forwardRef<NativeScriptUIElement, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptUIElement>) => {
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
);
