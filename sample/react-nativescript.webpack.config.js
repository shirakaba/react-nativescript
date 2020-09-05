/**
 * @see https://github.com/NativeScript/NativeScript/tree/feat/ns7-finishing-touches/packages/webpack/templates
 * @see https://github.com/NativeScript/NativeScript/pull/8801/files
 */
const webpackConfig = require("./webpack.typescript");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (env) => {
    env = env || {};
    const hmr = env.hmr;
    const production = env.production;
    const isAnySourceMapEnabled = !!env.sourceMap || !!env.hiddenSourceMap;

    const babelOptions = {
        sourceMaps: isAnySourceMapEnabled ? "inline" : false,
        babelrc: false,
        plugins: ['react-refresh/babel']
    };

    const baseConfig = webpackConfig(env);

    let tsxRule;
    // Find the rule for transpiling ts files ("ts-loader"), and modify it to test for .tsx files too
    baseConfig.module.rules.some(rule => {
        const isTsLoader = rule.use && rule.use.loader === "ts-loader";

        if (isTsLoader) {
            rule.test = /\.(ts|tsx)$/;
            tsxRule = rule;
        }

        return isTsLoader;
    });
    tsxRule.use = [
        /**
         * @see https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/55028c6355b31e697e21bf3e9a48613a7b94bee7/examples/typescript-without-babel/webpack.config.js#L18-L21
         */
        hmr && !production && {
            loader: "babel-loader",
            options: babelOptions
        },
        tsxRule.use,
    ].filter(Boolean);

    // Modify "nativescript-dev-webpack/hmr/hot-loader" to test for .tsx files
    // (and also js files, which it should have been doing to begin with!)
    baseConfig.module.rules.some(rule => {
        const isNativeScriptDevWebpackHotLoader = rule.use === "@nativescript/webpack/hmr/hot-loader";

        if (isNativeScriptDevWebpackHotLoader) {
            rule.test = /\.(ts|tsx|js|css|scss|html|xml)$/;
        }

        return isNativeScriptDevWebpackHotLoader;
    });

    // We don't officially support JSX. Makes the webpack config rather more complicated to set up.
    baseConfig.resolve.extensions = [".tsx", ...baseConfig.resolve.extensions];
    baseConfig.resolve.alias["react-dom"] = "react-nativescript";

    // Augment NativeScript's existing DefinePlugin definitions with a few more of our own.
    let existingDefinePlugin;
    baseConfig.plugins = baseConfig.plugins.filter(plugin => {
        const isDefinePlugin = plugin && plugin.constructor && plugin.constructor.name === "DefinePlugin";
        if(isDefinePlugin){
            existingDefinePlugin = plugin;
        }
        return !isDefinePlugin;
    });
    const newDefinitions = {
        ...existingDefinePlugin.definitions,
        /* For various libraries in the React ecosystem. */
        "__DEV__": production ? "false" : "true",
        "__TEST__": "false",
        /*
         * Primarily for React Fast Refresh plugin, but technically the allowHmrInProduction option could be used instead.
         * Worth including anyway, as there are plenty of Node libraries that use this flag.
         */
        "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development"),
    };
    baseConfig.plugins.unshift(new webpack.DefinePlugin(newDefinitions));

    if(hmr && !production){
        baseConfig.plugins.push(new ReactRefreshWebpackPlugin({
            /**
             * Maybe one day we'll implement an Error Overlay, but the work involved is too daunting for now.
             * @see https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/79#issuecomment-644324557
             */
            overlay: false,
            /**
             * If you (temporarily) want to enable HMR on a production build:
             *   1) Set `forceEnable` to `true` 
             *   2) Remove the `!production` condition on `tsxRule` to ensure that babel-loader gets used.
             */
            forceEnable: false,
        }));
    } else {
        baseConfig.plugins = baseConfig.plugins.filter(p => !(p && p.constructor && p.constructor.name === "HotModuleReplacementPlugin"));
    }

    return baseConfig;
};