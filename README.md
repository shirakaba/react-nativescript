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

Status: The sample app is happily using the renderer, and I'm busy adding both components and internal functionality to it.

I'm always keeping an eye on the `#general` chat of the [NativeScript Slack](https://nativescriptcommunity.slack.com) if you'd like to talk about this project. If this gets unexpected traction, I could look into setting up a dedicated Gitter.

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

```typescript
// In app.ts
import * as React from "react";
import * as ReactNativeScript from "react-nativescript/dist/index";
import { RCTContentView, RCTLabel } from "react-nativescript/dist/index";

ReactNativeScript.startWithFrameAndPage(
    React.createElement(
        RCTContentView,
        {
            backgroundColor: "orange"
        },
        React.createElement(
            RCTLabel,
            {
                /* Write text either as a prop or as a child. */
                // text: "Hello, world!"
            },
            "Hello, world!"
        )
    )
);
```

There are some more complex components to test (or refer to) in [`sample/app/testComponents/testComponents.ts`](https://github.com/shirakaba/react-nativescript/blob/master/sample/app/testComponents/testComponents.ts). GameLoop has some potential ;)

### Navigation

#### A dedicated navigation/routing framework?

A dedicated navigation/routing framework is beyond the scope of this library, but I hope to make a compatibility layer (e.g. remapping `<ContentView>` to `<View>`) to allow React NativeScript to simply be plugged into existing navigation solutions in the world of React. Tell me if you find any good candidates.

I may attempt to create a first-class solution myself in time, but it would be as part of a separate project, with its own repository.

#### NativeScript Core navigation

NativeScript Core does have some navigation components to mirror those used by native apps, though, and I shall be supporting these.

<table>
    <tbody>
        <tr>
            <td align="center" valign="middle">
                <img width="224px" src="/github_img/TabView.gif"/>
            </td>
            <td align="center" valign="middle">
                <img width="200px" src="/github_img/Hub.gif"/>
            </td>
            <td align="center" valign="middle">
                <img width="379px" src="/github_img/NestedModal.gif"/>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                <p><b><a href="https://docs.nativescript.org/core-concepts/navigation#tabview-navigation">TabView</a></b></p>
            </td>
            <td align="center" valign="middle">
                <p><b><a href="https://docs.nativescript.org/core-concepts/navigation#hub-navigation">Hub</a></b></p>
            </td>
            <td align="center" valign="middle">
                <p><b><a href="https://docs.nativescript.org/core-concepts/navigation#modal-view-navigation">Modals</a></b></p>
            </td>
        </tr>
    </tbody>
</table>

### Layouts

All layouts are supported. Here are a few samples:

<table>
    <tbody>
        <tr>
            <td align="center" valign="middle">
                <img width="200px" src="/github_img/DockLayout.png"/>
            </td>
            <td align="center" valign="middle">
                <img width="200px" src="/github_img/AbsoluteLayout.png"/>
            </td>
            <td align="center" valign="middle">
                <img width="200px" src="/github_img/FlexboxLayout.png"/>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                <p><b>DockLayout</b></p>
            </td>
            <td align="center" valign="middle">
                <p><b>AbsoluteLayout</b></p>
            </td>
            <td align="center" valign="middle">
                <p><b>FlexboxLayout</b></p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                <p><em>Based on the <a href="https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/layouts/dock-layout/dock-layout-ts-page.ts">SDK example</a></em></p>
            </td>
            <td align="center" valign="middle">
                <p><em>Based on the <a href="https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/layouts/absolute-layout/absolute-layout-ts-page.ts">SDK example</a></em></p>
            </td>
            <td align="center" valign="middle">
                <p><em>Based on the <a href="https://docs.nativescript.org/ui/layouts/layout-containers#flexboxlayout">docs example</a></em></p>
            </td>
        </tr>
    </tbody>
</table>

### NativeScript Core Components

I'm working on wrapping up every component provided by NativeScript Core with a dedicated React wrapper, trying to provide the most intuitive (React-like) user experience I can manage. Proper documentation will come in time. To see how many of the core components I've implemented so far, simply refer to `src/components`.

## Why not just use React Native? 🤷‍♂️

There are great benefits to being able to use React as a renderer for NativeScript, rather than React Native.

* NativeScript runs on the main thread, so you avoid a lot of async dances and message-pasting between threads for achieving certain things (see particularly the next point)
* NativeScript has complete bindings to the native APIs, so you never need to write a plugin every time you just want to access/set a property on a native view
* NativeScript projects simply build and install much more quickly than a React Native project because the codebase is leaner
* The NativeScript codebase is far more approachable to contributors
* This repo is written in TypeScript from the ground up (just like NativeScript), so typings will always be in sync and correct.

## Contributing 🙋‍♀️

Ideally get in contact via the Slack channel before starting any PRs.

I want to keep complex tooling down to a minimum to encourage easy on-boarding to contributors – at least until the project is stable.

## Current state 🚦

This checklist is expanded upon in the roadmap below.

Note that 'basic support' may mean "seen to work in very specific favourable circumstances".

* [x] Basic child-nesting support
* [x] Basic text component support
* [x] Basic styles support (if it exists on View)
* [x] Props and State changes lead to re-renders 🎉
* [x] Support for custom components (I *think* these work already; will check)
* [x] Support for multiple children inside an instance
* [x] Support for Portals
* [x] Basic ListView support
* [x] Mapping event-handler props to event handlers (e.g. `onTap` prop maps to `on("tap")` for Button component)
* [x] Mapping React refs to native components (I've given an example in Button)
* [x] Support [FormattedString](https://www.nativescript.org/blog/bolding-italicizing-and-underlining-portions-of-text-in-nativescript)
* [x] Support for context
* [x] Support for non-visual components (e.g. [Renderless Components](https://kyleshevlin.com/renderless-components) and [Context Providers](https://reactjs.org/docs/context.html#contextprovider))
* [x] ~~Implement CSS cascading~~ (it 'just works' without any special handling)
* [x] Handling of props other than by `Observer.setValue()` (plenty of this in action in [`react-nativescript/client/NativeScriptPropertyOperations.ts`](https://github.com/shirakaba/react-nativescript/blob/master/react-nativescript/src/client/NativeScriptPropertyOperations.ts#L89))
* [x] JSX/TSX (working! Although has possibly broken hot-module reloading).
* [ ] Create React Components for each of the NativeScript Core views (there are a few of them!)
* [ ] Map the React NativeScript Components to platform-agnostic [React primitives](https://github.com/lelandrichardson/react-primitives) to support multi-platform apps! [Lerna](https://lernajs.io) may become relevant here.
* [ ] ~~Mapping flexbox styles to FlexboxLayout components NOTE: these are based on [Google's FlexboxLayout repo](https://github.com/google/flexbox-layout) and not fully conformant with [CSS Flexible Box Layout](https://www.w3.org/TR/css-flexbox-1/).~~ I'm inclined to drop this goal for now.
* [ ] Tests. I see that the [Nativescript Vue](https://github.com/nativescript-vue/nativescript-vue) repo has a rather advanced [set of runnable tests](https://github.com/nativescript-vue/nativescript-vue/tree/master/samples/app). I was unable to get the sample app to build though, hence my desire to keep tooling simple. We could work towards something like this.

## Potential for API compatibility with React Native 🏚

Initially, my vision for this renderer was for it to be a drop-in skinny replacement for `react-native`. As much as I'd like it to be 100% compatible, though, I can see already that there are limitations.

* NativeScript's core components simply offer less customisability than React Native's ones; e.g. there are no accessibility options as far as I can see.
* React Native exposes iOS-specific and Android-specific props on its components, whereas NativeScript strictly uses a common set of props.
* Some core components exist only in one or the other of the two libraries.
* Tricky pieces of UI like Modals, Navigation Bars, and Status Bars are unlikely to have any good overlap between the two frameworks
* FlexBox is handled at the CSS level in React Native, but via a FlexBoxLayout component in NativeScript; also my impression is that React Native's FlexBox implementation is far more conformant to the CSS spec than NativeScript's one.
* NativeScript runs on the main thread, whereas React Native runs on a separate thread, so each library may approach certain tasks in different ways (e.g. some properties may be synchronous in NativeScript while they're asynchronous in React Native).
* React Native's event handling is very different from NativeScript's (not to mention complex). Preact does fine without it, so I'll not be implementing things their way, either.
* React Native is a constantly moving target. I don't want this project to live or die based on how well it matches any given version of React Native.

A middle ground would be to produce a middleware to remap props to that of React Native, but I'd rather not support two sets of APIs, so this would be left to the community as a separate undertaking.
