import * as console from "../shared/Logger";
import * as React from "react";
import { TimePickerProps, PropsWithoutForwardedRef, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { TimePicker as NativeScriptTimePicker } from "tns-core-modules/ui/time-picker/time-picker";
import { ViewComponentProps, RCTView } from "./View";
import { EventData } from "tns-core-modules/data/observable/observable";
import { updateListener } from "../client/EventHandling";

type NativeScriptUIElement = NativeScriptTimePicker;

interface Props {
    onTimeChange?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
}

export type TimePickerComponentProps<
    E extends NativeScriptUIElement = NativeScriptUIElement
> = Props /* & typeof TimePicker.defaultProps */ & Partial<TimePickerProps> & ViewComponentProps<E>;

export class _TimePicker<
    P extends TimePickerComponentProps<E>,
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
            updateListener(node, "timeChange", this.props.onTimeChange, nextProps.onTimeChange);
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if (this.props.onTimeChange) method("timeChange", this.props.onTimeChange);
        }
    }

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

            time,

            children,
            ...rest
        } = this.props;

        return React.createElement(
            "timePicker",
            {
                ...rest,
                time: time || new Date(), // This prevents the default time from becoming Sun Dec 31st 1899!
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<TimePickerComponentProps<NativeScriptUIElement>>;

export const TimePicker: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptUIElement>
> = React.forwardRef<NativeScriptUIElement, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptUIElement>) => {
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
);
