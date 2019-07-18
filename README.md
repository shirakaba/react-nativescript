# React NativeScript
## About

A React renderer for NativeScript, allowing you to write a NativeScript app using the familiar React style. *very* under construction; expect swathing refactors!

<p align="center">
    <a href="https://github.com/shirakaba/nside">
        <img src="http://githubbadges.com/star.svg?user=shirakaba&repo=react-nativescript&style=flat"/>
    </a>
    <a href="https://github.com/shirakaba/nside/fork">
        <img src="http://githubbadges.com/fork.svg?user=shirakaba&repo=react-nativescript&style=flat"/>
    </a>
    <a href="https://opensource.org/licenses/mit-license.php">
        <img src="https://badges.frapsoft.com/os/mit/mit.png?v=103"/>
    </a>
    <!-- <a href="http://makeapullrequest.com">
        <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat"/>
    </a> -->
    <a href="https://twitter.com/intent/follow?screen_name=LinguaBrowse">
        <img src="https://img.shields.io/twitter/follow/LinguaBrowse.svg?style=social&logo=twitter"/>
    </a>
    <a href="https://badge.fury.io/js/react-nativescript"><img src="https://badge.fury.io/js/react-nativescript.svg" alt="npm version" height="18"></a>
</p>

I'm always hanging out in the `#react` chat of the [NativeScript Slack](https://nativescriptcommunity.slack.com) if you'd like to talk about this project.

## Setup

**CAUTION:** *Developed against NativeScript `v5.4`; please report if you have any problems with NativeScript `v6.0`!* ⚠️

The following instructions assume that you'll be developing in TypeScript.

```sh
# Create a project like this (or continue from an existing one)
tns create mycoolapp --tsc
cd mycoolapp

# In the root of your NativeScript project.
npm install --save react-nativescript react
npm install --save-dev @types/react awesome-typescript-loader babel-loader @babel/core @babel/plugin-proposal-class-properties @babel/preset-react fork-ts-checker-webpack-plugin

# Build and run your project like so (specify 'android' instead of 'ios' if applicable):
tns run ios --bundle --syncAllFiles --emulator
```

Please file an Issue if you meet any problems when following these instructions. They could well be missing something!

## Examples

### Hello World app

