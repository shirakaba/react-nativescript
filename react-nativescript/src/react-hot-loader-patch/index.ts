/*
Adatped from: https://github.com/gaearon/react-hot-loader/blob/0c7947421a6b1dd20c0bb3bfe12327c591013eb2/src/webpack/patch.js

MIT License

Copyright (c) 2016 Dan Abramov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
const injectionStart = {
    '16.6': [
      'if (child.tag === Fragment ? element.type === REACT_FRAGMENT_TYPE : child.elementType === element.type)',
      'if (child.tag === Fragment ? element.type === REACT_FRAGMENT_TYPE : hotCompareElements(child.elementType, element.type, hotUpdateChild(child), child.type))',
    ],
    '16.6-compact': [
      'if(child.tag===Fragment?element.type===REACT_FRAGMENT_TYPE:child.elementType===element.type)',
      'if(child.tag===Fragment?element.type===REACT_FRAGMENT_TYPE:hotCompareElements(child.elementType,element.type, hotUpdateChild(child), child.type))',
    ],
    '16.4': [
      'if (child.tag === Fragment ? element.type === REACT_FRAGMENT_TYPE : child.type === element.type) {',
      'if (child.tag === Fragment ? element.type === REACT_FRAGMENT_TYPE : hotCompareElements(child.type, element.type, hotUpdateChild(child), child.type)) {',
    ],
    '16.4-compact': [
      'if(child.tag===Fragment?element.type===REACT_FRAGMENT_TYPE:child.type===element.type)',
      'if(child.tag===Fragment?element.type===REACT_FRAGMENT_TYPE:hotCompareElements(child.type,element.type, hotUpdateChild(child), child.type))',
    ],
  };
  
  const additional = {
    '16.6-update': [
      'if (current$$1 !== null && current$$1.elementType === element.type) {',
      'if (current$$1 !== null && hotCompareElements(current$$1.elementType, element.type, hotUpdateChild(current$$1),current$$1.type)) {',
    ],
    '16.6-update-compact': [
      'if(current$$1!==null&&current$$1.elementType===element.type)',
      'if(current$$1!==null&&hotCompareElements(current$$1.elementType,element.type,hotUpdateChild(current$$1),current$$1.type))',
    ],
    '16.4-update': [
      'if (current !== null && current.type === element.type) {',
      'if (current !== null && hotCompareElements(current.type, element.type, hotUpdateChild(current),current.type)) {',
    ],
    '16.4-update-compact': [
      'if (current!== null&&current.type===element.type)',
      'if (current!== null&&hotCompareElements(current.type,element.type,hotUpdateChild(current)))',
    ],
  };
  
  const ReactHotLoaderInjection = `
  var hotUpdateChild = function (child) {
    return function (newType) {
      child.type = newType;
      if (child.alternate) {
        child.alternate.type = newType;
      }
    }
  };
  var hotCompareElements = function (oldType, newType) {
    return oldType === newType
  };
  var hotCleanupHooks = function () {
    if (typeof resetHooks !== 'undefined') {
       resetHooks();
    }
  }
  var ReactNativeScript = {
    evalInReactContext: function (injection) {
      return eval(injection);
    },
    hotCleanup: hotCleanupHooks,
    hotRenderWithHooks: function (current, render) {       
      hotCleanupHooks();
      
      if (typeof nextCurrentHook !== 'undefined' && typeof ReactCurrentDispatcher$1 !== 'undefined') {    
        nextCurrentHook = current !== null ? current.memoizedState : null;
        if(typeof firstCurrentHook !== 'undefined') {
          firstCurrentHook = nextCurrentHook;
        }
        
        ReactCurrentDispatcher$1.current = nextCurrentHook === null ? HooksDispatcherOnMountInDEV : HooksDispatcherOnUpdateInDEV;
      }
      
      var rendered = render();
      
      hotCleanupHooks();
      
      return rendered;
    },
    setHotElementComparator: function (newComparator) {
      hotCompareElements = newComparator
    },
  `;
  
  const defaultEnd = ['var ReactNativeScript = {', ReactHotLoaderInjection];
  
  const defaultEndCompact = ['var ReactNativeScript={', ReactHotLoaderInjection];
  
  const injectionEnd = {
    '16.6': defaultEnd,
    '16.4': defaultEnd,
    '16.6-compact': defaultEndCompact,
    '16.4-compact': defaultEndCompact,
  };
  
  const sign = '/* 🔥 this is hot-loader/react-nativescript 🔥 */';
  
  function additionalTransform(source) {
    for (const key in additional) {
      source = source.split(additional[key][0]).join(additional[key][1]);
    }
    return source;
  }
  
  function transform(source) {
    if (source.indexOf('reconcileSingleElement') < 0) {
      // early reject
      return source;
    }
    if (source.indexOf(sign) >= 0) {
      // already patched
      return source;
    }
    for (const key in injectionStart) {
      if (source.indexOf(injectionStart[key][0]) > 0 && source.indexOf(injectionEnd[key][0]) > 0) {
        const result = additionalTransform(
          source
            .replace(injectionStart[key][0], injectionStart[key][1])
            .replace(injectionEnd[key][0], injectionEnd[key][1]),
        );
        return `${sign}\n${result}\n${sign}`;
      }
    }
    return source;
  }
  
  module.exports = transform;