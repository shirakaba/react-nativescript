<p align="center">
    <img src="github_img/RNS_logo.svg" width="270">
</p>

<p align="center">
    <a href="https://badge.fury.io/js/react-nativescript"><img src="https://badge.fury.io/js/react-nativescript.svg" alt="npm version" height="18"></a>
    <!-- <a href="https://github.com/shirakaba/nside">
        <img src="http://githubbadges.com/star.svg?user=shirakaba&repo=react-nativescript&style=flat"/>
    </a> -->
    <!-- <a href="https://github.com/shirakaba/nside/fork">
        <img src="http://githubbadges.com/fork.svg?user=shirakaba&repo=react-nativescript&style=flat"/>
    </a> -->
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

**React NativeScript** is A React renderer for NativeScript, allowing you to write a NativeScript app using the familiar React style.

I'm always hanging out in the `#react` chat of the [NativeScript Discord](https://discord.gg/kcTwmBUuTE) if you'd like to talk about this project.

## Setup

```sh
# Make sure that you have `tns` (the NativeScript CLI) installed:
#   https://docs.nativescript.org/start/quick-setup

tns create myApp --react

cd myApp
npm install

# The Preview and Playground apps are awaiting an update from
# RNS v0 to v1, so the `tns preview` workflow isn't supported
# yet. We're working on it. – 18th July 2020
#
# tns preview
# or
tns run ios
# or
tns run android
```

## Documentation

