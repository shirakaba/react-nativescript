import { Type } from "../client/HostConfig";

/**
 * Code in here referenced from: https://github.com/facebook/react/blob/master/packages/react-dom/src/shared/assertValidProps.js which carries the following copyright:
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in React-LICENSE.txt.
 */

function assertValidProps(tag: Type, props?: any): void|never {
    if (!props) {
        return;
    }

    if ((global as any).__DEV__) {
        if(
            !(
                props.suppressContentEditableWarning ||
                !props.contentEditable ||
                props.children == null
            )
        ){
            console.warn(
                'A component is `contentEditable` and contains `children` managed by ' +
                    'React. It is now your responsibility to guarantee that none of ' +
                    'those nodes are unexpectedly modified or duplicated. This is ' +
                    'probably not intentional.',
            )
        }
    }

    if(!(props.style == null || typeof props.style === 'object')){
        throw new Error(
            'The `style` prop expects a mapping from style properties to values, ' +
            "not a string. For example, style={{marginRight: spacing + 'em'}} when " +
            'using JSX.',
        );
    }
}
export default assertValidProps;