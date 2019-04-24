import * as React from "react";
import { PercentLength, FormattedString } from "tns-core-modules/ui/text-base/text-base";
import { Color } from "tns-core-modules/color";
import { Span } from "tns-core-modules/text/span";
import { ContentView, TextBase, ViewBase, StackLayout, Label, TabView, Page, ProxyViewContainer } from "react-nativescript/dist/client/ElementRegistry";
import { ViewProps, StylePropContents } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import {
    Button as ReactButton,
    ContentView as ReactContentView,
    TextView as ReactTextView,
    Label as ReactLabel,
    // StylePropContents,
    DockLayout as ReactDockLayout,
    AbsoluteLayout as ReactAbsoluteLayout,
    StackLayout as ReactStackLayout,
    FlexboxLayout as ReactFlexboxLayout,
    ListView as ReactListView,
    ActionBar as ReactActionBar,
    TabView as ReactTabView,
    TabViewItem as ReactTabViewItem,
    Page as ReactPage,
} from "react-nativescript/dist/index";
import * as ReactNativeScript from "react-nativescript/dist/index";
import { TabViewItem } from "tns-core-modules/ui/tab-view/tab-view";

type ViewBaseProp<T extends ViewBase> = {
    [P in keyof T]: T[P]
};

class MyTextField extends React.Component<{ toWhat: string }, {}> {
    render(){
        return React.createElement('TextField', null, `Hello ${this.props.toWhat}`);
        // { type: "TextField", props: { toWhat: string, children: string } }
    }
}

export class MyTextView extends React.Component<{ toWhat: string }, {}> {
    render(){
        return React.createElement(ReactTextView, null, `Hello ${this.props.toWhat}`);
        // { type: "TextField", props: { toWhat: string, children: string } }
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
            ReactContentView,
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
                ReactContentView,
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

        return React.createElement(
            ReactLabel,
            {
                formattedText: formattedString
            },
            null
        );
    }
}

export class GameLoop {
    private readonly subscribers = [];
    private loopID: number|null = null;

	constructor(private readonly frameRateMs: number = 1000 / 60){
		this.loop = this.loop.bind(this);
	}

	loop(): void {
		this.subscribers.forEach((callback) => {
			callback.call();
		});

        /* NativeScript doesn't have requestAnimationFrame() :( */
        // this.loopID = global.requestAnimationFrame(this.loop);
        this.loopID = setTimeout(this.loop, this.frameRateMs);
	}

	start(): void {
		if (!this.loopID) {
			this.loop();
		}
	}

	stop(): void {
		if (!this.loopID) {
            // window.cancelAnimationFrame(this.loopID);
            clearTimeout(this.loopID);
			this.loopID = null;
		}
	}

	subscribe(callback: (...args: any[]) => any): number {
		return this.subscribers.push(callback);
	}

	unsubscribe(id: number): void {
		this.subscribers.splice((id - 1), 1);
	}
}

const GameLoopContext = React.createContext(new GameLoop(1000 / 60));
export class GameLoopComponent extends React.Component<{ frameRateMs?: number, style?: Partial<StylePropContents> }, {}> {
	render() {
        const loop: GameLoop = this.context;
        console.log(`[GameLoopContext] render - current loop:`, loop); // logs: {}
        const { children, frameRateMs, ...rest } = this.props;

		return React.createElement(
            GameLoopContext.Provider,
            {
                value: new GameLoop(frameRateMs || 1000 / 60)
            },
            /* GameLoopComponent does not have access to the context that it is passing down
             * during its own componentDidMount event, so we let a renderless descendant,
             * GameLoopManager, handle it for us. */
            React.createElement(
                GameLoopManager,
                {},
                null
            ),
            children
        );
	}
}

export class GameLoopManager extends React.Component<{}, {}> {
    static contextType: React.Context<GameLoop> = GameLoopContext;

	componentDidMount() {
        const loop: GameLoop = this.context;
        console.log(`[GameLoopManager] componentDidMount - starting loop.`, loop);
        loop.start();
	}

	componentWillUnmount() {
        const loop: GameLoop = this.context;
        console.log(`[GameLoopManager] componentWillUnmount - stopping loop.`, loop);
		loop.stop();
	}

	render() {
        const loop: GameLoop = this.context;
        console.log(`[GameLoopManager] render - current loop:`, loop);
        return null;
	}
}


