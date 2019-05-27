import * as React from "react";
import { FrameProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { Frame as NativeScriptFrame, EventData } from "tns-core-modules/ui/frame/frame";
import { ViewComponentProps, RCTView } from "./View";
import { updateListener } from "../client/EventHandling";

interface Props {
    onOptionSelected?: (args: EventData) => void;
}

export type FrameComponentProps<E extends NativeScriptFrame = NativeScriptFrame> = Props /* & typeof Frame.defaultProps */ & Partial<FrameProps> & ViewComponentProps<E>;

export class _Frame<P extends FrameComponentProps<E>, S extends {}, E extends NativeScriptFrame> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptFrame>()
    // };

    /**
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(attach: boolean|null, nextProps?: P): void {
        super.updateListeners(attach, nextProps);

        const ref = this.props.forwardedRef || this.myRef;
        console.log(`[updateListeners()] using ${ref === this.myRef ? "default ref" : "forwarded ref"}`);

        const node: E|null = ref.current;
        if(node){
            if(attach === null){
                updateListener(node, "optionSelected", this.props.onOptionSelected, nextProps.onOptionSelected);
            } else {
                const method = (attach ? node.on : node.off).bind(node);

                if(this.props.onOptionSelected) method("optionSelected", this.props.onOptionSelected);
            }
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
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
            'frame',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<FrameComponentProps<NativeScriptFrame>>;

export const Frame: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptFrame>> = React.forwardRef<NativeScriptFrame, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptFrame>) => {
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
)