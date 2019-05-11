import * as React from "react";
import { ImageProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { Image as NativeScriptImage } from "tns-core-modules/ui/image/image";
import { ViewComponentProps, RCTView } from "./View";

interface Props {
}

export type ImageComponentProps<E extends NativeScriptImage = NativeScriptImage> = Props /* & typeof Image.defaultProps */ & Partial<ImageProps> & ViewComponentProps<E>;

export class _Image<P extends ImageComponentProps<E>, S extends {}, E extends NativeScriptImage> extends RCTView<P, S, E> {

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
            'image',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ImageComponentProps<NativeScriptImage>>;

export const Image: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptImage>> = React.forwardRef<NativeScriptImage, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptImage>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Image,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)