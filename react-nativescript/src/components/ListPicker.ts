import * as console from "../shared/Logger";
import * as React from "react";
import { ListPickerProps, PropsWithoutForwardedRef, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { ListPicker as NativeScriptListPicker } from "tns-core-modules/ui/list-picker/list-picker";
import { ViewComponentProps, RCTView } from "./View";
import { EventData } from "tns-core-modules/data/observable/observable";
import { ItemsSource } from "tns-core-modules/ui/list-picker/list-picker";
import { updateListener } from "../client/EventHandling";

type NativeScriptUIElement = NativeScriptListPicker;

interface Props {
    items: any[] | ItemsSource;
    onSelectedIndexChange?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
}

export type ListPickerComponentProps<
    E extends NativeScriptUIElement = NativeScriptUIElement
> = Props /* & typeof ListPicker.defaultProps */ & Partial<ListPickerProps> & ViewComponentProps<E>;

export class _ListPicker<
    P extends ListPickerComponentProps<E>,
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
            updateListener(node, "selectedIndexChange", this.props.onSelectedIndexChange, nextProps.onSelectedIndexChange);
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if (this.props.onSelectedIndexChange) method("selectedIndexChange", this.props.onSelectedIndexChange);
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ListPickerComponentProps<NativeScriptUIElement>>;

export const ListPicker: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptUIElement>
> = React.forwardRef<NativeScriptUIElement, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptUIElement>) => {
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
