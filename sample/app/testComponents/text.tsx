import * as React from "react";
import { $StackLayout, $Label, $FormattedString, $Span } from "react-nativescript";
import { Color } from "@nativescript/core";

export class FormattedStringTest extends React.Component<{ forwardedRef: React.Ref<any> }, {}> {
    render(){
        return (
            <$StackLayout ref={this.props.forwardedRef} backgroundColor={"gray"} height={"100%" as any} width={"100%" as any}>
                <$Label textWrap={true}>
                    <$FormattedString>
                        <$Span text="This text has a " />
                        <$Span text="red " color={new Color("red")} />
                        <$Span>TEXT NODE ONE </$Span>
                        <$Span text="Also, this bit is italic, " fontStyle="italic" />
                        <$Span text="and this bit is bold." fontWeight="bold" />
                        <$Span>TEXT NODE TWO</$Span>
                    </$FormattedString>
                </$Label>

                <$Label>TEXT NODE THREE</$Label>
            </$StackLayout>
        );
    }
}