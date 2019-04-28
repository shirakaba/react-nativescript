import * as React from "react";
import { ViewProps, TextBaseProps, ContentViewProps } from "../shared/NativeScriptComponentTypings";
import { View as NativeScriptView, ShownModallyData } from "tns-core-modules/ui/core/view/view";
import { ContentView as NativeScriptContentView } from "tns-core-modules/ui/content-view/content-view";
import { EventData } from "tns-core-modules/data/observable/observable";
import { isAndroid, isIOS } from "tns-core-modules/platform/platform";
import { Color } from "tns-core-modules/color/color";
import { updateListener } from "../client/EventHandling";
import { Dock } from "tns-core-modules/ui/layouts/dock-layout/dock-layout";
import { GestureEventData, GestureTypes } from "tns-core-modules/ui/gestures/gestures";

interface Props {
    dock?: Dock;

    /* From View. */
    onLoaded?: (args: EventData) => void;
    onUnloaded?: (args: EventData) => void;
    onAndroidBackPressed?: (args: EventData) => void;
    onShowingModally?: (args: ShownModallyData) => void;
    onShownModally?: (args: ShownModallyData) => void;

    /* The gesture handlers. */
    onTap?: (args: GestureEventData) => void;
    onDoubleTap?: (args: GestureEventData) => void;
    onPinch?: (args: GestureEventData) => void;
    onPan?: (args: GestureEventData) => void;
    onSwipe?: (args: GestureEventData) => void;
    onRotation?: (args: GestureEventData) => void;
    onLongPress?: (args: GestureEventData) => void;
    onTouch?: (args: GestureEventData) => void;

    /* These are to be overridden in subclasses of View, so unlikely to be appropriate. */
    // onLayout?: (left: number, top: number, right: number, bottom: number) => void;
    // onMeasure?: (widthMeasureSpec: number, heightMeasureSpec: number) => void;

    /* Not familiar with these (from ViewBase), so shall omit. */
    // onLoaded?: () => void;
    // onUnloaded?: () => void;

    /* From Observable. */
    onPropertyChange?: (data: EventData) => void;
}

export type ViewComponentProps = Props & Partial<ContentViewProps>;

/**
 * A React wrapper around the NativeScript View component.
 * https://facebook.github.io/react-native/docs/View#color
 */
// export class View extends React.Component<Props & ViewBaseProp<NativeScriptContentView>, {}> {
export class ContentView extends React.Component<ViewComponentProps, {}> {
    private readonly myRef: React.RefObject<NativeScriptContentView> = React.createRef<NativeScriptContentView>();

    /** From ui/core/view */
    private readonly _onLoaded = (args: EventData) => this.props.onLoaded && this.props.onLoaded(args);
    private readonly _onUnloaded = (args: EventData) => this.props.onUnloaded && this.props.onUnloaded(args);
    private readonly _onAndroidBackPressed = (args: EventData) => this.props.onAndroidBackPressed && this.props.onAndroidBackPressed(args);
    private readonly _onShowingModally = (args: ShownModallyData) => this.props.onShowingModally && this.props.onShowingModally(args);
    private readonly _onShownModally = (args: ShownModallyData) => this.props.onShownModally && this.props.onShownModally(args);
    
    /** From ui/gestures. */
    private readonly _onTap = (args: GestureEventData) => this.props.onTap && this.props.onTap(args);
    private readonly _onDoubleTap = (args: GestureEventData) => this.props.onDoubleTap && this.props.onDoubleTap(args);
    private readonly _onPinch = (args: GestureEventData) => this.props.onPinch && this.props.onPinch(args);
    private readonly _onPan = (args: GestureEventData) => this.props.onPan && this.props.onPan(args);
    private readonly _onSwipe = (args: GestureEventData) => this.props.onSwipe && this.props.onSwipe(args);
    private readonly _onRotation = (args: GestureEventData) => this.props.onRotation && this.props.onRotation(args);
    private readonly _onLongPress = (args: GestureEventData) => this.props.onLongPress && this.props.onLongPress(args);
    private readonly _onTouch = (args: GestureEventData) => this.props.onTouch && this.props.onTouch(args);
    
    /** From data/observable. */
    private readonly _onPropertyChange = (data: EventData) => this.props.onPropertyChange && this.props.onPropertyChange(data);

    componentDidMount(){
        const node: NativeScriptContentView|null = this.myRef.current;
        if(node){
            node.on("loaded", this._onLoaded);
            node.on("unloaded", this._onUnloaded);
            node.on("androidBackPressed", this._onAndroidBackPressed);
            node.on("showingModally", this._onShowingModally);
            node.on("shownModally", this._onShownModally);
            node.on("propertyChange", this._onPropertyChange);
            node.on(GestureTypes.tap, this._onTap);
            node.on(GestureTypes.doubleTap, this._onDoubleTap);
            node.on(GestureTypes.pinch, this._onPinch);
            node.on(GestureTypes.pan, this._onPan);
            node.on(GestureTypes.swipe, this._onSwipe);
            node.on(GestureTypes.rotation, this._onRotation);
            node.on(GestureTypes.longPress, this._onLongPress);
            node.on(GestureTypes.touch, this._onTouch);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to attach event listeners.`);
        }
    }

    componentWillUnmount(){
        const node: NativeScriptContentView|null = this.myRef.current;
        if(node){
            node.off("loaded", this._onLoaded);
            node.off("unloaded", this._onUnloaded);
            node.off("androidBackPressed", this._onAndroidBackPressed);
            node.off("showingModally", this._onShowingModally);
            node.off("shownModally", this._onShownModally);
            node.off(GestureTypes.tap, this._onTap);
            node.off(GestureTypes.doubleTap, this._onDoubleTap);
            node.off(GestureTypes.pinch, this._onPinch);
            node.off(GestureTypes.pan, this._onPan);
            node.off(GestureTypes.swipe, this._onSwipe);
            node.off(GestureTypes.rotation, this._onRotation);
            node.off(GestureTypes.longPress, this._onLongPress);
            node.off(GestureTypes.touch, this._onTouch);
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to clean up event listeners.`);
        }
    }

    render(){
        const {
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

        return React.createElement(
            'contentView',
            {
                ...rest,
                ref: this.myRef
            },
            children
        );
    }
}