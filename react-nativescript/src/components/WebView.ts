import * as console from "../shared/Logger";
import * as React from "react";
import { WebViewProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { WebView as NativeScriptWebView, LoadEventData } from "tns-core-modules/ui/web-view/web-view";
import { ViewComponentProps, RCTView } from "./View";
import { updateListener } from "../client/EventHandling";
import { EventData } from "tns-core-modules/data/observable/observable";

interface Props {
    onUrlChange?: (url: string) => void;
    onLoadFinished?: (args: LoadEventData) => void;
    onLoadStarted?: (args: LoadEventData) => void;
}

export type WebViewComponentProps<
    E extends NativeScriptWebView = NativeScriptWebView
> = Props /* & typeof _WebView.defaultProps */ & Partial<WebViewProps> & ViewComponentProps<E>;

/**
 * A React wrapper around the NativeScript WebView component.
 * See: ui/WebView/WebView
 */
class _WebView<
    P extends WebViewComponentProps<E>,
    S extends {},
    E extends NativeScriptWebView = NativeScriptWebView
> extends RCTView<P, S, E> {
    private readonly onUrlChange = (args: EventData) => {
        const url: string = (<NativeScriptWebView>args.object).src;
        this.props.onUrlChange && this.props.onUrlChange(url);
    };

    componentDidMount() {
        super.componentDidMount();

        const node: E | null = this.getCurrentRef();
        if (!node) {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
            return;
        }
        node.on("urlChange", this.onUrlChange);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        const node: E | null = this.getCurrentRef();
        if (!node) {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
            return;
        }
        node.off("urlChange", this.onUrlChange);
    }

    /**
     *
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, "loadFinished", this.props.onLoadFinished, nextProps.onLoadFinished);
            updateListener(node, "loadStarted", this.props.onLoadStarted, nextProps.onLoadStarted);
        } else {
            const method = (attach ? node.on : node.off).bind(node);
            if (this.props.onLoadFinished) method("loadFinished", this.props.onLoadFinished);
            if (this.props.onLoadStarted) method("loadStarted", this.props.onLoadStarted);
        }
    }

    render() {
        const {
            forwardedRef,

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

        if (children) {
            console.warn("Ignoring 'children' prop on WebView; not permitted");
        }

        return React.createElement(
            "webView",
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            null
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<WebViewComponentProps<NativeScriptWebView>>;

export const WebView: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptWebView>
> = React.forwardRef<NativeScriptWebView, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptWebView>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _WebView,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