export class Marquee extends React.Component<{ text: string }, { index: number }> {
    private loopID: number;
    static contextType: React.Context<GameLoop> = GameLoopContext;

    constructor(props: { text: string }) {
        super(props);

        this.state = {
            index: 0
        };
    }
  
    componentDidMount() {
        const loop: GameLoop = this.context;
        console.log(`[Marquee] componentDidMount - subscribing to loop.`, loop);
        this.loopID = loop.subscribe(this.tick.bind(this));
    }
  
    componentWillUnmount() {
        const loop: GameLoop = this.context;
        console.log(`[Marquee] componentWillUnmount - unsubscribing from loop.`, loop);
        loop.unsubscribe(this.loopID);
    }
  
    tick() {
        this.setState((prev) => ({
            index: (prev.index + 1) % this.props.text.length
        }));
    }

    render(){
        const loop: GameLoop = this.context;
        // console.log(`[Marquee] render - current loop:`, loop);
        const { text } = this.props;
        const { index } = this.state;

        return React.createElement(
            ReactLabel,
            {
                text: text.slice(index, text.length)
            },
            null
        );
    }
}

// React.createElement(
//     MyButton,
//     {
//         onTap: (args: EventData) => console.log("Tapped!", args),
//         text: "Tap me!",
//         className: "btn btn-primary btn-active"
//     },
//     null
// ),

// React.createElement(
//     ReactButton,
//     {
//         onPress: (args: EventData) => console.log("Tapped!", args),
//         title: "Tap me!",
//         // className: "btn btn-primary btn-active"
//     },
//     null
// ),

export class Clock extends React.Component<{}, { date: Date }> {
    private timerID!: number;

    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }
  
    componentDidMount() {
      this.timerID = setInterval(
          () => this.tick(),
          1000
      );
    }

    shouldComponentUpdate(){
        console.log(`[Clock] shouldComponentUpdate`);
        return true;
    }

    componentWillUpdate(){
        console.log(`[Clock] componentWillUpdate`);
    }

    componentDidUpdate(){
        console.log(`[Clock] componentDidUpdate`);
    }
  
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
  
    tick() {
        this.setState({
          date: new Date()
        });
    }
  
    render() {
        console.log(`[Clock] render()!`);
        
        return React.createElement(
            ReactTextView,
            {
            },
            this.state.date.toLocaleTimeString()
        );
    }
}

export class ListViewTest extends React.Component<{}, {}> {
    render(){
        return React.createElement(
            ReactListView,
            {
                items: [
                    /* Enough cells to see how view recycling works/ doesn't work */
                    ...[...Array(7).keys()].map((val) => {
                        return { text: val };
                    })
                ],
                cellFactory: (item: any, container: ContentView) => {
                    return React.createElement(
                        "label",
                        {
                            key: container._domId,
                            text: `${item.text}`,
                            fontSize: 150,
                            // textWrap: true,
                            // class: "title"
                            
                        }
                    )
                }
            },
            null
        );
    }
}

export class GameLoopTest extends React.Component<{}, {}> {
    render(){
        return React.createElement(
            GameLoopComponent,
            {
                // frameRateMs: (1000 / 60) // Sixty times per second
                frameRateMs: 1111 // Once per second
            },
            React.createElement(
                Marquee,
                {
                    text: "NativeScript is an AMAZING framework"
                },
                null
            ),
        );
    }
}

export class DockLayoutTest extends React.Component<{}, {}> {
    render(){
        return React.createElement(
            ReactDockLayout,
            {
                width: { value: 100, unit: "%" },
                height: { value: 100, unit: "%" },
                stretchLastChild: true,
            },
            React.createElement(
                ReactButton,
                {
                    dock: "left",
                    text: "Left",
                    backgroundColor: "#0099CC",
                    onPress: () => {}
                },
                null
            ),
            React.createElement(
                ReactButton,
                {
                    dock: "top",
                    text: "Top",
                    backgroundColor: "#AA0078",
                    onPress: () => {}
                },
                null
            ),
            React.createElement(
                ReactButton,
                {
                    dock: "right",
                    text: "Right",
                    backgroundColor: "#8C489F",
                    onPress: () => {}
                },
                null
            ),
            React.createElement(
                ReactButton,
                {
                    dock: "bottom",
                    text: "Bottom",
                    backgroundColor: "#B3B3D7",
                    onPress: () => {}
                },
                null
            ),
            React.createElement(
                ReactButton,
                {
                    // dock: "bottom",
                    text: "Fill",
                    // 'grey' is invalid! D:
                    color: new Color("gray"),
                    backgroundColor: "#CCFFFF",
                    onPress: () => {}
                },
                null
            ),
        );
    }
}

