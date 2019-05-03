import * as React from "react";
import { PageProps } from "../shared/NativeScriptComponentTypings";
import { Page as NativeScriptPage, NavigatedData } from "tns-core-modules/ui/page/page";
import { _ContentView, ContentViewComponentProps } from "./ContentView";
import { updateListener } from "../client/EventHandling";

interface Props {
    onNavigatingTo?: PageNavigationEventHandler,
    onNavigatedTo?: PageNavigationEventHandler,
    onNavigatingFrom?: PageNavigationEventHandler,
    onNavigatedFrom?: PageNavigationEventHandler,
}

export type PageNavigationEventHandler = (args: NavigatedData) => void;

export type PageComponentProps<E extends NativeScriptPage = NativeScriptPage> = Props /* & typeof _Page.defaultProps */ & Partial<PageProps> & ContentViewComponentProps<E>;

/**
 * A React wrapper around the NativeScript Page component.
 * TODO: inherit from a View component
 * See: ui/page/page
 */
class _Page<P extends PageComponentProps<E>, S extends {}, E extends NativeScriptPage = NativeScriptPage> extends _ContentView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptPage>()
    // };

    // private readonly myRef: React.RefObject<NativeScriptPage> = React.createRef<NativeScriptPage>();

    /**
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(attach: boolean|null, nextProps?: P): void {
        super.updateListeners(attach, nextProps);

        const ref = this.props.forwardedRef || this.myRef;
        console.log(`[updateListeners()] using ${ref === this.myRef ? "default ref" : "forwarded ref"}`);

        const node: E|null = ref.current;
        if(node){
            if(attach === null){
                updateListener(node, "navigatedFrom", this.props.onNavigatedFrom, nextProps.onNavigatedFrom);
                updateListener(node, "navigatedTo", this.props.onNavigatedTo, nextProps.onNavigatedTo);
                updateListener(node, "navigatingFrom", this.props.onNavigatingFrom, nextProps.onNavigatingFrom);
                updateListener(node, "navigatingTo", this.props.onNavigatingTo, nextProps.onNavigatingTo);
            } else {
                const method = (attach ? node.on : node.off).bind(node);

                if(this.props.onNavigatedFrom) method("navigatedFrom", this.props.onNavigatedFrom);
                if(this.props.onNavigatedTo) method("navigatedTo", this.props.onNavigatedTo);
                if(this.props.onNavigatingFrom) method("navigatingFrom", this.props.onNavigatingFrom);
                if(this.props.onNavigatingTo) method("navigatingTo", this.props.onNavigatingTo);
            }
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    render(): React.ReactNode {
        const { children, forwardedRef, ...rest } = this.props;

        return React.createElement(
            'page',
            {
                ...rest,
                // ref: this.myRef
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type PropsWithoutForwardedRef = Omit<PageComponentProps<NativeScriptPage>, "forwardedRef">;

export const Page: React.ComponentType<PropsWithoutForwardedRef & React.ClassAttributes<NativeScriptPage>> = React.forwardRef<NativeScriptPage, PropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<PropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptPage>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Page,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)