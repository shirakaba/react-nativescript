import * as React from "react";
import { PlaceholderProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { Placeholder as NativeScriptPlaceholder, CreateViewEventData } from "tns-core-modules/ui/placeholder/placeholder";
import { ViewComponentProps, RCTView } from "./View";
import { updateListener } from "../client/EventHandling";

interface Props {
    onCreatingView?(args: CreateViewEventData): void;
}

export type PlaceholderComponentProps<E extends NativeScriptPlaceholder = NativeScriptPlaceholder> = Props /* & typeof Placeholder.defaultProps */ & Partial<PlaceholderProps> & ViewComponentProps<E>;

export class _Placeholder<P extends PlaceholderComponentProps<E>, S extends {}, E extends NativeScriptPlaceholder> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptPlaceholder>()
    // };

    /**
     * 
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean|null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);
        
        if(attach === null){
            updateListener(node, "creatingView", this.props.onCreatingView, nextProps.onCreatingView);
        } else {
            const method = (attach ? node.on : node.off).bind(node);
            if(this.props.onCreatingView) method("creatingView", this.props.onCreatingView);
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
            'placeholder',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<PlaceholderComponentProps<NativeScriptPlaceholder>>;

export const Placeholder: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptPlaceholder>> = React.forwardRef<NativeScriptPlaceholder, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptPlaceholder>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Placeholder,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)