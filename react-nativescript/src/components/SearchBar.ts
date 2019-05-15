import * as React from "react";
import { SearchBarProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { SearchBar as NativeScriptSearchBar } from "tns-core-modules/ui/search-bar/search-bar";
import { ViewComponentProps, RCTView } from "./View";
import { EventData } from "tns-core-modules/data/observable/observable";
import { updateListener } from "../client/EventHandling";

interface Props {
    onSubmit?: (args: EventData) => void,
    onClose?: (args: EventData) => void,
}

export type SearchBarComponentProps<E extends NativeScriptSearchBar = NativeScriptSearchBar> = Props /* & typeof SearchBar.defaultProps */ & Partial<SearchBarProps> & ViewComponentProps<E>;

export class _SearchBar<P extends SearchBarComponentProps<E>, S extends {}, E extends NativeScriptSearchBar> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptSearchBar>()
    // };

    /**
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(attach: boolean|null, nextProps?: P): void {
        super.updateListeners(attach, nextProps);

        const ref = this.props.forwardedRef || this.myRef;
        // console.log(`[updateListeners()] using ${ref === this.myRef ? "default ref" : "forwarded ref"}`);

        const node: E|null = ref.current;
        if(node){
            if(attach === null){
                updateListener(node, "submit", this.props.onSubmit, nextProps.onSubmit);
                updateListener(node, "close", this.props.onClose, nextProps.onClose);
            } else {
                const method = (attach ? node.on : node.off).bind(node);

                if(this.props.onSubmit) method("submit", this.props.onSubmit);
                if(this.props.onClose) method("close", this.props.onClose);
            }
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
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
            'searchBar',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<SearchBarComponentProps<NativeScriptSearchBar>>;

export const SearchBar: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptSearchBar>> = React.forwardRef<NativeScriptSearchBar, OwnPropsWithoutForwardedRef>(
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
)