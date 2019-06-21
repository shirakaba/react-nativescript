import * as React from "react";
import { SegmentedBarProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { SegmentedBar as NativeScriptSegmentedBar, SelectedIndexChangedEventData } from "tns-core-modules/ui/segmented-bar/segmented-bar";
import { ViewComponentProps, RCTView } from "./View";
import { updateListener } from "../client/EventHandling";

interface Props {
    // TODO: implement 'items' property for SegmentedBar just as done for TabView
    onSelectedIndexChanged?: (args: SelectedIndexChangedEventData) => void,
}

export type SegmentedBarComponentProps<E extends NativeScriptSegmentedBar = NativeScriptSegmentedBar> = Props /* & typeof SegmentedBar.defaultProps */ & Partial<SegmentedBarProps> & ViewComponentProps<E>;

export class _SegmentedBar<P extends SegmentedBarComponentProps<E>, S extends {}, E extends NativeScriptSegmentedBar> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptSegmentedBar>()
    // };

    /**
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean|null, nextProps?: P): void {    
        super.updateListeners(node, attach, nextProps);
        
        if(attach === null){
            updateListener(node, "selectedIndexChanged", this.props.onSelectedIndexChanged, nextProps.onSelectedIndexChanged);
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if(this.props.onSelectedIndexChanged) method("selectedIndexChanged", this.props.onSelectedIndexChanged);
        }
    }

    render(): React.ReactNode {
        const {
            forwardedRef,

            onSelectedIndexChanged,

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

            items, // We intercept this from being passed as a prop; our Host Config will map children to items implicitly instead.

            children,
            ...rest
        } = this.props;

        return React.createElement(
            'segmentedBar',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            /* For now, any SegmentedBarItem children will be mapped to items by our React renderer. */
            ...children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<SegmentedBarComponentProps<NativeScriptSegmentedBar>>;

export const SegmentedBar: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptSegmentedBar>> = React.forwardRef<NativeScriptSegmentedBar, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptSegmentedBar>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _SegmentedBar,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)