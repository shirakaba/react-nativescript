import * as React from "react";
import { ScrollView, GestureEventData } from "@nativescript/core";

export function UpdateEventHandlerTest() {
    function handleTap(args: GestureEventData) {
      console.log('2');
    }
  
    return (
        <button onTap={handleTap} text="click me"/>
    );
}