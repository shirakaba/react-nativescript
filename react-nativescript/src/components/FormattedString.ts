import * as console from "../shared/Logger";
import * as React from "react";
import { FormattedStringProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { FormattedString as NativeScriptFormattedString, Span } from "tns-core-modules/text/formatted-string";
import { ViewBaseComponentProps, RCTViewBase } from "./ViewBase";
import { CustomNodeHierarchyManager, Instance, TextInstance } from "../shared/HostConfigTypes";

type Constructor<T = {}> = new (...args: any[]) => T;

export function RNSFriendly<TBase extends Constructor<NativeScriptFormattedString>>(Base: TBase) {
    return class extends Base implements CustomNodeHierarchyManager<NativeScriptFormattedString> {
        __ImplementsCustomNodeHierarchyManager__: true = true;

        constructor(...args: any[]) {
            super(...args);
            // This constructor call is needed for some reason; they must be doing something odd with the constructor.
        }

        __customHostConfigAppendChild(parent: NativeScriptFormattedString, child: Instance | TextInstance): boolean {
            if (child instanceof Span) {
                parent.spans.push(child);
            }
            // i.e. don't bother deferring to Host Config.
            return true;
        }

        __customHostConfigRemoveChild(parent: NativeScriptFormattedString, child: Instance | TextInstance): boolean {
            if (child instanceof Span) {
                const index: number = parent.spans.indexOf(child);
                if (index === -1) {
                    return true;
                }
                parent.spans.splice(index, 1);
            }
            // i.e. don't bother deferring to Host Config.
            return true;
        }

        __customHostConfigInsertBefore(
            parent: NativeScriptFormattedString,
            child: Instance | TextInstance,
            beforeChild: Instance | TextInstance
        ): boolean {
            if (!(child instanceof Span) || !(beforeChild instanceof Span)) {
                // Disqualify any children that are not at least a Span.
                return true;
            }

            const index: number = parent.spans.indexOf(beforeChild);
            if (index === -1) {
                parent.spans.push(child);
                return true;
            }
            parent.spans.splice(index, 0, child);

            return true;
        }
    };
}

export const RNSFriendlyFormattedString = RNSFriendly(NativeScriptFormattedString);

const elementKey: string = "formattedString";
/* Registration is instead performed in elementRegistry to remove this side-effect from the module and hence aid tree-shaking */
// register(
//     elementKey,
//     (
//         props: Props,
//         rootContainerInstance: Container,
//         hostContext: HostContext,
//     ) => {
//         return new RNSFriendlyFormattedString();
//     }
// );

interface Props {}

export type FormattedStringComponentProps<
    E extends NativeScriptFormattedString = NativeScriptFormattedString
> = Props /* & typeof FormattedString.defaultProps */ & Partial<FormattedStringProps> & ViewBaseComponentProps<E>;

export class _FormattedString<
    P extends FormattedStringComponentProps<E>,
    S extends {},
    E extends NativeScriptFormattedString
> extends RCTViewBase<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptFormattedString>()
    // };

    render(): React.ReactNode {
        const {
            forwardedRef,

            onPropertyChange,

            children,
            ...rest
        } = this.props;

        return React.createElement(
            elementKey,
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<FormattedStringComponentProps<NativeScriptFormattedString>>;

export const FormattedString: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptFormattedString>
> = React.forwardRef<NativeScriptFormattedString, OwnPropsWithoutForwardedRef>(
    (
        props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>,
        ref: React.RefObject<NativeScriptFormattedString>
    ) => {
        const { children, ...rest } = props;

        return React.createElement(
            _FormattedString,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
