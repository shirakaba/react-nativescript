import * as console from "../shared/Logger";
import * as React from "react";
import { ListPickerProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ListPicker as NativeScriptListPicker } from "tns-core-modules/ui/list-picker/list-picker";
import { ViewComponentProps, RCTView } from "./View";
import { EventData } from "tns-core-modules/data/observable/observable";
import { ItemsSource } from "tns-core-modules/ui/list-picker/list-picker";

interface Props {
    items: any[] | ItemsSource;
    onSelectedIndexChange?: (selectedIndex: number) => void;
}

export type ListPickerComponentProps<
    E extends NativeScriptListPicker = NativeScriptListPicker
> = Props /* & typeof ListPicker.defaultProps */ & Partial<ListPickerProps> & ViewComponentProps<E>;

export class _ListPicker<
    P extends ListPickerComponentProps<E>,
    S extends {},
    E extends NativeScriptListPicker
> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptListPicker>()
    // };

    private readonly onSelectedIndexChange = (args: EventData) => {
        const selectedIndex: number = (<NativeScriptListPicker>args.object).selectedIndex;

        this.props.onSelectedIndexChange && this.props.onSelectedIndexChange(selectedIndex);
    };

    componentDidMount() {
        super.componentDidMount();

        const node: E | null = this.getCurrentRef();
        if (!node) {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
            return;
        }
        node.on("selectedIndexChange", this.onSelectedIndexChange);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        const node: E | null = this.getCurrentRef();
        if (!node) {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
            return;
        }
        node.off("selectedIndexChange", this.onSelectedIndexChange);
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
            "listPicker",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ListPickerComponentProps<NativeScriptListPicker>>;

export const ListPicker: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptListPicker>
> = React.forwardRef<NativeScriptListPicker, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptListPicker>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _ListPicker,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
