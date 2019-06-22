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

There are great benefits to being able to use React as a renderer for NativeScript, rather than React Native.

* NativeScript runs on the main thread, so you avoid a lot of async dances and message-pasting between threads for achieving certain things (see particularly the next point)
* NativeScript has complete bindings to the native APIs, so you never need to write a plugin every time you just want to access/set a property on a native view
* NativeScript projects simply build and install much more quickly than a React Native project because the codebase is leaner
* The NativeScript codebase is far more approachable to contributors
* This repo is written in TypeScript from the ground up (just like NativeScript), so typings will always be in sync and correct.

## Contributing 🙋‍♀️

Ideally get in contact via the [Slack channel](https://nativescriptcommunity.slack.com/messages/CJ2B77CJ1/) before starting any PRs.

I want to keep complex tooling down to a minimum to encourage easy on-boarding to contributors – at least until the project is stable.


## Potential for API compatibility with React Native 🏚

Never say never. See https://github.com/shirakaba/react-nativescript-compat-react-native for work towards this... 👩‍🔬👨‍🔬