export class AbsoluteLayoutTest extends React.Component<{}, {}> {
    render(){
        return React.createElement(
            ReactAbsoluteLayout,
            {
            },
            React.createElement(
                ReactButton,
                {
                    dock: "left",
                    text: "Left: 10, Top: 5",
                    left: 10,
                    top: 5,
                    backgroundColor: "#0099CC",
                    onPress: () => {}
                },
                null
            ),
            React.createElement(
                ReactButton,
                {
                    dock: "top",
                    text: "Left: 30, Top: 80",
                    left: 30,
                    top: 80,
                    backgroundColor: "#C3C3E5",
                    onPress: () => {}
                },
                null
            ),
            React.createElement(
                ReactButton,
                {
                    dock: "right",
                    text: "Left: 150, Top: 25",
                    left: 150,
                    top: 25,
                    backgroundColor: "#CCFFFF",
                    onPress: () => {}
                },
                null
            ),
            React.createElement(
                ReactButton,
                {
                    dock: "bottom",
                    text: "Left: 70, Top: 150",
                    left: 70,
                    top: 150,
                    backgroundColor: "#8C489F",
                    onPress: () => {}
                },
                null
            ),
        );
    }
}

export class FlexboxLayoutTest extends React.Component<{}, {}> {
    render(){
        return React.createElement(
            ReactFlexboxLayout,
            {
                flexDirection: "column-reverse",
                justifyContent: "space-around",
                alignItems: "stretch",
                // height: 300,
                // width: 300,
                width: { value: 100, unit: "%" },
                height: { value: 100, unit: "%" },
                backgroundColor: "lightGray"
            },
            React.createElement(
                ReactLabel,
                {
                    text: "Label 1",
                    width: 60,
                    height: 60,
                    backgroundColor: "red",
                },
                null
            ),
            React.createElement(
                ReactLabel,
                {
                    text: "Label 2",
                    alignSelf: "center",
                    width: 60,
                    height: 60,
                    backgroundColor: "green",
                },
                null
            ),
            React.createElement(
                ReactLabel,
                {
                    text: "Label 3",
                    alignSelf: "flex-end",
                    width: 60,
                    height: 60,
                    backgroundColor: "blue",
                },
                null
            ),
            React.createElement(
                ReactLabel,
                {
                    text: "Label 4",
                    width: 60,
                    height: 60,
                    backgroundColor: "yellow",
                },
                null
            ),
        );
    }
}

export class ActionBarTest extends React.Component<{}, {}> {
    render(){
        const navigationButton = new NavigationButton();
        navigationButton.text = "Go Back";
        return React.createElement(
            ReactActionBar,
            {
                navigationButton,
                // color: new Color("red"),
                // backgroundColor: new Color("blue"),
            },
            null
        );
    }
}

export class TabViewTest extends React.Component<{}, {}> {
    render(){
        return React.createElement(
            ReactTabView,
            {
                selectedIndex: 1
            },

            React.createElement(
                ReactTabViewItem,
                {
                    title: "Dock",
                    identifier: `Item 0`,
                },
                React.createElement(
                    DockLayoutTest,
                    {},
                    null
                )
            ),

            React.createElement(
                ReactTabViewItem,
                {
                    title: "Flexbox",
                    identifier: `Item 1`,
                },
                React.createElement(
                    FlexboxLayoutTest,
                    {},
                    null
                )
            ),

            React.createElement(
                ReactTabViewItem,
                {
                    title: "Clock",
                    identifier: `Item 2`,
                },
                React.createElement(
                    Clock,
                    {},
                    null
                )
            ),

            React.createElement(
                ReactTabViewItem,
                {
                    title: "Marquee",
                    identifier: `Item 3`,
                },
                React.createElement(
                    GameLoopComponent,
                    {
                        frameRateMs: 1000,
                    },
                    React.createElement(
                        Marquee,
                        {
                            text: "Have you ever seen a game-looped Marquee before?"
                        },
                        null
                    )
                )
            ),
        );
    }
}

