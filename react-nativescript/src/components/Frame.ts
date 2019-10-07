import * as console from "../shared/Logger";
import * as React from "react";
import { FrameProps, PropsWithoutForwardedRef, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { Frame as NativeScriptFrame, EventData } from "tns-core-modules/ui/frame/frame";
import { ViewComponentProps, RCTView } from "./View";
import { updateListener } from "../client/EventHandling";

type NativeScriptUIElement = NativeScriptFrame;

interface Props {
    onOptionSelected?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
}

export type FrameComponentProps<
    E extends NativeScriptUIElement = NativeScriptUIElement
> = Props /* & typeof Frame.defaultProps */ & Partial<FrameProps> & ViewComponentProps<E>;

export class _Frame<P extends FrameComponentProps<E>, S extends {}, E extends NativeScriptUIElement> extends RCTView<
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
            updateListener(node, "optionSelected", this.props.onOptionSelected, nextProps.onOptionSelected);
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if (this.props.onOptionSelected) method("optionSelected", this.props.onOptionSelected);
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
            "frame",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<FrameComponentProps<NativeScriptUIElement>>;

export const Frame: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptUIElement>
> = React.forwardRef<NativeScriptUIElement, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptUIElement>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Frame,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
