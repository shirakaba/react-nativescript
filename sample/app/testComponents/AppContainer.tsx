import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { Clock, ClockFC, Counter } from "./stateful";

function AppContainer(){
    return (
        <stackLayout style={styles.stack}>
            <label>Hello world!</label>
            <Clock/>
            <ClockFC/>
            <Counter/>
        </stackLayout>
    );
}

const styles = StyleSheet.create({
    stack: {
        backgroundColor: "gold",
    }
});

export default AppContainer;