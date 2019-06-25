# `react-nativescript`

**React NativeScript** is a JavaScript library that enables you to build NativeScript UIs using the industry-standard UI-building framework, React. In other words, it is a 'React renderer' for NativeScript.

**Note:** by default, `react-nativescript` will **not** be in development mode, meaning that it will hide debug logs and any warnings about common mistakes. To switch to development mode, set `(global as any).__DEV__ = true;` early in your startup process (e.g. before calling `ReactNativeScript.start()`).

## Example Usage

Here is an example of starting up a minimal app without JSX nor HMR:

```js
// app.ts
import * as React from "react";
import * as ReactNativeScript from "react-nativescript/dist/index";
import { $StackLayout, $Label } from "react-nativescript/dist/index";
import { Color } from "tns-core-modules/color";

const rootRef: React.RefObject<any> = React.createRef<any>();

ReactNativeScript.start(
    React.createElement(
        $StackLayout,
        {
            ref: rootRef,
            backgroundColor: new Color('green')
        },
        React.createElement(
            $Label,
            {
                color: new Color('blue')
            },
            "Hello, World!"
        ),
    ),
    rootRef
);
```

More comprehensive setup documentation can be found here: https://github.com/shirakaba/react-nativescript
