import * as console from "../shared/Logger";
import * as React from "react";
import { SwitchProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { Switch as NativeScriptSwitch } from "tns-core-modules/ui/switch/switch";
import { ViewComponentProps, RCTView } from "./View";
import { Observable, EventData } from "tns-core-modules/data/observable/observable";

interface Props {
    onToggle?: (checked: boolean) => void;
}

export type SwitchComponentProps<
    E extends NativeScriptSwitch = NativeScriptSwitch
> = Props /* & typeof Switch.defaultProps */ & Partial<SwitchProps> & ViewComponentProps<E>;

export class _Switch<P extends SwitchComponentProps<E>, S extends {}, E extends NativeScriptSwitch> extends RCTView<
    P,
    S,
    E
> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptSwitch>()
    // };

    onToggle = (args: EventData) => {
        const checked: boolean = (<NativeScriptSwitch>args.object).checked;

        this.props.onToggle && this.props.onToggle(checked);
    };

    componentDidMount() {
        super.componentDidMount();

        const node: E | null = this.getCurrentRef();
        if (!node) {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
            return;
        }
        node.checked = !!this.props.checked;
        node.on("checkedChange", this.onToggle);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        const node: E | null = this.getCurrentRef();
        if (!node) {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
            return;
        }
        node.off("checkedChange", this.onToggle);
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<SwitchComponentProps<NativeScriptSwitch>>;

export const Switch: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptSwitch>
> = React.forwardRef<NativeScriptSwitch, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptSwitch>) => {
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
