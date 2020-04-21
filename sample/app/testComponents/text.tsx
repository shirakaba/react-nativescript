import * as React from "react";
import { Color } from "@nativescript/core";

export class FormattedStringTest extends React.Component<{ forwardedRef: React.Ref<any> }, {}> {
    render(){
        return (
            <stackLayout
                ref={this.props.forwardedRef}
                style={{
                    backgroundColor: "gray",
                    height: "100%",
                    width: "100%",
                }}
            >
                <label textWrap={true}>
                    <formattedString>
                        <span text="This text has a " />
                        <span text="red " color={new Color("red")} />
                        <span>TEXT NODE ONE </span>
                        <span text="Also, this bit is italic, " fontStyle="italic" />
                        <span text="and this bit is bold." fontWeight="bold" />
                        <span>TEXT NODE TWO</span>
                    </formattedString>
                </label>

                <label>TEXT NODE THREE</label>
            </stackLayout>
        );
    }
}