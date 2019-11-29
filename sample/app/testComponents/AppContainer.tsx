import * as React from "react";
import { $Page, $ContentView } from 'react-nativescript';

export const rootRef: React.RefObject<any> = React.createRef<any>();

const AppContainer = () => (
    <$Page
        ref={rootRef}
        backgroundColor="blue"
        onLoaded={()=> { console.log("page loaded!"); }}
        onTap={()=> { console.log("on tap!"); }}
        onTouch={()=> { console.log("on touch!"); }}
    >
        <$ContentView
            width={{ value: 50, unit: "%" }}
            height={{ value: 50, unit: "%" }}
            backgroundColor="red"
            
        />
    </$Page>
); 

export default AppContainer;