# Making the sample app

I used the standard TypeScript Hello World template.

```sh
tns create sample --tsc
```

## Taking the repo's build as a dependency

I added this line to the `package.json` of the sample app:

```
"nativescript-react": "file:../dist",
```

TODO:
* See React-DOM https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOM.js
* See https://overreacted.io/react-as-a-ui-runtime/
* https://github.com/facebook/react/blob/master/packages/react-reconciler/README.md