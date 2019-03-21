import { default as requireNativeComponent } from "../../ReactNativeScript/requireNativeComponent";
import { ViewProps } from "./ViewPropTypes";

// const ReactNative = require('ReactNative');

/* https://github.com/facebook/react-native/blob/1151c096dab17e5d9a6ac05b61aacecd4305f3db/Libraries/ReactNative/requireNativeComponent.js
 * react-native/Libraries/ReactNative/requireNativeComponent.js */
// const requireNativeComponent = require('requireNativeComponent');

// import { ViewProps } from './ViewPropTypes';

// type ViewNativeComponentType = Class<ReactNative.NativeComponent<ViewProps>>;
// export type ViewNativeComponentType = React.RefForwardingComponent<{}, ViewProps>;
export type ViewNativeComponentType = any;

export default requireNativeComponent('RCTView');

// module.exports = ((NativeViewComponent: any): ViewNativeComponentType);