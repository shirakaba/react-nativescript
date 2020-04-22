const webpackConfig = require("./webpack.config");
const webpack = require("webpack");
const path = require("path");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

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
                        ['react-refresh/babel']
                    ] :
                    []
            ),
            ["@babel/plugin-proposal-class-properties", { loose: true }]
        ]
    };

    const baseConfig = webpackConfig(env);

    // Omit `ts` from the hot-loader test as we'll be providing Fast Refresh instead.
    const hotLoader = baseConfig.module.rules.filter(rule => rule.use === "nativescript-dev-webpack/hmr/hot-loader")[0];
    hotLoader.test = /\.(css|scss|html|xml)$/;

    // Remove ts-loader as we'll be using Babel to transpile the TypeScript instead.
    baseConfig.module.rules = baseConfig.module.rules.filter((rule) => {
        return rule.loader !== "ts-loader";
    });

    baseConfig.module.rules.push(
        {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: babelOptions
            },
        }
    );

    // baseConfig.module.rules.push({
    //     test: /\.ts(x?)$/,
    //     use: [
    //         {
    //             loader: "awesome-typescript-loader",
    //             options: {
    //                 configFileName: "tsconfig.tns.json",
    //                 transpileOnly: true,
    //                 useBabel: true,
    //                 useCache: true,
    //                 cacheDirectory: ".awcache",
    //                 babelOptions: babelOptions,
    //                 babelCore: "@babel/core",
    //                 /* I'm not sure of the correct way to input sourceMap, so trying both ways indicated
    //                  * in https://github.com/s-panferov/awesome-typescript-loader/issues/526 */
    //                 compilerOptions: {
    //                     sourceMap: isAnySourceMapEnabled
    //                 },
    //                 sourceMap: isAnySourceMapEnabled
    //             },
    //         }
    //     ]
    // });

    baseConfig.resolve.extensions = [".ts", ".tsx", ".js", ".jsx", ".scss", ".css"];
    baseConfig.resolve.alias["react-dom"] = "react-nativescript";

    // Augment NativeScript's existing DefinePlugin definitions with a few more of our own.
    let existingDefinePlugin;
    baseConfig.plugins = baseConfig.plugins.filter(plugin => {
        const isDefinePlugin = plugin && plugin.constructor && plugin.constructor.name === "DefinePlugin";
        existingDefinePlugin = plugin;
        return !isDefinePlugin;
    });
    baseConfig.plugins.unshift(
        new webpack.DefinePlugin({
            /* For various libraries in the React ecosystem. */
            "__DEV__": production ? "false" : "true",
            ...existingDefinePlugin.definitions,
            ...(
                hmr ?
                    {
                        /* react-refrehs expects to run in an environment where globals are stored on the `window` object.
                         * NativeScript uses `global` instead, so we'll alias that to satisfy it.
                         *
                         * Somehow `var globalValue = window` throws a ReferenceError if `window` is aliased to `global`,
                         * but is fine if aliased to `global.global`. */
                        "window": "global",
                    } :
                    {}
            ),
        }),
    );
    
    // Unsure whether or not to run this line, but provisionally shall try.
    // baseConfig.plugins = baseConfig.plugins.filter(p => !(p && p.constructor && p.constructor.name === "HotModuleReplacementPlugin"));

    if (env.production) {
        // nothing
    } else {
        if(hmr){
            baseConfig.plugins.push(new ReactRefreshWebpackPlugin({
                overlay: false,
            }));
        }
    }

    return baseConfig;
};