NativeScript CLI does not yet provide a starter template (it's on my to-do list). Here is a summary of how the sample project is set up. It assumes having started from the NativeScript Core TypeScript template (i.e. `tns create mycoolapp --tsc`).

#### No JSX/TSX in the entry file, `app.ts`

JSX/TSX is not supported in the entry file `app.ts` due to `nativescript-dev-webpack` filtering it out. It's pending me signing NativeScript's CLA (see this [PR](https://github.com/NativeScript/nativescript-dev-webpack/pull/875)), but I need to get clearance from my company first.

Every other file in your project **can** be in JSX/TSX, however.

#### `nsconfig.json`

HMR is soon changing dramatically in React, so I will no longer be documenting the soon-to-be-deprecated React Hot Loader HMR method, which is very fiddly anyway. Set this property to disable HMR (for now, HMR is only functional for other flavours of NativeScript).

```json
{
    "useLegacyWorkflow": true
}
```

#### `tsconfig.json`

Same as for the usual NativeScript Core TypeScript template, but with `"jsx": "react"` added.

#### `webpack.config.js`

The webpack config is bit more complex than the NativeScript Core TypeScript template. This is necessary to support JSX, the React library, and faster webpack builds (i.e. one webpack rule to transform from TSX to JS, rather than two rules).

Same as for the usual NativeScript Core TypeScript template, but with the following modifications:

Assign this variable towards the beginning of your `webpack.config.js`:

```js
const babelOptions = {
    babelrc: false,
    presets: [
        "@babel/preset-react"
    ],
    plugins: [
        ["@babel/plugin-proposal-class-properties", { loose: true }]
    ]
};
```

...ensure that the Webpack `config.resolve.extensions` includes `.tsx` and `.jsx`:

```js
extensions: [".ts", ".tsx", ".js", ".jsx", ".scss", ".css"],
```

... and ensure that your `.js` and `.ts` module rules are replaced with these (which support `.js(x)` and `.ts(x)`). See how we're referencing the `babelOptions` variable that we defined earlier:

```js
{
    test: /\.js(x?)$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader",
        options: babelOptions
    },
},

{
    test: /\.ts(x?)$/,
    use: [
        {
            loader: "awesome-typescript-loader",
            options: {
                configFileName: "tsconfig.tns.json",
                useBabel: true,
                useCache: true,
                cacheDirectory: ".awcache", /* You'll want to git-ignore this folder :) */
                babelOptions: babelOptions,
                babelCore: "@babel/core",
                /* I'm not sure of the correct way to input sourceMap, so trying both ways indicated
                 * in https://github.com/s-panferov/awesome-typescript-loader/issues/526 */
                compilerOptions: {
                    sourceMap
                },
                sourceMap
            },
        }
    ]
},
```

If I've missed anything, just refer to [`sample/webpack.config.js`](https://github.com/shirakaba/react-nativescript/blob/master/sample/webpack.config.js), because that's what I'm using!

#### Source code

```typescript
// app.ts

/* Controls react-nativescript log verbosity. true: all logs; false: only error logs. */
(global as any).__DEV__ = false;

import * as React from "react";
import * as ReactNativeScript from "react-nativescript/dist/index";
import App, { rootRef } from "./ReactManagedApp";

ReactNativeScript.start(React.createElement(App, {}, null), rootRef);
```

```typescript
// ReactManagedApp.ts
import * as React from "react";
import { $TabView, $TabViewItem, $StackLayout, $Label } from "react-nativescript/dist/index";

export const rootRef: React.RefObject<any> = React.createRef<any>();

// See the testComponents directory for many examples of components (and ref-forwarding).
const App = () => (
    // Do NOT forget to pass in this rootRef, otherwise your app will crash on startup! :)
    <$TabView ref={rootRef} selectedIndex={0}>
        <$TabViewItem title={"One"}>
            <$StackLayout height={{ value: 100, unit: "%"}} width={{ value: 100, unit: "%"}}>
                <$Label>Uno</$Label>
            </$StackLayout>
        </$TabViewItem>
        <$TabViewItem title={"Two"}>
            <$StackLayout height={{ value: 100, unit: "%"}} width={{ value: 100, unit: "%"}}>
                <$Label>Dos</$Label>
            </$StackLayout>
        </$TabViewItem>
    </$TabView>
);

export default App;
```

#### Running

```sh
tns run ios --bundle --emulator
```

---

There are many complex components to test (or refer to) in [`sample/app/testComponents/testComponents.ts`](https://github.com/shirakaba/react-nativescript/blob/master/sample/app/testComponents/testComponents.ts). `GameLoop` has some potential ;)

## Why not just use React Native? 🤷‍♂️

React NativeScript shares most of the good parts of React Native, but above all gives a first-class development experience for interacting with native code. Never write another native module again – you can write your native code inline using JavaScript!

<table>
    <tbody>
        <tr>
            <td align="center" valign="middle">
            </td>
            <td align="center" valign="middle">
                <h3>React Native</h3>
            </td>
            <td align="center" valign="middle">
                <h3>React NativeScript</h3>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                <strong>UI renderer</strong>
            </td>
            <td align="center" valign="middle" colspan="2">
                <p>React</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                <strong>Programming language</strong>
            </td>
            <td align="center" valign="middle" colspan="2">
                <p>JavaScript (with TypeScript typings available)</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                <strong>Platforms</strong>
            </td>
            <td align="center" valign="middle">
                <p>iOS + Android + many more</p>
            </td>
            <td align="center" valign="middle">
                <p>iOS + Android</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                <strong>Bundler</strong>
            </td>
            <td align="center" valign="middle">
                <p>Metro</p>
            </td>
            <td align="center" valign="middle">
                <p>Webpack</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                <strong>Codebase</strong>
            </td>
            <td align="center" valign="middle">
                <p>Absolutely unfathomable</p>
            </td>
            <td align="center" valign="middle">
                <p>Very approachable to new contributors</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                <strong>Javascript VM threading</strong>
            </td>
            <td align="center" valign="middle">
                <p>Separate 'JS' thread</p>
            </td>
            <td align="center" valign="middle">
                <p>Main (UI) thread</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                <strong>Native API access</strong>
            </td>
            <td align="left" valign="middle">
                <em>"The Bridge"</em>
                <ul>
                    <li>asynchronous</li>
                    <li>JS Interface (JSI) is very limited and lacks typings</li>
                    <li>API calls must take JSON-serialisable arguments</li>
                    <li>developer must set up bindings themself</li>
                </ul>
            </td>
            <td align="left" valign="middle">
                <em>"The platform runtime"</em>
                <ul>
                    <li>synchronous</li>
                    <li>JS VM has bindings to 100% of the platform APIs with full TypeScript typings</li>
                    <li>API calls can take native variables marshalled into JS</li>
                    <li>developer doesn't have to write any bindings at all</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

### API compatibility with React Native 🏚

Allowing React NativeScript to run projects that were written for React Native is a huge project, but it's theoretically very possible. See [react-nativescript-compat-react-native](https://github.com/shirakaba/react-nativescript-compat-react-native) for work towards this, where I've ported part of RNTester as a proof-of-concept... 👩‍🔬👨‍🔬

## Roadmap 🛣

A quick list of my own plans (not necessarily in execution order):

* Logo
* Real-world sample app
* Documentation website
* Updated React HMR and Dev Tools (once they're released)
* Conference talk 🤞

Wishes:

* Demo apps
* Translated docs
* Starter template in NativeScript CLI and Playground
* Lots and lots of plugins
* API compatibility with React Native (very long-term goal)
* Compatibility with major React packages like React Navigation and Redux (may depend upon above)

## Contributing 🙋‍♀️

Ideally get in contact via the [Slack channel](https://nativescriptcommunity.slack.com/messages/CJ2B77CJ1/) before starting any PRs!