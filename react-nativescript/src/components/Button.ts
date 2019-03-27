import * as React from "react";
import { ViewBaseProps, TextBaseProps } from "./NativeScriptComponentTypings";
import { Button as NativeScriptButton } from "tns-core-modules/ui/button/button";
import { EventData } from "tns-core-modules/data/observable/observable";
import { isAndroid, isIOS } from "tns-core-modules/platform/platform";
import { Color } from "tns-core-modules/color/color";

/**
 * From React Native's 'ButtonProps' interface.
 */
interface Props {
    title: string;
    onPress: (args: EventData) => void;
    /**
     * Colour of the text (iOS) or background colour (Android)
     */
    color?: string | Color;
    accessibilityLabel?: string; // FIXME: Does accessibility even exist in NativeScript?
    disabled?: boolean;

    /**
     * Used to locate this button in end-to-end tests.
     */
    testID?: string;
}

/**
 * A React wrapper around the NativeScript Button component.
 * https://facebook.github.io/react-native/docs/button#color
 */
/* I can't figure out a friendly typing for the IntrinsicAttributes (we need a non-hacky DeepPartial type, really) */
// export class Button extends React.Component<Props & ViewBaseProp<NativeScriptButton>, {}> {
export class Button extends React.Component<Props & Partial<TextBaseProps>, {}> {
    private readonly myRef: React.RefObject<NativeScriptButton> = React.createRef<NativeScriptButton>();

    /* Called before render():
     * http://busypeoples.github.io/post/react-component-lifecycle/
     * Ref gets assigned only after this:
     * https://stackoverflow.com/questions/28662624/reactjs-componentdidmount-render 
     * Docs:
     * https://reactjs.org/docs/refs-and-the-dom.html#creating-refs */
    componentDidMount(){
        const node: NativeScriptButton|null = this.myRef.current;
        if(node) node.on("tap", this.props.onPress);
    }

    componentWillUnmount(){
        const node: NativeScriptButton|null = this.myRef.current;
        if(node){
            node.off("tap", this.props.onPress);
        } else {
            console.warn(`React ref to NativeScript Button lost, so unable to clean up event listeners.`);
        }
    }

    render(){
        const { title, disabled, color, onPress, ...rest } = this.props;

        return React.createElement(
                'Button',
                {
                    ...rest,
                    [isIOS ? "color" : "backgroundColor"]: color, // Should this be done inside style instead?
                    text: title, // From TextBase
                    isEnabled: !!!disabled,
                    className: "btn btn-primary btn-active", // NativeScript defaults from documentation
                    style: {

                    },
                    ref: this.myRef
                }
            );
    }
}