import * as console from "../shared/Logger";
import * as React from "react";
import {
    SegmentedBarItem as NativeScriptSegmentedBarItem
} from "tns-core-modules/ui/segmented-bar/segmented-bar";
import { PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { ViewBaseComponentProps, RCTViewBase } from "../components/ViewBase";
import { register } from "../client/ElementRegistry";
import { Container, HostContext } from "../shared/HostConfigTypes";

type SegmentedBarItemProps = Pick<NativeScriptSegmentedBarItem, "title">;

interface Props {
}

export type SegmentedBarItemComponentProps<
    E extends NativeScriptSegmentedBarItem = NativeScriptSegmentedBarItem
> = Props /* & typeof RCTSegmentedBarItem.defaultProps */ & Partial<SegmentedBarItemProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript SegmentedBarItem component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _SegmentedBarItem<
    P extends SegmentedBarItemComponentProps<E>,
    S extends {},
    E extends NativeScriptSegmentedBarItem
> extends RCTViewBase<P, S, E> {

    render() {
        const {
            forwardedRef,

            onPropertyChange,

            children,
            ...rest
        } = this.props;

        return React.createElement(
            "segmentedBarItem",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<SegmentedBarItemComponentProps<NativeScriptSegmentedBarItem>>;

export const SegmentedBarItem: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptSegmentedBarItem>
> = React.forwardRef<NativeScriptSegmentedBarItem, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptSegmentedBarItem>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _SegmentedBarItem,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
