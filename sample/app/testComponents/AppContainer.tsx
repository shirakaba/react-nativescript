import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { Clock, ClockFC, Counter, MarqueeFC } from "./stateful";

function AppContainer(){
    return (
        <stackLayout style={styles.stack}>
            <label>Hello world!</label>
            <Clock/>
            <ClockFC/>
            <Counter/>
            <MarqueeFC text="The quick brown fox jumps over the lazy dog."/>
        </stackLayout>
    );
}

const styles = StyleSheet.create({
    stack: {
        backgroundColor: "gold",
    }
});

export default AppContainer;