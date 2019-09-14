import * as console from "../shared/Logger";
import * as React from "react";
import { TextBase as NativeScriptTextBase } from "../client/ElementRegistry";
import { ContentViewProps, TextBaseProps } from "../shared/NativeScriptComponentTypings";
import { ViewComponentProps, RCTView } from "./View";
import { CustomNodeHierarchyManager, Instance, TextInstance } from "../shared/HostConfigTypes";
import { FormattedString } from "tns-core-modules/text/formatted-string";

type Constructor<T = {}> = new (...args: any[]) => T;

export function RNSFriendly<TBase extends Constructor<NativeScriptTextBase>>(Base: TBase) {
    return class extends Base implements CustomNodeHierarchyManager<NativeScriptTextBase> {
        __ImplementsCustomNodeHierarchyManager__: true = true;

        constructor(...args: any[]) {
            super(...args);
            // This constructor call is needed for some reason; they must be doing something odd with the constructor.
        }

        __customHostConfigAppendChild(parent: NativeScriptTextBase, child: Instance | TextInstance): boolean {
            if (child instanceof FormattedString) {
                parent.formattedText = child;
                return true;
            }
            
            // i.e. defer to Host Config.
            return false;
        }

        __customHostConfigRemoveChild(parent: NativeScriptTextBase, child: Instance | TextInstance): boolean {
            if (child instanceof FormattedString) {
                parent.formattedText = null;
                return true;
            }

            // i.e. defer to Host Config.
            return false;
        }

        __customHostConfigInsertBefore(
            parent: NativeScriptTextBase,
            child: Instance | TextInstance,
            beforeChild: Instance | TextInstance
        ): boolean {
            if (child instanceof FormattedString) {
                parent.formattedText = child;
                return true;
            }

            // i.e. defer to Host Config.
            return false;
        }
    };
}

interface Props {}

export type TextBaseComponentProps<
    E extends NativeScriptTextBase = NativeScriptTextBase
> = Props /* & typeof TextBase.defaultProps */ & Partial<TextBaseProps> & ViewComponentProps<E>;

export abstract class RCTTextBase<
    P extends TextBaseComponentProps<E>,
    S extends {},
    E extends NativeScriptTextBase
> extends RCTView<P, S, E> {}
