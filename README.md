# React NativeScript
## About

React plugin for NativeScript (*very* under construction; expect swathing refactors)

<p align="center">
    <a href="https://github.com/shirakaba/nside">
        <img src="http://githubbadges.com/star.svg?user=shirakaba&repo=react-nativescript&style=flat">
    </a>
    <a href="https://github.com/shirakaba/nside/fork">
        <img src="http://githubbadges.com/fork.svg?user=shirakaba&repo=react-nativescript&style=flat">
    </a>
    <a href="https://opensource.org/licenses/mit-license.php">
        <img src="https://badges.frapsoft.com/os/mit/mit.png?v=103">
    </a>
    <!-- <a href="http://makeapullrequest.com">
        <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat">
    </a> -->
    <a href="https://twitter.com/intent/follow?screen_name=LinguaBrowse">
        <img src="https://img.shields.io/twitter/follow/LinguaBrowse.svg?style=social&logo=twitter">
    </a>
</p>

Status: The sample app is happily using the renderer, and I'm busy adding both components and internal functionality to it.

I'm always keeping an eye on the `#general` chat of the [NativeScript Slack](https://nativescriptcommunity.slack.com) if you'd like to talk about this project. If this gets unexpected traction, I could look into setting up a dedicated Gitter.

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
* [ ] Implement CSS cascading (assuming that NativeScript Core uses it at all..?)
* [ ] Create React Components for each of the NativeScript Core views (there are a few of them!)
* [ ] Map the React NativeScript Components to platform-agnostic [React primitives](https://github.com/lelandrichardson/react-primitives) to support multi-platform apps! [Lerna](https://lernajs.io) may become relevant here.
* [ ] Handling of props other than by `Observer.setValue()` (I'll gradually discover where this is needed)
* [ ] Support for non-visual components (e.g. in case you want a `<GameLoop>` component to simply pass down a run loop callback as a context).
* [ ] Support for context (currently I don't do anything with the `context` param in the HostConfig)
* [ ] Mapping flexbox styles to FlexboxLayout components NOTE: these are based on [Google's FlexboxLayout repo](https://github.com/google/flexbox-layout) and not fully conformant with [CSS Flexible Box Layout](https://www.w3.org/TR/css-flexbox-1/).
* [ ] JSX/TSX (note: this is probably handled by TypeScript/Babel, so maybe nothing to implement here). [Nick Iliev](https://github.com/NickIliev) recommends studying `nativescript-tsx`: [GitHub repo](https://github.com/PanayotCankov/nativescript-tsx); [npm package](https://www.npmjs.com/package/nativescript-tsx)
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
