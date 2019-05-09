import * as React from "react";
import { LabelProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { Label as NativeScriptLabel } from "tns-core-modules/ui/label/label";
import { TextBaseComponentProps, RCTTextBase } from "./TextBase";

interface Props {
    // onPress
}

export type LabelComponentProps<E extends NativeScriptLabel = NativeScriptLabel> = Props /* & typeof _Label.defaultProps */ & Partial<LabelProps> & TextBaseComponentProps<E>;

/**
 * Represents a text label.
 */
export class _Label<P extends LabelComponentProps<E>, S extends {}, E extends NativeScriptLabel = NativeScriptLabel> extends RCTTextBase<P, S, E> {

    render(){
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

            text,
            formattedText,
            children,
            ...rest
        } = this.props;

        if(text && formattedText){
            console.warn(`Both text and formattedText provided; shall use formattedText.`);
        }

        const textContent = {
            [formattedText ? "formattedText" : "text"] : formattedText || text
        };

        return React.createElement(
                'label',
                {
                    ...rest,
                    ...textContent,
                    ref: forwardedRef || this.myRef
                },
                children // Weird that a Label may contain children, but what do I know.
            );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<LabelComponentProps<NativeScriptLabel>>;

export const Label: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptLabel>> = React.forwardRef<NativeScriptLabel, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptLabel>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Label,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
