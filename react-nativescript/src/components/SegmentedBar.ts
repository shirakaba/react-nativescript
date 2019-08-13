import * as console from "../shared/Logger";
import * as React from "react";
import { SegmentedBarProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import {
    SegmentedBar as NativeScriptSegmentedBar,
    SegmentedBarItem as NativeScriptSegmentedBarItem,
    SelectedIndexChangedEventData,
} from "tns-core-modules/ui/segmented-bar/segmented-bar";
import { ViewComponentProps, RCTView } from "./View";
import { updateListener } from "../client/EventHandling";
import { CustomNodeHierarchyManager, Type, Container, HostContext, Instance, TextInstance } from "../shared/HostConfigTypes";

type Constructor<T = {}> = new (...args: any[]) => T;

export function RNSFriendly<TBase extends Constructor<NativeScriptSegmentedBar>>(Base: TBase) {
    return class extends Base implements CustomNodeHierarchyManager<NativeScriptSegmentedBar> {
        __ImplementsCustomNodeHierarchyManager__: true = true;

        constructor(...args: any[]){
            super(...args);
            // This constructor call is needed for some reason; they must be doing something odd with the constructor.
        }

        __customHostConfigAppendChild(parent: NativeScriptSegmentedBar, child: Instance | TextInstance): boolean {
            if(child instanceof NativeScriptSegmentedBarItem){
                parent.items = [...(parent.items || []), child];
            }
            // i.e. don't bother deferring to Host Config.
            return true;
        }

        __customHostConfigRemoveChild(parent: NativeScriptSegmentedBar, child: Instance | TextInstance): boolean {
            if(child instanceof NativeScriptSegmentedBarItem){
                parent.items = (parent.items || []).filter((item) => item !== child);;
            }
            // i.e. don't bother deferring to Host Config.
            return true;
        }

        __customHostConfigInsertBefore(parent: NativeScriptSegmentedBar, child: Instance | TextInstance, beforeChild: Instance | TextInstance): boolean {
            if(!(child instanceof NativeScriptSegmentedBarItem) || !(beforeChild instanceof NativeScriptSegmentedBarItem)){
                // Disqualify any children that are not at least a NativeScriptSegmentedBarItem.
                return true;
            }

            const originalItems: NativeScriptSegmentedBarItem[] = parent.items || [];

            const atIndex: number = originalItems.indexOf(beforeChild);
            if(atIndex === -1){
                parent.items = originalItems.concat(child);
                return true;
            }
            const itemsClone: NativeScriptSegmentedBarItem[] = [...originalItems];
            parent.items = itemsClone.splice(atIndex, 0, child);

            return true;
        }
    };
}

export const RNSFriendlySegmentedBar = RNSFriendly(NativeScriptSegmentedBar);

const elementKey: string = "segmentedBar";
/* Registration is instead performed in elementRegistry to remove this side-effect from the module and hence aid tree-shaking */
// register(
//     elementKey,
//     (
//         props: Props,
//         rootContainerInstance: Container,
//         hostContext: HostContext,
//     ) => {
//         return new RNSFriendlySegmentedBar();
//     }
// );

interface Props {
    onSelectedIndexChanged?: (args: SelectedIndexChangedEventData) => void;
}

export type SegmentedBarComponentProps<
    E extends NativeScriptSegmentedBar = NativeScriptSegmentedBar
> = Props /* & typeof SegmentedBar.defaultProps */ & Partial<SegmentedBarProps> & ViewComponentProps<E>;

export class _SegmentedBar<
    P extends SegmentedBarComponentProps<E>,
    S extends {},
    E extends NativeScriptSegmentedBar
> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptSegmentedBar>()
    // };

    /**
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(
                node,
                "selectedIndexChanged",
                this.props.onSelectedIndexChanged,
                nextProps.onSelectedIndexChanged
            );
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if (this.props.onSelectedIndexChanged) method("selectedIndexChanged", this.props.onSelectedIndexChanged);
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
            elementKey,
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            /* For now, any SegmentedBarItem children will be mapped to items by our React renderer. */
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<SegmentedBarComponentProps<NativeScriptSegmentedBar>>;

export const SegmentedBar: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptSegmentedBar>
> = React.forwardRef<NativeScriptSegmentedBar, OwnPropsWithoutForwardedRef>(
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
);
