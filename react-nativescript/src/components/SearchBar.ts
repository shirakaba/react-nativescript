import * as console from "../shared/Logger";
import * as React from "react";
import { SearchBarProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { SearchBar as NativeScriptSearchBar } from "tns-core-modules/ui/search-bar/search-bar";
import { ViewComponentProps, RCTView } from "./View";
import { EventData } from "tns-core-modules/data/observable/observable";
import { updateListener } from "../client/EventHandling";

interface Props {
    onTextChange?: (text: string) => void;
    onSubmit?: (args: EventData) => void;
    onClose?: (args: EventData) => void;
}

export type SearchBarComponentProps<
    E extends NativeScriptSearchBar = NativeScriptSearchBar
> = Props /* & typeof SearchBar.defaultProps */ & Partial<SearchBarProps> & ViewComponentProps<E>;

export class _SearchBar<
    P extends SearchBarComponentProps<E>,
    S extends {},
    E extends NativeScriptSearchBar
> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptSearchBar>()
    // };

    private readonly onTextChange = (args: EventData) => {
        const text: string = (<NativeScriptSearchBar>args.object).text;
        this.props.onTextChange && this.props.onTextChange(text);
    };

    componentDidMount() {
        super.componentDidMount();

        const node: E | null = this.getCurrentRef();
        if (!node) {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
            return;
        }
        node.on("textChange", this.onTextChange);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        const node: E | null = this.getCurrentRef();
        if (!node) {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
            return;
        }
        node.off("textChange", this.onTextChange);
    }

    /**
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, "submit", this.props.onSubmit, nextProps.onSubmit);
            updateListener(node, "close", this.props.onClose, nextProps.onClose);
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if (this.props.onSubmit) method("submit", this.props.onSubmit);
            if (this.props.onClose) method("close", this.props.onClose);
        }
    }

    render(): React.ReactNode {
        const {
            forwardedRef,

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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<SearchBarComponentProps<NativeScriptSearchBar>>;

export const SearchBar: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptSearchBar>
> = React.forwardRef<NativeScriptSearchBar, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptSearchBar>) => {
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
