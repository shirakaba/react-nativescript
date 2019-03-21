import React, { Component } from 'react';
import { ViewProps } from "./ViewPropTypes";
import { default as ViewNativeComponent, ViewNativeComponentType } from "./ViewNativeComponent";
export type Props = ViewProps;

let ViewToExport: ViewNativeComponentType = ViewNativeComponent;

const View  = (
    props: Props,
    forwardedRef: any // React.Ref<typeof ViewNativeComponent>,
) => {
    // Don't try nesting anything inside a <Text> because we don't support it!
    
    ViewToExport = React.forwardRef(View as any);
    ViewToExport.displayName = 'View';
}