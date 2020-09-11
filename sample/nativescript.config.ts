import { NativeScriptConfig } from '@nativescript/core';

export default {
    id: 'uk.co.birchlabs.rnssample',
    appResourcesPath: 'App_Resources',
    useLegacyWorkflow: false,
    ios: {
        discardUncaughtJsExceptions: false,
    },
    android: {
        discardUncaughtJsExceptions: false,
        v8Flags: '--nolazy --expose_gc',
        markingMode: "none",
        suppressCallJSMethodExceptions: false,
    }
} as NativeScriptConfig;