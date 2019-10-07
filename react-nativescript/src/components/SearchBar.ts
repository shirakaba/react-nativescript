import * as console from "../shared/Logger";
import * as React from "react";
import { SearchBarProps, PropsWithoutForwardedRef, NarrowedEventData } from "../shared/NativeScriptComponentTypings";
import { SearchBar as NativeScriptSearchBar } from "tns-core-modules/ui/search-bar/search-bar";
import { ViewComponentProps, RCTView } from "./View";
import { EventData } from "tns-core-modules/data/observable/observable";
import { updateListener } from "../client/EventHandling";

type NativeScriptUIElement = NativeScriptSearchBar;

interface Props {
    onTextChange?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
    onSubmit?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
    onClose?: (args: NarrowedEventData<NativeScriptUIElement>) => void;
}

export type SearchBarComponentProps<
    E extends NativeScriptUIElement = NativeScriptUIElement
> = Props /* & typeof SearchBar.defaultProps */ & Partial<SearchBarProps> & ViewComponentProps<E>;

export class _SearchBar<
    P extends SearchBarComponentProps<E>,
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
            updateListener(node, "textChange", this.props.onTextChange, nextProps.onTextChange);
            updateListener(node, "submit", this.props.onSubmit, nextProps.onSubmit);
            updateListener(node, "close", this.props.onClose, nextProps.onClose);
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if (this.props.onTextChange) method("textChange", this.props.onTextChange);
            if (this.props.onSubmit) method("submit", this.props.onSubmit);
            if (this.props.onClose) method("close", this.props.onClose);
        }
    }

    render(): React.ReactNode {
        const {
            forwardedRef,

            onTextChange,
            onSubmit,
            onClose,

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
            "searchBar",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<SearchBarComponentProps<NativeScriptUIElement>>;

export const SearchBar: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptUIElement>
> = React.forwardRef<NativeScriptUIElement, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptUIElement>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _SearchBar,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
