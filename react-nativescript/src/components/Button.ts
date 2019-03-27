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
    private onPressListener: (args: EventData) => void;

    componentDidMount(){

    }

    componentWillUnmount(){

    }

    render(){
        const { title, disabled, color, onPress, ...rest } = this.props;

        return React.createElement(
                'Button',
                {
                    ...rest,
                    [isIOS ? "color" : "backgroundColor"]: color, // Should this be done inside style instead?
                    text: title, // From TextBase
                    isEnabled: !!disabled,
                    /** 
                     * Under consideration. We'll have to make sure that we don't lose reference to previous onPress
                     * callback upon any props changes. Ideally, attaching and removing should be done by the
                     * component, not the renderer, in any case...
                     */
                    _attachEventListeners: (button: NativeScriptButton) => {
                        button.on(NativeScriptButton.tapEvent as "tap", onPress);
                    },
                    _removeEventListeners: (button: NativeScriptButton) => {
                        button.removeEventListener(NativeScriptButton.tapEvent as "tap", onPress);
                    },
                    className: "btn btn-primary btn-active", // NativeScript defaults from documentation
                    style: {

                    }
                }
            );
    }
}