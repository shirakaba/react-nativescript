const webpackConfig = require("./webpack.config");
const webpack = require("webpack");
const path = require("path");

module.exports = (env) => {
    env = env || {};
    const hmr = env.hmr;
    const production = env.production;

    const babelOptions = {
        babelrc: false,
        presets: [
            // https://github.com/facebook/create-react-app/tree/master/packages/babel-preset-react-app
            "@babel/preset-react"
        ],
        plugins: [
            ...(
                hmr ?
                    [
                        ["react-hot-loader/babel"]
                    ] :
                    []
            ),
            ["@babel/plugin-proposal-class-properties", { loose: true }]
        ]
    };

    const isAnySourceMapEnabled = !!env.sourceMap || !!env.hiddenSourceMap;
    const baseConfig = webpackConfig(env);

    baseConfig.module.rules.push(
        {
            test: /\.js(x?)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: babelOptions
            },
        }
    );

    baseConfig.module.rules.push({
        test: /\.ts(x?)$/,
        use: [
            {
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: "tsconfig.tns.json",
                    transpileOnly: true,
                    useBabel: true,
                    useCache: true,
                    cacheDirectory: ".awcache",
                    babelOptions: babelOptions,
                    babelCore: "@babel/core",
                    /* I'm not sure of the correct way to input sourceMap, so trying both ways indicated
                     * in https://github.com/s-panferov/awesome-typescript-loader/issues/526 */
                    compilerOptions: {
                        sourceMap: isAnySourceMapEnabled
                    },
                    sourceMap: isAnySourceMapEnabled
                },
            }
        ]
    });

    baseConfig.resolve.extensions = [".ts", ".tsx", ".js", ".jsx", ".scss", ".css"];
    baseConfig.resolve.alias["react-dom"] = "react-nativescript";

    baseConfig.plugins.unshift(
        new webpack.DefinePlugin({
            /* For various libraries in the React ecosystem. */
            "__DEV__": production ? "false" : "true",
            ...(
                hmr ?
                    {
                        /* react-hot-loader expects to run in an environment where globals are stored on the `window` object.
                         * NativeScript uses `global` instead, so we'll alias that to satisfy it.
                         *
                         * Somehow `var globalValue = window` throws a ReferenceError if `window` is aliased to `global`,
                         * but is fine if aliased to `global.global`. */
                        "window": "global.global",
                        /* Stops react-hot-loader from being bundled in production mode:
                        * https://github.com/gaearon/react-hot-loader/issues/602#issuecomment-340246945 */
                        "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development"),
                    } :
                    {}
            ),
        }),
    );

    if (env.production) {
        baseConfig.plugins = baseConfig.plugins.filter(p => !(p && p.constructor && p.constructor.name === "HotModuleReplacementPlugin"));
    }

    return baseConfig;
};
