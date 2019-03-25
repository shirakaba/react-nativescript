# react-nativescript
## About

React plugin for NativeScript (*very* under construction; expect swathing refactors)

<p align="center">
    <a href="https://github.com/shirakaba/nside">
        <img src="http://githubbadges.com/star.svg?user=shirakaba&repo=react-nativescript&style=flat">
    </a>
    <a href="https://github.com/shirakaba/nside/fork">
        <img src="http://githubbadges.com/fork.svg?user=shirakaba&repo=react-nativescript&style=flat">
    </a>
    <a href="https://github.com/ellerbrock/open-source-badge/">
        <img src="https://badges.frapsoft.com/os/gpl/gpl.svg?v=102">
    </a>
    <a href="http://makeapullrequest.com">
        <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat">
    </a>
    <a href="https://twitter.com/intent/follow?screen_name=LinguaBrowse">
        <img src="https://img.shields.io/twitter/follow/LinguaBrowse.svg?style=social&logo=twitter">
    </a>
</p>

Status: I've written a minimum-working-example renderer, and now I'm trying to get the sample app to make use of it.

I'm always keeping an eye on the `#general` chat of the [NativeScript Slack](https://nativescriptcommunity.slack.com) if you'd like to talk about this project. If this gets unexpected traction, I could look into setting up a dedicated Gitter.

## Why not just use React Native?

There are great benefits to being able to use React as a renderer for NativeScript, rather than React Native.

* NativeScript runs on the main thread, so you avoid a lot of async dances and message-pasting between threads for achieving certain things (see particularly the next point)
* NativeScript has complete bindings to the native APIs, so you never need to write a plugin every time you just want to access/set a property on a native view
* NativeScript projects simply build and install much more quickly than a React Native project because the codebase is leaner
* The NativeScript codebase is far more approachable to contributors
* This repo is written in TypeScript from the ground up (just like NativeScript), so typings will always be in sync and correct.

## Contributing

Ideally get in contact via the Slack channel before starting any PRs.

I want to keep complex tooling down to a minimum to encourage easy on-boarding to contributors – at least until the project is stable.

## Roadmap

We'll need:

* JSX/TSX support ([Nick Iliev](https://github.com/NickIliev) recommends studying `nativescript-tsx`: [GitHub repo](https://github.com/PanayotCankov/nativescript-tsx); [npm package](https://www.npmjs.com/package/nativescript-tsx))
* Support for custom components (this currently only supports those from `tns-core-modules`).
* Support for non-visual components (e.g. in case you want a `<GameLoop>` component to simply pass down a run loop callback as a context).
* Intelligent props assignment (e.g. if the key of the prop is `onclick`, we'll need to set the value on a corresponding event handler; same goes for styles). I'd be surprised if props (and certainly styles) even work at the moment.
* Exposing React-style refs to the native component.
* Tests. I see that the [Nativescript Vue](https://github.com/nativescript-vue/nativescript-vue) repo has a rather advanced [set of runnable tests](https://github.com/nativescript-vue/nativescript-vue/tree/master/samples/app). I was unable to get the sample app to build though, hence my desire to keep tooling simple. We could work towards something like this.

My vision is for this renderer to be able to be a drop-in skinny replacement for `react-native`, so as a first milestone, I'd like to get RNTester working as our sample app!
