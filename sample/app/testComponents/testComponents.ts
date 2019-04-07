import * as React from "react";
import { ReactHTML, FunctionComponent } from "react";
import { on, run, launchEvent, getMainEntry, getRootView, LaunchEventData } from "tns-core-modules/application";
import { default as ReactNativeScript } from "react-nativescript/dist/index";
import { Frame } from "tns-core-modules/ui/frame/frame";
import { ContentView } from "tns-core-modules/ui/content-view/content-view";
import { EventData } from "tns-core-modules/data/observable/observable";
import { TextBase, ViewBase, PercentLength } from "tns-core-modules/ui/text-base/text-base";
import { TextField } from "tns-core-modules/ui/text-field/text-field";
import { TextView } from "tns-core-modules/ui/text-view/text-view";
import { Page } from "tns-core-modules/ui/page/page";
import { Color } from "tns-core-modules/color";
import { FlexboxLayout as NativeScriptFlexboxLayout } from "tns-core-modules/ui/layouts/flexbox-layout/flexbox-layout";
import { FlexboxLayout } from "react-nativescript/dist/components/FlexboxLayout";
import { Button } from "tns-core-modules/ui/button/button";
import { Button as ReactButton } from "react-nativescript/dist/components/Button";
import { View as ReactView } from "react-nativescript/dist/components/View";
import { TextView as ReactTextView } from "react-nativescript/dist/components/TextView";
import { ViewProps } from "react-nativescript/dist/components/NativeScriptComponentTypings";

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
            ReactView,
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
                ReactView,
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

export class FlexboxLayoutTest1 extends React.Component<{}, {}> {
    render(){
        return React.createElement(
            FlexboxLayout,
            {
                style: {
                    alignItems: "center",
                    justifyContent: "space-between",
                },
            },
            // React.createElement(
            //     'ContentView',
            //     {
            //         backgroundColor: new Color("blue"),
            //         width: 75,
            //         height: 100
            //     }
            // ),
            // React.createElement(
            //     'ContentView',
            //     {
            //         backgroundColor: new Color("red"),
            //         width: 75,
            //         height: 80
            //     }
            // ),
            // React.createElement(
            //     'ContentView',
            //     {
            //         backgroundColor: new Color("yellow"),
            //         width: 75,
            //         height: 140
            //     }
            // ),
            // React.createElement(
            //     'ContentView',
            //     {
            //         backgroundColor: new Color("lightgreen"),
            //         width: 75,
            //         height: 70
            //     }
            // ),
            React.createElement(
                ReactView,
                {
                    style: {
                        backgroundColor: new Color("blue"),
                        width: 75,
                        height: 100
                    },
                }
            ),
            // React.createElement(
            //     ReactView,
            //     {
            //         style: {
            //             backgroundColor: new Color("red"),
            //             width: 75,
            //             height: 80
            //         },
            //     }
            // ),
            // React.createElement(
            //     ReactView,
            //     {
            //         style: {
            //             backgroundColor: new Color("yellow"),
            //             width: 75,
            //             height: 140
            //         },
            //     }
            // ),
            // React.createElement(
            //     ReactView,
            //     {
            //         style: {
            //             backgroundColor: new Color("lightgreen"),
            //             width: 75,
            //             height: 70
            //         },
            //     }
            // ),
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