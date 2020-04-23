import * as React from "react";
import { PercentLength, FormattedString } from "tns-core-modules/ui/text-base/text-base";
import { Color } from "tns-core-modules/color";
import { Span } from "tns-core-modules/text/span";
import { ContentView, TextBase, ViewBase, StackLayout, Label, TabView, Page, ProxyViewContainer, Switch, Slider } from "react-nativescript/dist/client/ElementRegistry";
import { ViewProps, StylePropContents } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import {
    $Button,
    $ContentView,
    $TextView,
    $Label,
    $Switch,
    $Slider,
    $ListPicker,
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
    $TimePicker,
    $DatePicker,
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
            "label",
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
//         onTap: (args: EventData) => console.log("Tapped!", args),
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
            "textView",
            {
            },
            this.state.date.toLocaleTimeString()
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

export class SwitchTest extends React.Component<{}, { checked: boolean }> {
    constructor(props) {
        super(props);

        this.state = {
            checked: true,
        };
    }

    render() {
        console.log(`RENDER`);

        return (
            React.createElement(
                "stackLayout",
                {},

                React.createElement(
                    "switch",
                    {
                        checked: this.state.checked,
                        onToggle: (args) => {
                            const checked: boolean = args.object.checked;
                            console.log(`[Master switch] now:`, checked);
                            this.setState((state) => ({ checked }), () => {
                                console.log(`[Master switch] Synced the checked state to ${checked}.`);
                            });
                        }
                    },
                    null,
                ),

                React.createElement(
                    "switch",
                    {
                        isEnabled: false,
                        checked: this.state.checked,
                        onToggle: (args) => {
                            const checked: boolean = args.object.checked;
                            console.log(`[Subordinate switch] now:`, checked);
                        }
                    },
                    null,
                ),
            )
        );
    }
}

export class SliderTest extends React.Component<{}, { value: number }> {
    // private readonly ownRef: React.RefObject<Slider> = React.createRef<Slider>();
    private readonly minValue: number = 0;
    private readonly maxValue: number = 1;

    constructor(props) {
        super(props);

        this.state = {
            value: this.maxValue / 2,
        };
    }

    render() {
        const fraction: number = this.state.value * 255;

        return (
            React.createElement(
                "stackLayout",
                {},

                React.createElement(
                    "slider",
                    {
                        value: this.state.value,
                        minValue: this.minValue,
                        maxValue: this.maxValue,
                        color: new Color(255, fraction, fraction, fraction),
                        onValueChange: (args) => {
                            const value: number = args.object.value;
                            this.setState({ value });
                        }
                    },
                    null,
                ),

                React.createElement(
                    "slider",
                    {
                        isEnabled: false,
                        value: this.state.value,
                        minValue: this.minValue,
                        maxValue: this.maxValue,
                        color: new Color(255, fraction, fraction, fraction),
                        onValueChange: (args) => {
                            const value: number = args.object.value;
                        }
                    },
                    null,
                ),
            )
        );
    }
}

export class TimePickerTest extends React.Component<{}, { time: Date }> {
    private readonly minHour: number = 0;
    private readonly maxHour: number = 23;
    private readonly minMinute: number = 0;
    private readonly maxMinute: number = 59;
    private readonly minuteInterval: number = 1;

    constructor(props) {
        super(props);

        this.state = {
            time: new Date(),
        };
    }

    render() {
        const fraction: number = this.state.time.getHours() / 24;
        const oppositeFraction: number = 1 - fraction;
        const colourFraction: number = fraction * 255;
        const oppositeColourFraction: number = oppositeFraction * 255;

        return (
            React.createElement(
                "stackLayout",
                {},

                React.createElement(
                    "timePicker",
                    {
                        time: this.state.time,
                        minHour: this.minHour,
                        maxHour: this.maxHour,
                        minMinute: this.minMinute,
                        maxMinute: this.maxMinute,
                        minuteInterval: this.minuteInterval,
                        color: new Color(255, colourFraction, colourFraction, colourFraction),
                        backgroundColor: new Color(255, oppositeColourFraction, oppositeColourFraction, oppositeColourFraction),
                        onTimeChange: (args) => {
                            const time: Date = args.object.time;
                            this.setState({ time });
                        }
                    },
                    null,
                ),

                React.createElement(
                    "timePicker",
                    {
                        isEnabled: false,
                        time: this.state.time,
                        minHour: this.minHour,
                        maxHour: this.maxHour,
                        minMinute: this.minMinute,
                        maxMinute: this.maxMinute,
                        color: new Color(255, colourFraction, colourFraction, colourFraction),
                        backgroundColor: new Color(255, oppositeColourFraction, oppositeColourFraction, oppositeColourFraction),
                        onTimeChange: (args) => {
                        }
                    },
                    null,
                ),
            )
        );
    }
}

export class DatePickerTest extends React.Component<{}, { date: Date }> {
    private readonly minDate: Date = new Date("1991-06-23T12:00:00");
    private readonly maxDate: Date = new Date("1994-05-27T12:00:00");

    constructor(props) {
        super(props);

        this.state = {
            date: new Date(),
        };
    }

    render() {
        return (
            React.createElement(
                "stackLayout",
                {},

                React.createElement(
                    "textView",
                    {},
                    `Uncontroversial calendar of good Sonic games (1991 - 1994).\n\nSelecting values beyond 27th May 1994 is prevented, because of course there were no good Sonic games after Sonic 3.\n\nBottom calendar is disabled, but inherits state.`
                ),

                React.createElement(
                    "datePicker",
                    {
                        date: this.state.date,
                        minDate: this.minDate,
                        maxDate: this.maxDate,
                        onDateChange: (args) => {
                            const date: Date = args.object.date;
                            console.log(`[onDateChange()]`, date);
                            this.setState({ date });
                        }
                    },
                    null,
                ),

                React.createElement(
                    "datePicker",
                    {
                        isEnabled: false,
                        date: this.state.date,
                        minDate: this.minDate,
                        maxDate: this.maxDate,
                        onDateChange: (args) => {
                        }
                    },
                    null,
                ),
            )
        );
    }
}

export class ListPickerTest extends React.Component<{}, { selectedLocationIndex: number, selectedWeatherIndex: number, }> {
    private readonly weathers: string[][] = [
        ["Rainy"],
        ["Sunny", "Cloudy", "Rainy", "Snowy"]
    ];
    private readonly locations: string[] = [
        "The UK",
        "Every other temperate country",
    ];

    constructor(props) {
        super(props);

        this.state = {
            selectedLocationIndex: 0,
            selectedWeatherIndex: 0,
        };
    }

    render() {
        return (
            React.createElement(
                "stackLayout",
                {},

                React.createElement(
                    "label",
                    {},
                    `Locations`
                ),

                React.createElement(
                    "listPicker",
                    {
                        backgroundColor: new Color("pink"),
                        items: this.locations,
                        selectedIndex: this.state.selectedLocationIndex,
                        onSelectedIndexChange: (args) => {
                            this.setState({
                                selectedLocationIndex: args.object.selectedIndex,
                                selectedWeatherIndex: 0,
                            });
                        }
                    },
                    null,
                ),

                React.createElement(
                    "label",
                    {},
                    `Weathers`
                ),

                React.createElement(
                    "listPicker",
                    {
                        backgroundColor: new Color("pink"),
                        items: this.weathers[this.state.selectedLocationIndex],
                        // isEnabled: false, /* Has no effect on ListPicker! Arguably a bug in core. */
                        selectedIndex: this.state.selectedWeatherIndex,
                        onSelectedIndexChange: (args) => {
                            this.setState({ selectedWeatherIndex: args.object.selectedIndex });
                        }
                    },
                    null,
                ),
            )
        );
    }
}