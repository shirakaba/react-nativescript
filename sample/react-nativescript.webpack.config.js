const webpackConfig = require("./webpack.config");
const webpack = require("webpack");
const path = require("path");
const util = require('util')

module.exports = (env) => {
    env = env || {};
    const hmr = env.hmr;
    const production = env.production;
    const isAnySourceMapEnabled = !!env.sourceMap || !!env.hiddenSourceMap;

    const babelOptions = {
        sourceMaps: isAnySourceMapEnabled ? "inline" : false,
        babelrc: false,
        presets: [
            // https://github.com/Microsoft/TypeScript-Babel-Starter
            "@babel/env",
            "@babel/typescript",
            "@babel/react"
        ],
        plugins: [
            ...(
                hmr && !production ?
                    [
                        ["react-hot-loader/babel"]
                    ] :
                    []
            ),
            ["@babel/plugin-proposal-class-properties", { loose: true }]
        ]
    };

    const baseConfig = webpackConfig(env);

    // Remove ts-loader as we'll be using Babel to transpile the TypeScript instead.
    baseConfig.module.rules = baseConfig.module.rules.filter((rule) => {
        const isTsLoader = rule.use && rule.use.loader === "ts-loader";
        return !isTsLoader;
    });

    // Modify "nativescript-dev-webpack/hmr/hot-loader" to test for .tsx files
    // (and also js(x) files, which it should have been doing to begin with!)
    baseConfig.module.rules.some(rule => {
        const isNativeScriptDevWebpackHotLoader = rule.use === "nativescript-dev-webpack/hmr/hot-loader";

        if(isNativeScriptDevWebpackHotLoader){
            rule.test = /\.(ts|tsx|js|jsx|css|scss|html|xml)$/;
        }

        return isNativeScriptDevWebpackHotLoader; // Break loop once we've found the one.
    });

    baseConfig.module.rules.push(
        {
            test: /\.[jt]s(x?)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: "babel-loader",
                    options: babelOptions
                }
            ],
        }
    );

    baseConfig.resolve.extensions = [".ts", ".tsx", ".js", ".jsx", ".scss", ".css"];
    baseConfig.resolve.alias["react-dom"] = "react-nativescript";

    // Remove ForkTsCheckerWebpackPlugin because, now that we're using Babel, we'll leave type-checking to the IDE instead.
    baseConfig.plugins = baseConfig.plugins.filter(plugin => {
        const isForkTsCheckerWebpackPlugin = plugin && plugin.constructor && plugin.constructor.name === "ForkTsCheckerWebpackPlugin";
        return !isForkTsCheckerWebpackPlugin;
    });

    // Augment NativeScript's existing DefinePlugin definitions with a few more of our own.
    let existingDefinePlugin;
    baseConfig.plugins = baseConfig.plugins.filter(plugin => {
        const isDefinePlugin = plugin && plugin.constructor && plugin.constructor.name === "DefinePlugin";
        existingDefinePlugin = plugin;
        return !isDefinePlugin;
    });
    const newDefinitions = {
        ...existingDefinePlugin.definitions,
        /* For various libraries in the React ecosystem. */
        "__DEV__": production ? "false" : "true",
        "__TEST__": "false",
        ...(
            hmr ?
                {
                    /* react-hot-loader expects to run in an environment where globals are stored on the `window` object.
                     * NativeScript uses `global` instead, so we'll alias that to satisfy it.
                     *
                     * Somehow `var globalValue = window` throws a ReferenceError if `window` is aliased to `global`,
                     * but is fine if aliased to `global.global`. */
                    "window": "global.global",
                    "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development"),
                } :
                {}
        ),
    };
    baseConfig.plugins.unshift(new webpack.DefinePlugin(newDefinitions));
    
    if(production){
        /* Running this line seems to lead to React Hot Loader bundling production.min.js (which is empty)
         * rather than its development lib (which is big and intrusive).
         * So it should be understood that HMR is not supported in production mode. */
        baseConfig.plugins = baseConfig.plugins.filter(p => !(p && p.constructor && p.constructor.name === "HotModuleReplacementPlugin"));
    }

    console.log("baseConfig:", util.inspect(baseConfig, {showHidden: false, depth: null, colors: true }));
    console.log("All env variables:", env);
    console.log("--hmr", hmr);
    console.log("--production", production);

    return baseConfig;
};
