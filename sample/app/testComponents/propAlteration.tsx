import * as React from "react";
import { $ScrollView, $TextView, $StackLayout, $GridLayout, $Label, $Button } from "react-nativescript";
import { ScrollView, GestureEventData } from "@nativescript/core";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";

export function UpdateEventHandlerTest() {
    function handleTap(args: GestureEventData) {
      console.log('2');
    }
  
    return (
        <$Button onTap={handleTap} text="click me"/>
    );
}