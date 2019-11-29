import * as React from "react";
import { $Page, $ContentView } from 'react-nativescript';

export const rootRef: React.RefObject<any> = React.createRef<any>();
export const cvRef: React.RefObject<any> = React.createRef<any>();

const AppContainer = () => (
    <$Page
        ref={rootRef}
        width={{ value: 100, unit: "%" }}
        height={{ value: 100, unit: "%" }}
        backgroundColor="blue"
        onLoaded={()=> { console.log("page loaded!"); }}
        onTap={()=> { console.log("on tap!"); }}
        onTouch={()=> { console.log("on touch!"); }}
    >
        <$ContentView
            // ref={cvRef}
            width={{ value: 100, unit: "%" }}
            height={{ value: 100, unit: "%" }}
            backgroundColor="red"
        />
    </$Page>
); 

export default AppContainer;