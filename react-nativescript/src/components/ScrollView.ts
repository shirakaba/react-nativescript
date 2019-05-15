import * as React from "react";
import { ScrollViewProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ScrollView as NativeScriptScrollView, ScrollEventData } from "tns-core-modules/ui/scroll-view/scroll-view";
import { _ContentView, ContentViewComponentProps } from "./ContentView";
import { updateListener } from "../client/EventHandling";

interface Props {
    onScroll?: (args: ScrollEventData) => void,
}

export type ScrollViewComponentProps<E extends NativeScriptScrollView = NativeScriptScrollView> = Props /* & typeof _ScrollView.defaultProps */ & Partial<ScrollViewProps> & ContentViewComponentProps<E>;

/**
 * A React wrapper around the NativeScript ScrollView component.
 * See: ui/scroll-view/scroll-view
 */
class _ScrollView<P extends ScrollViewComponentProps<E>, S extends {}, E extends NativeScriptScrollView = NativeScriptScrollView> extends _ContentView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptScrollView>()
    // };

    // private readonly myRef: React.RefObject<NativeScriptScrollView> = React.createRef<NativeScriptScrollView>();

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
                updateListener(node, "scroll", this.props.onScroll, nextProps.onScroll);
            } else {
                const method = (attach ? node.on : node.off).bind(node);

                if(this.props.onScroll) method("scroll", this.props.onScroll);
            }
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    render(): React.ReactNode {
        const {
            forwardedRef,

            onScroll,

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
            'scrollView',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ScrollViewComponentProps<NativeScriptScrollView>>;

export const ScrollView: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptScrollView>> = React.forwardRef<NativeScriptScrollView, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptScrollView>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _ScrollView,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)