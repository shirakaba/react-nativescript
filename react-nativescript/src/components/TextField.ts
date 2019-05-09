import * as React from "react";
import { TextField as NativeScriptTextField } from "tns-core-modules/ui/text-field/text-field";
import { TextFieldProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { TextBaseComponentProps, RCTTextBase } from "./TextBase";

interface Props {
    // No mandatory props.
}

export type TextFieldComponentProps<E extends NativeScriptTextField = NativeScriptTextField> = Props /* & typeof _TextField.defaultProps */ & Partial<TextFieldProps> & TextBaseComponentProps<E>;

/**
 * Represents a text TextField.
 */
export class _TextField<P extends TextFieldComponentProps<E>, S extends {}, E extends NativeScriptTextField = NativeScriptTextField> extends RCTTextBase<P, S, E> {

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
                'textField',
                {
                    ...rest,
                    ...textContent,
                    ref: forwardedRef || this.myRef
                },
                children // Weird that a TextField may contain children, but what do I know.
            );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<TextFieldComponentProps<NativeScriptTextField>>;

export const TextField: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptTextField>> = React.forwardRef<NativeScriptTextField, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptTextField>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _TextField,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
