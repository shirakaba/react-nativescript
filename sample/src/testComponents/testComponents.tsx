import * as React from "react";
import { Span, Page, SearchBar, WebView, Frame, FormattedString, EventData, Color, SegmentedBar } from "@nativescript/core";
import { NSVElement } from "react-nativescript";

/**
 * Defines the data for the SegmentedBar.selectedIndexChanged event.
 */
interface SelectedIndexChangedEventData extends EventData {
    /**
     * The old selected index.
     */
    oldIndex: number;

    /**
     * The new selected index.
     */
    newIndex: number;
}

export class TextFieldTest extends React.Component<{ toWhat: string }, {}> {
    render() {
        return React.createElement("textField", null, `Hello ${this.props.toWhat}`);
    }
}

export class TextViewTest extends React.Component<{ toWhat: string }, {}> {
    render() {
        return <textView>{`Hello ${this.props.toWhat}`}</textView>;
    }
}

export class WebViewTest extends React.Component<{ forwardedRef: React.RefObject<any> }, { src: string; searchText: string }> {
    constructor(props) {
        super(props);

        this.state = {
            searchText: "",
            src: "https://www.birchlabs.co.uk",
        };
    }

    render() {
        return (
            <stackLayout ref={this.props.forwardedRef}>
                <searchBar
                    text={this.state.searchText}
                    /* componentDidMount: NativeScript wrapper views mounted. Native views not yet initialised.
                     * onLoaded: wrappers' native views initialised. Happens AFTER componentDidMount. */
                    onLoaded={(args: EventData) => {
                        console.log(`[ONLOADED] Searchbar`);
                        const sb: SearchBar = args.object as SearchBar;
                        (sb.ios as UISearchBar).autocorrectionType = UITextAutocorrectionType.No;
                        (sb.ios as UISearchBar).autocapitalizationType = UITextAutocapitalizationType.None;
                    }}
                    onTextChange={(args) => {
                        const text: string = (args.object as SearchBar).text;
                        console.log(`[onTextChange]`, text);
                        this.setState({ searchText: text });
                    }}
                    onSubmit={(args) => {
                        const text: string = (args.object as SearchBar).text;
                        console.log(`[onSubmit]`, text);
                        this.setState({ searchText: text, src: text });
                    }}
                />

                <webView
                    height={{ value: 100, unit: "%" }}
                    width={{ value: 100, unit: "%" }}
                    src={this.state.src}
                    onLoaded={(args: EventData) => {
                        console.log(`[ONLOADED] WebView`);
                        const wv: WebView = args.object as WebView;
                        (wv.ios as WKWebView).configuration.userContentController.addUserScript(
                            WKUserScript.alloc().initWithSourceInjectionTimeForMainFrameOnly(
                                `
                                const style = document.createElement('style');
                                style.type = 'text/css';
                                style.innerHTML = "@keyframes infinite-rotate {  0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); }} .infiniteRotateAnim { background-color: green; animation: infinite-rotate 2s linear infinite; }";
                                document.getElementsByTagName('head')[0].appendChild(style);

                                document.body.classList.add("infiniteRotateAnim");
                                `,
                                WKUserScriptInjectionTime.AtDocumentEnd,
                                false
                            )
                        );
                        (wv.ios as WKWebView).reload();
                    }}
                    onSrcChange={(args) => {
                        const src: string = (args.object as WebView).src;
                        console.log(`[onUrlChange]`, src);
                        this.setState({ src });
                    }}
                />
            </stackLayout>
        );
    }
}

export class LabelTest extends React.Component<{ toWhat: string }, {}> {
    render() {
        return <label>{`Hello ${this.props.toWhat}`}</label>;
    }
}

class MyRootView extends React.Component<{}, {}> {
    render() {
        return React.createElement("frame", null);
    }
}

export class NestedContentView extends React.Component<{}, {}> {
    render() {
        return React.createElement(
            "contentView",
            {
                style: {
                    /* Note that "75%" and "yellow" also work at run-time; it's just that the typings disallow it. */
                    backgroundColor: new Color("yellow"),
                    width: { unit: "%", value: 75 },
                    height: { unit: "%", value: 75 },
                },
                // backgroundColor: "yellow",
                // width: 75,
            },
            React.createElement("contentView", {
                /* Seems that these props are totally untyped (deep 'any'). */
                style: {
                    backgroundColor: new Color("orange"),
                    width: 50,
                    height: 50,
                },
            })
        );
    }
}

/**
 * Referring to:
 * https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/formatted-string/code-behind/code-behind-ts-page.ts
 * https://www.nativescript.org/blog/bolding-italicizing-and-underlining-portions-of-text-in-nativescript
 */

export class FormattedStringLabel extends React.Component<{}, {}> {
    render() {
        const formattedString = new FormattedString();

        const firstSpan: Span = new Span();
        firstSpan.color = new Color("#3C5AFD");
        firstSpan.text = "NativeScript";

        const secondSpan: Span = new Span();
        secondSpan.text = " is an ";

        const thirdSpan: Span = new Span();
        thirdSpan.fontWeight = "bold";
        thirdSpan.fontSize = 28;
        thirdSpan.textDecoration = "underline";
        thirdSpan.color = new Color("white");
        thirdSpan.backgroundColor = new Color("green");
        thirdSpan.fontFamily = "Courier";
        thirdSpan.text = "AMAZING";

        const fourthSpan: Span = new Span();
        fourthSpan.text = " framework";

        [firstSpan, secondSpan, thirdSpan, fourthSpan].forEach((span) => {
            formattedString.spans.push(span);
        });

        return <label formattedText={formattedString} />;
    }
}

export class SegmentedBarIssue extends React.Component<{ forwardedRef: React.RefObject<NSVElement<Frame>> }, { selectedIndex: number }> {
    private readonly pageRef: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 1,
        };
    }

    private readonly onSelectedIndexChanged = (args: SelectedIndexChangedEventData) => {
        this.setState({ selectedIndex: args.newIndex });
    };

    componentDidMount() {
        this.props.forwardedRef.current!.nativeView.navigate({
            create: () => {
                return this.pageRef.current!.nativeView;
            },
        });
    }

    render() {
        const { forwardedRef } = this.props;
        const { selectedIndex } = this.state;

        return (
            <frame ref={forwardedRef}>
                <page ref={this.pageRef}>
                    <stackLayout>
                        <label text={"HelloWorld"} />
                        <segmentedBar className={"m-5"} selectedIndex={selectedIndex} onSelectedIndexChanged={this.onSelectedIndexChanged}>
                            <segmentedBarItem title={"Item 1"} />
                            <segmentedBarItem title={"Item 2"} />
                            <segmentedBarItem title={"Item 3"} />
                        </segmentedBar>
                    </stackLayout>
                </page>
            </frame>
        );
    }
}
