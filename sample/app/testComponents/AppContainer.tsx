import * as React from "react";
import { StyleSheet } from "react-nativescript";

function AppContainer(){
    return (
        <stackLayout style={styles.stack}>
            <label>Hello world!</label>
        </stackLayout>
    );
}

const styles = StyleSheet.create({
    stack: {
        backgroundColor: "gold",
    }
});

export default AppContainer;