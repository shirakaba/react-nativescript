import * as React from "react";
import { $ScrollView, $TextView, $StackLayout } from "react-nativescript";
import { ScrollView } from "@nativescript/core";

export class DeletePropFromScrollViewTest extends React.Component<{ forwardedRef: React.Ref<any> }, {}> {
    render(){
        return (
            <$StackLayout ref={this.props.forwardedRef} backgroundColor={"gray"} height={"100%" as any} width={"100%" as any}>
                <$ScrollView isScrollEnabled={true} backgroundColor={"purple"} height={"100%" as any} width={"100%" as any}>
                    <$StackLayout backgroundColor={"red"} height={"auto" as any} width={"100%" as any}>
                        <$StackLayout backgroundColor={"orange"} height={"400px" as any} width={"100%" as any}>
                        </$StackLayout>
                        <$StackLayout backgroundColor={"yellow"} height={"400px" as any} width={"100%" as any}>
                        </$StackLayout>
                        <$StackLayout backgroundColor={"green"} height={"400px" as any} width={"100%" as any}>
                        </$StackLayout>
                        <$StackLayout backgroundColor={"blue"} height={"400px" as any} width={"100%" as any}>
                        </$StackLayout>
                    </$StackLayout>
                </$ScrollView>
            </$StackLayout>
        );
    }
}