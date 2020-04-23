import * as React from "react";
import { PercentLength, FormattedString, EventData } from "tns-core-modules/ui/text-base/text-base";
import { Color } from "tns-core-modules/color";
import { Span } from "tns-core-modules/text/span";
import { ContentView, TextBase, ViewBase, StackLayout, Label, TabView, Page, ProxyViewContainer, SearchBar, WebView, Frame } from "react-nativescript/dist/client/ElementRegistry";
import { ViewProps, StylePropContents } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import {
    $Button,
    $ContentView,
    $TextView,
    $TextField,
    $Label,
    // StylePropContents,
    $DockLayout,
    $AbsoluteLayout,
    $StackLayout,
    $FlexboxLayout,
    $ListView,
    $ActionBar,
    $TabView,
    $TabViewItem,
    $Page,
    $WebView,
    $SearchBar,
    $Frame,
    $SegmentedBar,
    $SegmentedBarItem,
} from "react-nativescript/dist/index";
import * as ReactNativeScript from "react-nativescript/dist/index";
import { TabViewItem, SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view/tab-view";
import { PageComponentProps } from "react-nativescript/dist/components/Page";
import { PortalToPageWithActionBar } from "./navigation";

type ViewBaseProp<T extends ViewBase> = {
    [P in keyof T]: T[P]
};

export class TextFieldTest extends React.Component<{ toWhat: string }, {}> {
    render(){
        return React.createElement('TextField', null, `Hello ${this.props.toWhat}`);
        // { type: "TextField", props: { toWhat: string, children: string } }
    }
}

export class TextViewTest extends React.Component<{ toWhat: string }, {}> {
    render(){
        // return (<ReactTextView text={`Hello ${this.props.toWhat}`}/>);
        return (<textView>{`Hello ${this.props.toWhat}`}</textView>);
    }
}

export class WebViewTest extends React.Component<{ forwardedRef: React.RefObject<any> }, { src: string, searchText: string }> {
    constructor(props){
        super(props);

        this.state = {
            searchText: "",
            src: "https://www.birchlabs.co.uk",
        };
    }

    render(){
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
                        const text: string = args.object.text;
                        console.log(`[onTextChange]`, text);
                        this.setState({ searchText: text });
                    }}
                    onSubmit={(args) => {
                        const text: string = args.object.text;
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
                                false,
                            )
                        );
                        (wv.ios as WKWebView).reload();
                    }}
                    onUrlChange={(args) => {
                        const src: string = args.object.src;
                        console.log(`[onUrlChange]`, src);
                        this.setState({ src });
                    }}
                />
            </stackLayout>
        );
    }
}

export class LabelTest extends React.Component<{ toWhat: string }, {}> {
    render(){
        return (<label>{`Hello ${this.props.toWhat}`}</label>);
    }
}

class MyRootView extends React.Component<{}, {}> {
    render(){
        return React.createElement('frame', null);
    }
}

export class NestedContentView extends React.Component<{}, {}> {
    render(){
        return React.createElement(
            "contentview",
            {
                style: {
                    /* Note that "75%" and "yellow" also work at run-time; it's just that the typings disallow it. */
                    backgroundColor: new Color("yellow"),
                    width: { unit: "%", value: 75 },
                    height: { unit: "%", value: 75 }
                },
                // backgroundColor: "yellow",
                // width: 75,
            },
            React.createElement(
                "contentview",
                {
                    /* Seems that these props are totally untyped (deep 'any'). */
                    style: {
                        backgroundColor: new Color("orange"),
                        width: 50,
                        height: 50
                    },
                }
            )
        );
    }
}

/**
 * Referring to:
 * https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/formatted-string/code-behind/code-behind-ts-page.ts
 * https://www.nativescript.org/blog/bolding-italicizing-and-underlining-portions-of-text-in-nativescript
 */

export class FormattedStringLabel extends React.Component<{}, {}> {
    render(){
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

        [firstSpan, secondSpan, thirdSpan, fourthSpan]
        .forEach((span) => {
            formattedString.spans.push(span);
        })

        // return React.createElement(
        //     ReactLabel,
        //     {
        //         formattedText: formattedString
        //     },
        //     null
        // );

        return (
            <label formattedText={formattedString} />
        )
    }
}

export class SegmentedBarIssue extends React.Component<{ forwardedRef: React.RefObject<Frame> }, { selectedIndex: number }> { 
    private readonly pageRef: React.RefObject<Page> = React.createRef<Page>();

    constructor(props){
        super(props);

        this.state = {
            selectedIndex: 1,
        };
    }

    private readonly onSelectedIndexChanged = (args: SelectedIndexChangedEventData) => {
        this.setState({ selectedIndex: args.newIndex });
    };

    componentDidMount() {
        this.props.forwardedRef.current.navigate({
            create:() => {
                return this.pageRef.current;
            }
        });
    }

    render() {
        const { forwardedRef } = this.props;
        const { selectedIndex } = this.state;

        return(
            <frame ref={forwardedRef}>
                <page ref={this.pageRef}>
                    <stackLayout>
                        <label text={"HelloWorld"}/>
                        <segmentedBar
                            className={"m-5"}
                            selectedIndex={selectedIndex}
                            onSelectedIndexChanged={this.onSelectedIndexChanged}
                        >
                            <segmentedBarItem title={"Item 1"}/>
                            <segmentedBarItem title={"Item 2"}/>
                            <segmentedBarItem title={"Item 3"}/>
                        </segmentedBar>
                    </stackLayout>
                </page>
            </frame>
        );
    }
}
