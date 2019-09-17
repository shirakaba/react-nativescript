<p align="center">
    <img src="github_img/RNS_logo.svg" width="270">
</p>

<p align="center">
    <a href="https://badge.fury.io/js/react-nativescript"><img src="https://badge.fury.io/js/react-nativescript.svg" alt="npm version" height="18"></a>
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

**React NativeScript** is A React renderer for NativeScript, allowing you to write a NativeScript app using the familiar React style. *Very* under construction; expect swathing refactors!

I'm always hanging out in the `#react` chat of the [NativeScript Slack](https://nativescriptcommunity.slack.com) if you'd like to talk about this project.

## Setup

```sh
# Make sure that you have `tns` (the NativeScript CLI) installed:
#   https://docs.nativescript.org/start/quick-setup

tns create myApp --template tns-template-blank-react
cd myApp
tns run ios
```

## Documentation

Under construction – please be patient! For now, please refer to the examples mentioned below and use the [NativeScript Core docs](https://docs.nativescript.org/start/introduction) as your guide.

### Example app

I've ported [Shiva Prasad](https://github.com/shiv19)'s TypeScript NativeScript Core port of [Alex Ziskind](https://github.com/alexziskind1)'s issue-tracking app to React NativeScript. It's called `rpstrackerrns` and you can find it [here](https://github.com/shirakaba/rpstrackerrns).

The app is based on React NativeScript v0.11.0, so may have some minor differences to the latest version, but the general patterns should be the same.

The repo also includes some example UI plugins – I'll likely be changing the APIs for making those, however, so don't assume that approach to remain supported.

### Example components

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

## FAQ

**How far along is it?**

It's feature-equivalent with NativeScript Core! It's just missing documentation to explain how to use it.

**Is it production-ready?**

Maybe. I don't know what I don't know. Try it out, see if you have any issues, and this will become clearer.

**What about plugins?**

Very few UI plugins have been adapted for use with React NativeScript so far, and I'm still altering the API for making UI plugins, so expect there to be relatively few UI plugins for a while. But any non-UI plugins will work just fine!

**Can this consume React Native projects?**

No, but it *could* with a lot of hard work. Allowing React NativeScript to run projects that were written for React Native is a huge project, but it's theoretically very possible – it would be a project on exactly the same scale as [React Native Web](https://github.com/necolas/react-native-web). See [react-nativescript-compat-react-native](https://github.com/shirakaba/react-nativescript-compat-react-native) for work towards this, where I've ported part of RNTester as a proof-of-concept... 👩‍🔬👨‍🔬

**Can this consume React Native native modules?**

Certainly not UI-based native modules. But all flavours of NativeScript can consume native code, so it can probably consume React Native native modules, though may take a small bit of refactoring 🤔

Stanisław Chmiela ([@sjchmiela](https://twitter.com/sjchmiela)) produced a [proof-of-concept](https://gist.github.com/sjchmiela/e1fcb7ca255e77e92bb2c64bc63b7fee) for importing Expo Unimodules into NativeScript that could be used as a basis for this effort. Original discussion [here](https://twitter.com/sjchmiela/status/1158402590499057665?s=20).

## Roadmap 🛣

A quick list of my own plans (not necessarily in execution order):

* Documentation website
* Document workflow for React Dev Tools integration
* Conference talk 🤞

Wishes:

* Demo apps
* Translated docs
* Starter template in NativeScript Playground
* Lots and lots of plugins
* API compatibility with React Native (very long-term goal)
* Compatibility with major React packages like React Navigation (may depend upon above)

## Contributing 🙋‍♀️

Ideally get in contact via the [Slack channel](https://nativescriptcommunity.slack.com/messages/CJ2B77CJ1/) before starting any PRs!
