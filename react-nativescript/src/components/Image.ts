// import * as console from "../shared/Logger";
import * as React from "react";
import { createRef } from "react";
import { ImageProps, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { Image as NativeScriptImage } from "@nativescript/core";
import { ViewComponentProps, useViewInheritance, ViewOmittedPropNames } from "./View";
import { useEventListener } from "../client/EventHandling";

/**
 * Auxiliary props for the wrapping component rather than the intrinsic element.
 */
export interface ImageAuxProps {
}
export type ImageOmittedPropNames = ViewOmittedPropNames;
export type ImageComponentProps = ImageAuxProps & Partial<ImageProps> & ViewComponentProps;

/**
 * A hook to inherit all the behaviour of this React component. Useful when creating a React component that
 * wraps an intrinsic element that extends the same intrinsic element as this one.
 * 
 * @param ref the host instance of the underlying intrinsic element for this React component.
 * @param props all props for the intrinsic element and also its React wrapper (e.g. event listener handlers).
 * 
 * @returns just the props to be passed on to the underlying intrinsic element.
 */
export function useImageInheritance<
    P extends ImageComponentProps,
    E extends NativeScriptImage = NativeScriptImage
>(
    ref: React.RefObject<E>,
    props: P
): Omit<P, ImageOmittedPropNames>
{
    const intrinsicProps = useViewInheritance(ref, props);
    // Image has no events of its own to handle

    // We have to explicitly type this because of an issue with tsc inference... :(
    return intrinsicProps as Omit<P, ImageOmittedPropNames>;
}

export function _Image(props: React.PropsWithChildren<ImageComponentProps>, ref?: React.RefObject<NativeScriptImage>)
{
    ref = ref || createRef<NativeScriptImage>();
    const { children, ...intrinsicProps } = useImageInheritance(ref, props);

    return React.createElement(
        "image",
        {
            ...intrinsicProps,
            ref,
        },
        children
    );
}

export const Image = React.forwardRef<NativeScriptImage, React.PropsWithChildren<ImageComponentProps>>(_Image);
