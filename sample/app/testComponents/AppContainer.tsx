import * as React from "react";
import { $Page } from 'react-nativescript';

export const rootRef: React.RefObject<any> = React.createRef<any>();

const AppContainer = () => (
    <$Page ref={rootRef} backgroundColor="green" onLoaded={()=> { console.log("page loaded!"); }} onTap={()=> { console.log("on tap!"); }} onTouch={()=> { console.log("on touch!"); }}/>
); 

export default AppContainer;