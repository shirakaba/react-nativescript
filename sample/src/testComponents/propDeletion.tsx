import * as React from "react";
import { StackLayout } from "@nativescript/core";
import { NSVElement } from "react-nativescript";

export class DeletePropFromScrollViewTest extends React.Component<{ forwardedRef: React.Ref<NSVElement<StackLayout>> }, {}> {
    render() {
        return (
            <stackLayout ref={this.props.forwardedRef} backgroundColor={"gray"} height={"100%"} width={"100%"}>
                <DeletePropFromScrollViewTestContent />
            </stackLayout>
        );
    }
}

class DeletePropFromScrollViewTestContent extends React.Component<{}, {}> {
    render() {
        return (
            <scrollView orientation="vertical">
                {/* <gridLayout rows="200 200 200 200 200 200 200 200 200 200"> */}
                <gridLayout rows={"200 200 200 200 200 200 200 200 200 200"}>
                    <label className="m-10" row={0} text="Some text content follows here..." textWrap={true} />
                    <label className="m-10" row={1} text="Some text content follows here..." textWrap={true} />
                    <label className="m-10" row={2} text="Some text content follows here..." textWrap={true} />
                    <label className="m-10" row={3} text="Some text content follows here..." textWrap={true} />
                    <label className="m-10" row={4} text="Some text content follows here..." textWrap={true} />
                    <label className="m-10" row={5} text="Some text content follows here..." textWrap={true} />
                    <label className="m-10" row={6} text="Some text content follows here..." textWrap={true} />
                    <label className="m-10" row={7} text="Some text content follows here..." textWrap={true} />
                    <label className="m-10" row={8} text="Some text content follows here..." textWrap={true} />
                    <label className="m-10" row={9} text="Some text content follows here..." textWrap={true} />
                </gridLayout>
            </scrollView>
        );
    }
}
