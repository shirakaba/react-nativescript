https://github.com/NativeScript/nativescript-app-templates/blob/master/shared/tools/dot.gitignore

`shared/tools/dot.gitignore` is missing various files from my `tools/dot.gitignore`, which used to be:

```
# NativeScript
hooks/
node_modules/
platforms/

# NativeScript Template
*.js.map
*.js

# React NativeScript
!webpack.config.js

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# General
.DS_Store
.AppleDouble
.LSOverride
.idea
.cloud
.project
tmp/
typings/

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
```

https://github.com/NativeScript/nativescript-app-templates/blob/master/shared/hooks/after-createProject/after-createProject.js

My `hooks/after-createProject/after-createProject.js` hook used to look like this:

```js
const fs = require("fs");
const path = require("path");

/**
 * @see https://github.com/NativeScript/nativescript-app-templates/blob/master/packages/template-hello-world-ts/hooks/after-createProject/after-createProject.js
 */
module.exports = function (hookArgs) {
    const appRootFolder = hookArgs.projectDir;
    const toolsDir = path.join(appRootFolder, "tools");
    const vscodeDir = path.join(appRootFolder, ".vscode");
    const srcGitignore = path.join(toolsDir, "dot.gitignore");
    const destGitignore = path.join(appRootFolder, ".gitignore");
    // I'll continue to copy this file across, but omit the recommendation for "nativescript.nativescript" as that's Core-focused.
    const srcVscodeExtensions = path.join(toolsDir, "vscode.extensions.json");
    const destVscodeExtensions = path.join(vscodeDir, "extensions.json");

    try {
        fs.mkdirSync(vscodeDir);
        fs.copyFileSync(srcVscodeExtensions, destVscodeExtensions);
        fs.copyFileSync(srcGitignore, destGitignore);
    } catch (error) {
        console.log(error);
    } finally {
        try {
            deleteFolderSync(toolsDir);

            const readme = path.join(appRootFolder, "README.md");
            fs.unlinkSync(readme);

            deleteFolderSync(__dirname);
        } catch (error) {
            console.log(error);
        }
    }

    function deleteFolderSync(folderPath) {
        if (fs.statSync(folderPath).isDirectory()) {
            fs.readdirSync(folderPath).forEach((file) => {
                const content = path.join(folderPath, file);
                const contentDirs = fs.statSync(content).isDirectory();

                if (contentDirs) {
                    deleteFolderSync(content);
                } else {
                    fs.unlinkSync(content);
                }
            });

            fs.rmdirSync(folderPath);
        }
    }
};
```


They've removed my `webpack.config.js`:

```js
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

    const baseConfig = webpackConfig(env);

    /** Find the rule for transpiling ts files ("ts-loader"), and modify it to test for .tsx files too. */
    const tsxRule = baseConfig.module.rules.find(rule => rule.use && rule.use.loader === "ts-loader");
    tsxRule.test = /\.(ts|tsx)$/;
    tsxRule.use = [
        /**
         * Add React Refresh HMR support.
         * @see https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/55028c6355b31e697e21bf3e9a48613a7b94bee7/examples/typescript-without-babel/webpack.config.js#L18-L21
         */
        hmr && !production && {
            loader: "babel-loader",
            options: {
                sourceMaps: isAnySourceMapEnabled ? "inline" : false,
                babelrc: false,
                plugins: ['react-refresh/babel']
            }
        },
        tsxRule.use,
    ].filter(Boolean);

    /**
     * Modify "nativescript-dev-webpack/hmr/hot-loader" to test for .tsx files
     * (and also js files, which it should have been doing to begin with!)
     */
    const nativeScriptDevWebpackHotLoader = baseConfig.module.rules.find(rule =>
        rule.use === "@nativescript/webpack/hmr/hot-loader"
    );
    nativeScriptDevWebpackHotLoader.test = /\.(ts|tsx|js|css|scss|html|xml)$/;

    /** We don't officially support JSX. Makes the webpack config rather more complicated to set up. */
    baseConfig.resolve.extensions = [".tsx", ...baseConfig.resolve.extensions];
    baseConfig.resolve.alias["react-dom"] = "react-nativescript";

    /** Augment NativeScript's existing DefinePlugin definitions with a few more of our own. */
    const existingDefinePlugin = baseConfig.plugins.find(plugin =>
        plugin && plugin.constructor && plugin.constructor.name === "DefinePlugin"
    );
    baseConfig.plugins.splice(
        baseConfig.plugins.indexOf(existingDefinePlugin),
        1,
        new webpack.DefinePlugin({
            ...existingDefinePlugin.definitions,
            /** For various libraries in the React ecosystem. */
            "__DEV__": production ? "false" : "true",
            "__TEST__": "false",
            /**
             * Primarily for React Fast Refresh plugin, but technically the allowHmrInProduction option could be used instead.
             * Worth including anyway, as there are plenty of Node libraries that use this flag.
             */
            "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development"),
        }),
    );

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
```

My `package.json` changed, in that:

* the main file is changed from `app.js` to `src/app.ts` (which may be right)
* an explicit `files` array is now provided (which could well be wrong), whereas before I guess we relied on this `.npmignore` (which is still present)
* Some deps updated (figuring out Webpack 5 is the main problem)

```
"files": [
   "src",
   "App_Resources",
   "tools",
   "hooks",
   "!tools/assets",
   ".editorconfig",
   "tsconfig.json",
   "patches"
],
```

```
npm-debug.log
.DS_Store

*.js.map
*.js
!webpack.config.js
hooks/*
!hooks/after-createProject/after-createProject.js
lib/
node_modules/
platforms/
tmp/
typings/
.idea
.cloud
.project
.vscode
.npmrc
*.tgz
```

```diff
- "@nativescript/core": "~7.1.0",
+ "@nativescript/core": "~8.0.0",

- "@nativescript/types": "^7.0.4",
+ "@nativescript/types": "^8.0.0",

- "@nativescript/webpack": "~4.0.0",
+ "@nativescript/webpack": "5.0.0-beta.0",
```
