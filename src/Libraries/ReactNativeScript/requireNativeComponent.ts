// TODO
const createReactNativeComponentClass = require('createReactNativeComponentClass');
const getNativeComponentAttributes = require('getNativeComponentAttributes');

/**
 * Creates values that can be used like React components which represent native
 * view managers. You should create JavaScript modules that wrap these values so
 * that the results are memoized. Example:
 *
 *   const View = requireNativeComponent('RCTView');
 *
 */
export default (uiViewClassName: string): string =>
  createReactNativeComponentClass(uiViewClassName, () =>
    getNativeComponentAttributes(uiViewClassName),
  );