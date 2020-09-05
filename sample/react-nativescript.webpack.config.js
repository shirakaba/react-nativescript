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
                        require.resolve('react-refresh/babel')
                    ] :
                    []
            ),
            ["@babel/plugin-proposal-class-properties", { loose: true }]
        ]
    };

    const baseConfig = webpackConfig(env);

    // Modify "ts-loader" to test for .tsx files
    // (and also js(x) files, which it should have been doing to begin with!)
    baseConfig.module.rules.some(rule => {
        const isTsLoader = rule.use && rule.use.loader === "ts-loader";

        if (isTsLoader) {
            rule.test = /\.(ts|tsx)$/;
        }

        return isTsLoader; // Break loop once we've found the one.
    });

    // Modify "nativescript-dev-webpack/hmr/hot-loader" to test for .tsx files
    // (and also js(x) files, which it should have been doing to begin with!)
    baseConfig.module.rules.some(rule => {
        const isNativeScriptDevWebpackHotLoader = rule.use === "@nativescript/webpack/hmr/hot-loader";

        if (isNativeScriptDevWebpackHotLoader) {
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
        /*
         * Primarily for React Fast Refresh plugin, but technically the forceEnable option could be used instead.
         * Worth including anyway, as there are plenty of Node libraries that use this flag.
         */
        "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development"),
    };
    baseConfig.plugins.unshift(new webpack.DefinePlugin(newDefinitions));

    /**
     * Set forceEnable to `true` if you want to use HMR on a production build.
     */
    const forceEnable = false;
    if (hmr && (!production || forceEnable)) {
        baseConfig.plugins.push(new ReactRefreshWebpackPlugin({
            /**
             * Maybe one day we'll implement an Error Overlay, but the work involved is too daunting for now.
             * @see https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/79#issuecomment-644324557
             */
            overlay: false,
            forceEnable,
        }));
    } else {
        baseConfig.plugins = baseConfig.plugins.filter(p => !(p && p.constructor && p.constructor.name === "HotModuleReplacementPlugin"));
    }

    return baseConfig;
};