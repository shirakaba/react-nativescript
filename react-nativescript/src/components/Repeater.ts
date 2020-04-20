/**
 * Repeater cannot be translated to React, as its APIs are insufficient to make use of itemTemplate even in NativeScript Core
 * (there's no 'item' param) - I think it's heavily coupled to the assumption that the XML builder method will be used.
 * In any case, it is a redundant component, given React's declarative nature.
 * Commenting out my investigatory attempt to dissuade others from attempting in future!
 */
// import * as console from "../shared/Logger";
// import * as React from "react";
// import { CustomLayoutViewProps, RepeaterProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
// import { Repeater as NativeScriptRepeater } from "tns-core-modules/ui/repeater/repeater";
// import { RCTCustomLayoutView, CustomLayoutViewComponentProps } from "./CustomLayoutView";

// type ViewFactory = ((item: any, ref: React.RefObject<any>) => React.ReactElement);

// interface Props {
//     /* Default value is StackLayout with orientation="vertical". */
//     // itemsLayout
//     viewFactory: ViewFactory,
// }

// export type RepeaterComponentProps<E extends NativeScriptRepeater = NativeScriptRepeater> = Props /* & typeof Repeater.defaultProps */ & Partial<RepeaterProps> & CustomLayoutViewComponentProps<E>;

// /**
//  * The Repeater widget allows you to display a collection of data, which is present in an array.
//  */
// export class _Repeater<P extends RepeaterComponentProps<E>, S extends {}, E extends NativeScriptRepeater> extends RCTCustomLayoutView<P, S, E> {

//     componentDidMount(){
//         super.componentDidMount();

//         const ref = this.props.forwardedRef || this.myRef;

//         const node: E|null = ref.current;
//         if(node){
//             /* NOTE: does not support updating of this.props.itemTemplate upon Props update. */
//             // ref.current.itemTemplate = this.props.viewFac
//             // this.props.viewFactory = () => {

//             // };
//             // ref.current.itemTemplate = () => {
//             //     ReactNativeScript.render(
//             //         this.props.viewFactory(item, ref),
//             //         null,
//             //         () => {},
//             //         `Repeater(${ref.current._domId})`
//             //     );
//             // };
//         } else {
//             console.warn(`React ref to NativeScript View lost, so unable to set item templates.`);
//         }
//     }

//     render(){
//         const {
//             forwardedRef,

//             onLoaded,
//             onUnloaded,
//             onAndroidBackPressed,
//             onShowingModally,
//             onShownModally,

//             onTap,
//             onDoubleTap,
//             onPinch,
//             onPan,
//             onSwipe,
//             onRotation,
//             onLongPress,
//             onTouch,

//             onPropertyChange,

//             children,

//             ...rest
//         } = this.props;

//         return React.createElement(
//             'repeater',
//             {
//                 ...rest,
//                 ref: forwardedRef || this.myRef
//             },
//             null
//         );
//     }
// }

// type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<RepeaterComponentProps<NativeScriptRepeater>>;

// export const Repeater: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptRepeater>> = React.forwardRef<NativeScriptRepeater, OwnPropsWithoutForwardedRef>(
//     (props: OwnPropsWithoutForwardedRef, ref: React.RefObject<NativeScriptRepeater>) => {
//         const { ...rest } = props;

//         return React.createElement(
//             _Repeater,
//             {
//                 ...rest,
//                 forwardedRef: ref,
//             },
//             /* No children allowed. */
//             null
//         );
//     }
// )
