# React NativeScript
## About

React plugin for NativeScript (*very* under construction; expect swathing refactors)

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
</p>

Status: I'm currently gearing up towards a `v0.1.0` release.

I'm always hanging out in the `#react` chat of the [NativeScript Slack](https://nativescriptcommunity.slack.com) if you'd like to talk about this project.

## Setup

The library is not stable yet, so I won't be publishing it to npm anytime soon. For now, you can install the latest commit of the project directly from GitHub at any time. The following instructions assume that you'll be developing in TypeScript.

```sh
# Create a project like this (or continue from an existing one)
tns create mycoolapp --tsc

# Clone this repo, or download a zip of it, placing it beside your NativeScript project.
git clone https://github.com/shirakaba/react-nativescript.git

# Your folder hierarchy should now look like:
.
├── mycoolapp
└── react-nativescript

# In the root of your NativeScript project.
npm install --save file:../react-nativescript/react-nativescript
npm install --save react
npm install --save-dev @types/react
# OPTIONAL: Only required if you would like Hot Module Reloading:
npm install --save-dev "git+https://github.com/shirakaba/react-nativescript-hot-loader.git"

# Build and run your project like so:
tns run ios --bundle --syncAllFiles --emulator

# OPTIONAL (library development only): You can also update the source library:
cd node_modules/react-nativescript
node_modules/.bin/tsc --watch
```

Please file an Issue if you meet any problems when following these instructions. They could well be missing something!

## Examples

### Hello World app

JSX/TSX is not supported in the entry file `app.ts` due to `nativescript-dev-webpack` filtering it out. It's pending me signing NativeScript's CLA (see this [PR](https://github.com/NativeScript/nativescript-dev-webpack/pull/875)), but I need to get clearance from my company first.

Every other file in your project **can** be in JSX/TSX, however; just add `"jsx": "react"` to your `tsconfig.json`'s `compilerOptions` and refer to [`sample/webpack.config.js`](https://github.com/shirakaba/react-nativescript/blob/master/sample/webpack.config.js) (search for the character 'x'!).

Until then, you'll have to write your entry file in JS/TS. Here is how to make a `<ContentView>` component (a React wrapper around a NativeScript ContentView) without JSX:

(just add `"jsx": "react"` to your `tsconfig.json`'s `compilerOptions`).

#### App without HMR

```typescript
// In app.ts
import * as React from "react";
import * as ReactNativeScript from "react-nativescript/dist/index";
import ColdApp, { rootRef } from "./ColdApp";

ReactNativeScript.start(React.createElement(HotApp, {}, null), rootRef);
```

```typescript
// ColdApp.ts
import * as React from "react";
import { App } from "./AppContainer.ts"

export const rootRef: React.RefObject<any> = React.createRef<any>();

// See the testComponents directory for many examples of components (and ref-forwarding).
const app = () => (<AppContainer forwardedRef={rootRef}/>);

export default app;
```

```sh
# Ensure that nsconfig.json has: "useLegacyWorkflow": true
tns run ios --bundle --syncAllFiles --emulator
```

#### App with HMR

```typescript
// In app.ts
import * as React from "react";
import * as ReactNativeScript from "react-nativescript/dist/index";
import HotApp, { rootRef } from "./HotApp";

ReactNativeScript.start(React.createElement(HotApp, {}, null), rootRef);
```

```typescript
// HotApp.ts
import { hot } from "react-nativescript-hot-loader/root";
import * as React from "react";
import { App } from "./AppContainer.ts"

export const rootRef: React.RefObject<any> = React.createRef<any>();

// See the testComponents directory for many examples of components (and ref-forwarding).
const app = () => (<AppContainer forwardedRef={rootRef}/>);

export default hot(app);
```

```sh
# Ensure that nsconfig.json has: "useLegacyWorkflow": false
tns run ios --bundle --syncAllFiles --emulator
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

## Contributing 🙋‍♀️

Ideally get in contact via the [Slack channel](https://nativescriptcommunity.slack.com/messages/CJ2B77CJ1/) before starting any PRs.

I want to keep complex tooling down to a minimum to encourage easy on-boarding to contributors – at least until the project is stable.