* [React NativeScript docs](https://react-nativescript.netlify.com)
* [NativeScript docs](https://docs.nativescript.org/introduction.html)

## Example real-world app

See the [Apps](https://react-nativescript.netlify.app/docs/samples/apps) showcase in the docs to see various apps built with React NativeScript.

One example is my `rpstrackerrns` issue-tracking example app, which demonstrates how you can make fully native, professional-looking UIs with RNS:

<table>
    <tbody>
        <tr>
            <td align="center" valign="middle">
                <img width="200px" src="/github_img/LoginPage.png"/>
            </td>
            <td align="center" valign="middle">
                <img width="200px" src="/github_img/BacklogPage.png"/>
            </td>
            <td align="center" valign="middle">
                <img width="200px" src="/github_img/DetailPage.png"/>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                <p><b>Login Page</b></p>
            </td>
            <td align="center" valign="middle">
                <p><b>Backlog Page</b></p>
            </td>
            <td align="center" valign="middle">
                <p><b>Detail Page</b></p>
            </td>
        </tr>
    </tbody>
</table>


## Plugins

Although NativeScript lets you write native code inline as JavaScript, you can also write modules purely using native code (e.g. Objective-C and Java), and access the code directly in NativeScript via JavaScript. When a common, cross-platform JavaScript API is provided for such modules, it is called a "plugin", and can be thought of as equivalent to a React Native "native module". NativeScript has a rich ecosystem of these plugins – see the [NativeScript Marketplace](https://market.nativescript.org/?tab=plugins).

React NativeScript uses the same plugins API as NativeScript Vue and NativeScript Angular, so all those plugins should be compatible (although generally needing to be consumed with `any` type, as most plugins are only typed for NativeScript Core). Instructions on how to integrate plugins, and provide typings for React, can be found in the [React NativeScript plugins documentation](https://react-nativescript.netlify.app/docs/core-concepts/plugins).

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
            <td align="center" valign="middle" colspan="2">
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                Synchronicity
            </td>
            <td align="center" valign="middle">
                <p>Mostly <strong>asynchronous.</strong> Typically involves sending JSON-serialisable messages back-and-forth over a native-to-JS bridge. Synchronous only in advanced cases such as JSI and C++ TurboModules, and static values from native modules.</p>
            </td>
            <td align="center" valign="middle">
                <p><strong>Synchronous:</strong> The JS VM has direct bindings to the native context, and sits on the main (UI) thread.</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                Type marshalling
            </td>
            <td align="center" valign="middle">
                <p>Only supports JSON-serialisable types<sup><a href="https://reactnative.dev/docs/native-modules-ios.html#argument-types">[iOS]</a></sup><sup><a href="https://reactnative.dev/docs/native-modules-android#argument-types">[Android]</a></sup>, and only passes by value rather than by reference.</p>
            </td>
            <td align="center" valign="middle">
                <p>Can marshal nearly any data type<sup><a href="https://docs.nativescript.org/core-concepts/ios-runtime/marshalling-overview">[iOS]</a></sup><sup><a href="https://docs.nativescript.org/core-concepts/android-runtime/marshalling/overview">[Android]</a></sup> back and forth between the JS and native contexts, and even passes by reference from native to JS, allowing APIs to be called on native class instances from the JS context. Memory management of native references held by JS is <a href="https://docs.nativescript.org/core-concepts/memory-management">very</a> clever.</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                Bindings
            </td>
            <td align="center" valign="middle">
                <p>Users must write their own bindings<sup><a href="https://reactnative.dev/docs/native-modules-ios.html#argument-types">[iOS]</a></sup><sup><a href="https://reactnative.dev/docs/native-modules-android#argument-types">[Android]</a></sup> (except possibly for the advanced feature of C++ TurboModules) and try not to get anything wrong.</p>
            </td>
            <td align="center" valign="middle">
                <p>Bindings between the Objective-C/Java runtimes and JavaScript will be automatically generated<sup><a href="https://docs.nativescript.org/core-concepts/ios-runtime/overview#metadata">[iOS]</a></sup><sup><a href="https://docs.nativescript.org/core-concepts/android-runtime/metadata/overview">[Android]</a></sup> for any source code included in your app.</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                Typings
            </td>
            <td align="center" valign="middle">
                <p>Users must write the typings for their native modules manually<sup><a href="https://reactnative.dev/docs/native-modules-ios.html#argument-types">[iOS]</a></sup><sup><a href="https://reactnative.dev/docs/native-modules-android#argument-types">[Android]</a></sup> (except possibly for the advanced feature of C++ TurboModules) and try not to get anything wrong!</p>
            </td>
            <td align="center" valign="middle">
                <p>Typings can be automatically generated for bindings<sup><a href="https://docs.nativescript.org/plugins/use-native-ios-libraries#generating-typescript-typings">[iOS]</a></sup><sup><a href="https://docs.nativescript.org/core-concepts/android-runtime/metadata/generating-typescript-declarations">[Android]</a></sup>, and typings for the whole platform SDK are <a href="https://docs.nativescript.org/core-concepts/accessing-native-apis-with-javascript#intellisense-and-access-to-the-native-apis-via-typescript">already provided</a>.</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                Swift and Kotlin support
            </td>
            <td align="center" valign="middle">
                <p>For Swift, can write implementation but <a href="https://reactnative.dev/docs/native-modules-ios.html#exporting-swift">must expose to React Native via an accompanying Obj-C file</a> and manually-written bindings. Documentation also very limited. Not sure what's involved for Kotlin, but it <a href="https://callstack.com/blog/writing-a-native-module-for-react-native-using-kotlin/">is supported</a>.</p>
            </td>
            <td align="center" valign="middle">
                <p>For Swift, just <a href="https://docs.nativescript.org/plugins/use-native-ios-libraries#apis-written-in-swift">follow a few steps</a> such as adding the <code>@objc</code> tag to the methods, and you're good to go! Not sure what's involved for Kotlin, but it <a href="https://nativescript.org/blog/nativescript-6.1-kotlin-support-is-here">is supported</a>.</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                UI access
            </td>
            <td align="center" valign="middle">
                <p>Very limited access to the underlying UI components (e.g. with a ref to a View component, you cannot do much – you can't traverse the UI tree, make synchronous measurements, or call the underlying APIs of the UI component). Exceptions may include the advanced case of Reanimated 2 worklets.</p>
            </td>
            <td align="center" valign="middle">
                <p>All NativeScript UI elements provide full, synchronous API access to the underlying UI component. e.g. on iOS, with a ref to a React NativeScript <code>&lt;frame&gt;</code> component, you can access the underlying UINavigationController along with all of its APIs and make synchronous UI measurements.</p>
            </td>
        </tr>
        <tr>
            <td align="center" valign="middle">
                Hot reloading
            </td>
            <td align="center" valign="middle">
                <p>All native code changes (except possibly JSI and worklets) require app recompilation.</p>
            </td>
            <td align="center" valign="middle">
                <p>Any native API accesses via JS can be hot reloaded. Native code written in Obj-C / Java does, however, still require an app recompile upon change.</p>
            </td>
        </tr>
    </tbody>
</table>

## FAQ

**Is it production-ready?**

It's based on React, NativeScript Core, and NativeScript Vue, which are each individually production-ready. Make of that what you will.

**Can this consume React Native projects?**

No, but it *could* with a lot of hard work. Allowing React NativeScript to run projects that were written for React Native is a huge project, but it's theoretically very possible – it would be a project on exactly the same scale as [React Native Web](https://github.com/necolas/react-native-web). See [react-nativescript-compat-react-native](https://github.com/shirakaba/react-nativescript-compat-react-native) for work towards this, where I've ported part of RNTester as a proof-of-concept... 👩‍🔬👨‍🔬

**Can this consume React Native native modules?**

Certainly not UI-based native modules. But all flavours of NativeScript can consume native code, so it can probably consume React Native native modules, though may take a small bit of refactoring 🤔

Stanisław Chmiela ([@sjchmiela](https://twitter.com/sjchmiela)) produced a [proof-of-concept](https://gist.github.com/sjchmiela/e1fcb7ca255e77e92bb2c64bc63b7fee) for importing Expo Unimodules into NativeScript that could be used as a basis for this effort. Original discussion [here](https://twitter.com/sjchmiela/status/1158402590499057665?s=20).

## Contributing 🙋‍♀️

Ideally get in contact via the [Discord channel](https://discord.gg/kcTwmBUuTE) before starting any PRs!
