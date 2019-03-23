# Setting up the library repo:

## Setup as a node module

I configured the `package.json` for the `react-nativescript` repo as follows:

```js
{
    // ...
    "name": "react-nativescript",
    "main": "dist/index.js",
    "types": "dist",
    // ...
    "peerDependencies": {
        "react": "",
        "tns-core-modules": "" 
    }
}
```

## Installation of library's dependencies

Now I must manually install react and tns-core-modules:

```sh
npm install react tns-core-modules
```

## Building the TypeScript source

```sh
npm run build
```

# Setting up the sample app

## Creating the app

I used the standard TypeScript Hello World template.

```sh
tns create sample --tsc
```

## Installing the library

... I installed it as a local dependency of the sample app:

```sh
cd sample
npm install --save file:../.
```

## Running the sample app

```sh
cd sample
tns run ios --bundle
```

TODO:
* See React-DOM https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOM.js
* See https://overreacted.io/react-as-a-ui-runtime/
* https://github.com/facebook/react/blob/master/packages/react-reconciler/README.md