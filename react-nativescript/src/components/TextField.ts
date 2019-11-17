import * as console from "../shared/Logger";
import * as React from "react";
import { TextField as NativeScriptTextField } from "tns-core-modules/ui/text-field/text-field";
import { TextFieldProps, PropsWithoutForwardedRef, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { RCTEditableTextBase, EditableTextBaseComponentProps } from "./EditableTextBase";
import { RNSFriendly } from "./TextBase";
import { updateListener } from "../client/EventHandling";

type NativeScriptUIElement = NativeScriptTextField;

export const RNSFriendlyTextField = RNSFriendly(NativeScriptTextField);

const elementKey: string = "textField";
/* Registration is instead performed in elementRegistry to remove this side-effect from the module and hence aid tree-shaking */
// register(
//     elementKey,
//     (
//         props: Props,
//         rootContainerInstance: Container,
//         hostContext: HostContext,
//     ) => {
//         return new RNSFriendlyTextField();
//     }
// );

interface Props {
    onReturnPress?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
}

export type TextFieldComponentProps<
    E extends NativeScriptUIElement = NativeScriptUIElement
> = Props /* & typeof _TextField.defaultProps */ & Partial<TextFieldProps> & EditableTextBaseComponentProps<E>;

/**
 * Represents a text TextField.
 */
export class _TextField<
    P extends TextFieldComponentProps<E>,
    S extends {},
    E extends NativeScriptUIElement = NativeScriptUIElement
> extends RCTEditableTextBase<P, S, E> {
    /**
     *
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, "returnPress", this.props.onReturnPress, nextProps.onReturnPress);
        } else {
            const method = (attach ? node.on : node.off).bind(node);
            if (this.props.onReturnPress) method("returnPress", this.props.onReturnPress);
        }
    }

    render() {
        const {
            forwardedRef,

            onReturnPress,
            onBlur,
            onFocus,
            onTextChange,

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

        if (text && formattedText) {
            console.warn(`Both text and formattedText provided; shall use formattedText.`);
        }

        const textContent = {
            [formattedText ? "formattedText" : "text"]: formattedText || text,
        };

        return React.createElement(
            elementKey,
            {
                ...rest,
                ...textContent,
                ref: forwardedRef || this.myRef,
            },
            children // Weird that a TextField may contain children, but what do I know.
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<TextFieldComponentProps<NativeScriptUIElement>>;

export const TextField: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptUIElement>
> = React.forwardRef<NativeScriptUIElement, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptUIElement>) => {
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