export class SimplePage extends React.Component<
    {
        innerRef: React.RefObject<Page>,
        actionBarTitle: string,
    },
    {}
> {
    render(){
        const { children, innerRef, actionBarTitle, ...rest } = this.props;
        return React.createElement(
            ReactPage,
            {
                innerRef,
                actionBarHidden: false,
                ...rest
            },
            React.createElement(
                ReactActionBar,
                {
                    title: actionBarTitle,
                    className: "action-bar",
                },
                null
            ),
            children
        )
    }
}

export class HubTest extends React.Component<{ innerRef: React.RefObject<Page> }, { }> {

    constructor(props){
        super(props);

        // this.state = {
        //     route: "Navigation Hub",
        // }
    }

    render(){
        const absoluteLayoutPageRef = React.createRef<Page>();
        const dockLayoutPageRef = React.createRef<Page>();
        const flexboxLayoutPageRef = React.createRef<Page>();

        return React.createElement(
            ReactPage,
            {
                innerRef: this.props.innerRef,
                actionBarHidden: false,
            },

            React.createElement(
                ReactActionBar,
                {
                    title: "Navigation Hub",
                    className: "action-bar",
                },
                null
            ),

            React.createElement(
                ReactStackLayout,
                {
                },

                React.createElement(
                    ReactButton,
                    {
                        onPress: () => {
                            const page: Page|null = this.props.innerRef.current;
                            if(page === null){
                                console.error(`Unable to get reference to the immediate page!`);
                                return;
                            }
                            console.log(`Immediate page had frame:`, page.frame);
                            if(!page.frame){
                                console.error(`Unable to get reference to the immediate page's frame!`);
                                return;
                            }
                            page.frame.navigate({
                                create: () => {
                                    console.log(`Navigating to AbsoluteLayout page. Ref:`, absoluteLayoutPageRef.current);

                                    /* Also crashes it */
                                    // this.setState({ route: "AbsoluteLayout" });

                                    // this.setState({ actionBarTitle: "AbsoluteLayout" });

                                    return absoluteLayoutPageRef.current;
                                }
                            });
                        }
                    },
                    "Navigate to AbsoluteLayout"
                ),

                React.createElement(
                    ReactButton,
                    {
                        onPress: () => {
                            const page: Page = this.props.innerRef.current!;
                            page.frame.navigate({
                                create: () => {
                                    console.log(`Navigating to DockLayout page. Ref:`, dockLayoutPageRef.current);

                                    // this.setState({ actionBarTitle: "DockLayout" });

                                    return dockLayoutPageRef.current;
                                }
                            });
                        }
                    },
                    "Navigate to DockLayout"
                ),

                React.createElement(
                    ReactButton,
                    {
                        onPress: () => {
                            const page: Page = this.props.innerRef.current!;
                            page.frame.navigate({
                                create: () => {
                                    console.log(`Navigating to FlexboxLayout page. Ref:`, flexboxLayoutPageRef.current);

                                    // this.setState({ actionBarTitle: "FlexboxLayout" });

                                    return flexboxLayoutPageRef.current;
                                }
                            });
                        }
                    },
                    "Navigate to FlexboxLayout"
                ),
            ),


            ReactNativeScript.createPortal(
                React.createElement(
                    SimplePage,
                    {
                        innerRef: absoluteLayoutPageRef,
                        actionBarTitle: "AbsoluteLayout",
                    },
                    React.createElement(
                        AbsoluteLayoutTest,
                        {},
                        null
                    )
                ),
                absoluteLayoutPageRef.current,
                "Portal('AbsoluteLayout')"
            ),

            ReactNativeScript.createPortal(
                React.createElement(
                    SimplePage,
                    {
                        innerRef: dockLayoutPageRef,
                        actionBarTitle: "DockLayout",
                    },
                    React.createElement(
                        DockLayoutTest,
                        {},
                        null
                    )
                ),
                dockLayoutPageRef.current,
                "Portal('DockLayout')"
            ),

            ReactNativeScript.createPortal(
                React.createElement(
                    SimplePage,
                    {
                        innerRef: flexboxLayoutPageRef,
                        actionBarTitle: "FlexboxLayout",
                    },
                    React.createElement(
                        FlexboxLayoutTest,
                        {},
                        null
                    )
                ),
                flexboxLayoutPageRef.current,
                "Portal('FlexboxLayout')"
            ),
        );
    }
}