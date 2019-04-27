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
import { PageComponentProps } from "react-nativescript/dist/components/Page";

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
