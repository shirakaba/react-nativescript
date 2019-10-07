import * as console from "../shared/Logger";
import * as React from "react";
import { SwitchProps, PropsWithoutForwardedRef, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { Switch as NativeScriptSwitch } from "tns-core-modules/ui/switch/switch";
import { ViewComponentProps, RCTView } from "./View";
import { EventData } from "tns-core-modules/data/observable/observable";
import { updateListener } from "../client/EventHandling";

type NativeScriptUIElement = NativeScriptSwitch;

interface Props {
    onToggle?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
}

export type SwitchComponentProps<
    E extends NativeScriptUIElement = NativeScriptUIElement
> = Props /* & typeof Switch.defaultProps */ & Partial<SwitchProps> & ViewComponentProps<E>;

export class _Switch<P extends SwitchComponentProps<E>, S extends {}, E extends NativeScriptUIElement> extends RCTView<
    P,
    S,
    E
> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptUIElement>()
    // };

    /**
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, "checkedChange", this.props.onToggle, nextProps.onToggle);
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if (this.props.onToggle) method("checkedChange", this.props.onToggle);
        }
    }

    render(): React.ReactNode {
        const {
            forwardedRef,

            onToggle,

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
            "switch",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<SwitchComponentProps<NativeScriptUIElement>>;

export const Switch: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptUIElement>
> = React.forwardRef<NativeScriptUIElement, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptUIElement>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Switch,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
