import * as React from "react";
import { ProgressProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { Progress as NativeScriptProgress } from "tns-core-modules/ui/progress/progress";
import { ViewComponentProps, RCTView } from "./View";
// import { Observable } from "../client/ElementRegistry";
// import { EventData } from "tns-core-modules/data/observable/observable";

interface Props {
}

export type ProgressComponentProps<E extends NativeScriptProgress = NativeScriptProgress> = Props /* & typeof Progress.defaultProps */ & Partial<ProgressProps> & ViewComponentProps<E>;

export class _Progress<P extends ProgressComponentProps<E>, S extends {}, E extends NativeScriptProgress> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptProgress>()
    // };

    /* Not sure there's really a use-case for Observable here, given that we're using React.
    * Was replicating: https://docs.nativescript.org/ui/ns-ui-widgets/progress */
    // private readonly vm = new Observable();
    // componentDidMount(){
    //     super.componentDidMount();

    //     this.vm.set("prResult", this.props.value);

    //     const ref = this.props.forwardedRef || this.myRef;
    //     const node: E|null = ref.current;
    //     if(node){
    //         node.on("valueChange", (pargs: EventData) => {
    //             this.vm.set("prResult", (<NativeScriptProgress>pargs.object).value);
    //         });
    //     } else {
    //         console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
    //     }
    // }

    render(): React.ReactNode {
        const {
            forwardedRef,

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
            'progress',
            {
                ...rest,
                ref: forwardedRef || this.myRef
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<ProgressComponentProps<NativeScriptProgress>>;

export const Progress: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptProgress>> = React.forwardRef<NativeScriptProgress, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptProgress>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _Progress,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)