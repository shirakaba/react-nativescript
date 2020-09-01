import { NativeScriptConfig } from '@nativescript/core';

export default {
    id: 'uk.co.birchlabs.rnssample',
    main: 'app.js',
    appResourcesPath: 'App_Resources',
    useLegacyWorkflow: false,
    webpackConfigPath: './react-nativescript.webpack.config.js',
    ios: {
        discardUncaughtJsExceptions: true,
    },
    android: {
        discardUncaughtJsExceptions: true,
        v8Flags: '--nolazy --expose_gc',
        markingMode: "none",
        suppressCallJSMethodExceptions: false,
    }
} as NativeScriptConfig;