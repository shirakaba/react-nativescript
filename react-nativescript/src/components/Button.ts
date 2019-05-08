import * as React from "react";
import { ButtonProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { Button as NativeScriptButton } from "tns-core-modules/ui/button/button";
import { EventData } from "tns-core-modules/data/observable/observable";
import { isAndroid, isIOS } from "tns-core-modules/platform/platform";
import { Color } from "tns-core-modules/color/color";
import { updateListener } from "../client/EventHandling";
import { TextBaseComponentProps, RCTTextBase } from "./TextBase";

interface Props {
    // onPress
}

export type ButtonComponentProps<E extends NativeScriptButton = NativeScriptButton> = Props /* & typeof _Button.defaultProps */ & Partial<ButtonProps> & TextBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript Button component.
 * https://facebook.github.io/react-native/docs/button#color
 */
export class _Button<P extends ButtonComponentProps<E>, S extends {}, E extends NativeScriptButton = NativeScriptButton> extends RCTTextBase<P, S, E> {

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
                'button',
                {
                    className: "btn btn-primary btn-active", // NativeScript defaults from documentation
                    ...rest,
                    ...textContent,
                    ref: forwardedRef || this.myRef
                },
                children // Weird that a button may contain children, but what do I know.
            );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ButtonComponentProps<NativeScriptButton>>;

export const Button: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptButton>> = React.forwardRef<NativeScriptButton, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptButton>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Button,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)