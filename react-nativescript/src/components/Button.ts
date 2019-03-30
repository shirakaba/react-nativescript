import * as React from "react";
import { ViewBaseProps, TextBaseProps } from "./NativeScriptComponentTypings";
import { Button as NativeScriptButton } from "tns-core-modules/ui/button/button";
import { EventData } from "tns-core-modules/data/observable/observable";
import { isAndroid, isIOS } from "tns-core-modules/platform/platform";
import { Color } from "tns-core-modules/color/color";
import { updateListener } from "./eventHandling";

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
    disabled?: boolean;
}

type ButtonComponentProps = Props & Partial<TextBaseProps>;

/**
 * A React wrapper around the NativeScript Button component.
 * https://facebook.github.io/react-native/docs/button#color
 */
// export class Button extends React.Component<Props & ViewBaseProp<NativeScriptButton>, {}> {
export class Button extends React.Component<ButtonComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptButton> = React.createRef<NativeScriptButton>();

    /* Called before render():
     * http://busypeoples.github.io/post/react-component-lifecycle/
     * Ref gets assigned only after this:
     * https://stackoverflow.com/questions/28662624/reactjs-componentdidmount-render 
     * Docs:
     * https://reactjs.org/docs/refs-and-the-dom.html#creating-refs */
    componentDidMount(){
        const node: NativeScriptButton|null = this.myRef.current;
        if(node){
            if(this.props.onPress){
                node.on("tap", this.props.onPress);
            }
        }
    }

    shouldComponentUpdate(nextProps: ButtonComponentProps, nextState: {}): boolean {
        // TODO: check whether this is the ideal lifecycle function to do this in.
        if(nextProps.onPress !== this.props.onPress){
            const node: NativeScriptButton|null = this.myRef.current;
            if(node){
                updateListener(node, "tap", this.props.onPress, nextProps.onPress);
            } else {
                console.warn(`React ref to NativeScript Button lost, so unable to clean up event listeners.`);
            }
        }
        return true;
    }

    componentWillUnmount(){
        const node: NativeScriptButton|null = this.myRef.current;
        if(node){
            if(this.props.onPress){
                node.off("tap", this.props.onPress);
            }
        } else {
            console.warn(`React ref to NativeScript Button lost, so unable to update event listeners.`);
        }
    }

    render(){
        const { title, disabled, color, onPress, style, children, ...rest } = this.props;

        return React.createElement(
                'Button',
                {
                    ...rest,
                    [isIOS ? "color" : "backgroundColor"]: color, // Should this be done inside style instead?
                    text: title, // From TextBase
                    isEnabled: !!!disabled,
                    className: "btn btn-primary btn-active", // NativeScript defaults from documentation
                    style,
                    ref: this.myRef
                },
                children // Weird that a button may contain children, but what do I know.
            );
    }
}