import * as React from "react";
import { $ScrollView, $TextView, $StackLayout, $GridLayout, $Label } from "react-nativescript";
import { ScrollView } from "@nativescript/core";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";

export class DeletePropFromScrollViewTest extends React.Component<{ forwardedRef: React.Ref<any> }, {}> {
    render(){
        return (
            <$StackLayout ref={this.props.forwardedRef} backgroundColor={"gray"} height={"100%" as any} width={"100%" as any}>
                <DeletePropFromScrollViewTestContent/>
            </$StackLayout>
        );
    }
}

class DeletePropFromScrollViewTestContent extends React.Component<{}, {}> {
    render(){
        return (
            <$ScrollView orientation="vertical">
                {/* <$GridLayout rows="200 200 200 200 200 200 200 200 200 200"> */}
                <$GridLayout
                    rows={[
                        new ItemSpec(200, "pixel"),
                        new ItemSpec(200, "pixel"),
                        new ItemSpec(200, "pixel"),
                        new ItemSpec(200, "pixel"),
                        new ItemSpec(200, "pixel"),
                        new ItemSpec(200, "pixel"),
                        new ItemSpec(200, "pixel"),
                        new ItemSpec(200, "pixel"),
                        new ItemSpec(200, "pixel"),
                        new ItemSpec(200, "pixel"),
                    ]}
                >
                    <$Label className="m-10" row={0} text="Some text content follows here..." textWrap={true} />
                    <$Label className="m-10" row={1} text="Some text content follows here..." textWrap={true} />
                    <$Label className="m-10" row={2} text="Some text content follows here..." textWrap={true} />
                    <$Label className="m-10" row={3} text="Some text content follows here..." textWrap={true} />
                    <$Label className="m-10" row={4} text="Some text content follows here..." textWrap={true} />
                    <$Label className="m-10" row={5} text="Some text content follows here..." textWrap={true} />
                    <$Label className="m-10" row={6} text="Some text content follows here..." textWrap={true} />
                    <$Label className="m-10" row={7} text="Some text content follows here..." textWrap={true} />
                    <$Label className="m-10" row={8} text="Some text content follows here..." textWrap={true} />
                    <$Label className="m-10" row={9} text="Some text content follows here..." textWrap={true} />
                </$GridLayout>
            </$ScrollView>
        );
    }
}