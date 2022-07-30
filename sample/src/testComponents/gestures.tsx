import * as React from "react";
import { NSVElement, PageAttributes } from "react-nativescript";
import { PortalToPageWithActionBar, StatefulPortalToPageWithActionBar } from "./navigation";
import {
    Page,
    EventData,
    GestureEventData,
    PinchGestureEventData,
    PanGestureEventData,
    SwipeGestureEventData,
    RotationGestureEventData,
    TouchGestureEventData,
    GestureStateTypes,
    SwipeDirection,
} from "@nativescript/core";

export class GestureLoggingTest extends React.Component<{}, {}> {
    render() {
        return (
            <contentView
                style={{
                    backgroundColor: "yellow",
                    width: { unit: "%", value: 100 },
                    height: { unit: "%", value: 100 },
                }}
                onTap={(args: GestureEventData) => console.log(`[onTap] yellow`)}
                onDoubleTap={(args: GestureEventData) => console.log(`[onDoubleTap] yellow`)}
                onPinch={(args: PinchGestureEventData) => console.log(`[onPinch] yellow`)}
                onPan={(args: PanGestureEventData) => console.log(`[onPan] yellow`)}
                onSwipe={(args: SwipeGestureEventData) => console.log(`[onSwipe] yellow`)}
                onRotation={(args: RotationGestureEventData) => console.log(`[onRotation] yellow`)}
                onLongPress={(args: GestureEventData) => console.log(`[onLongPress] yellow`)}
                onTouch={(args: TouchGestureEventData) => console.log(`[onTouch] yellow`)}
            >
                <flexboxLayout justifyContent="center" alignItems="center">
                    <contentView
                        style={{
                            backgroundColor: "orange",
                            width: { unit: "px", value: 300 },
                            height: { unit: "px", value: 300 },
                        }}
                        onTap={(args: GestureEventData) => console.log(`[onTap] orange`)}
                        onDoubleTap={(args: GestureEventData) => console.log(`[onDoubleTap] orange`)}
                        onPinch={(args: PinchGestureEventData) => console.log(`[onPinch] orange`)}
                        onPan={(args: PanGestureEventData) => console.log(`[onPan] orange`)}
                        onSwipe={(args: SwipeGestureEventData) => console.log(`[onSwipe] orange`)}
                        onRotation={(args: RotationGestureEventData) => console.log(`[onRotation] orange`)}
                        onLongPress={(args: GestureEventData) => console.log(`[onLongPress] orange`)}
                        onTouch={(args: TouchGestureEventData) => console.log(`[onTouch] orange`)}
                    />
                </flexboxLayout>
            </contentView>
        );
    }
}

export class PanGestureTest extends React.Component<
    {},
    {
        xBeforePan: number;
        yBeforePan: number;
        x: number;
        y: number;
    }
> {
    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            xBeforePan: 0,
            yBeforePan: 0,
        };
    }

    onPan = (args: PanGestureEventData) => {
        const { x, y, xBeforePan, yBeforePan } = this.state;
        const { deltaX, deltaY, state } = args;
        // console.log(`[onPan] state: ${state}, deltaX: ${deltaX}, deltaY ${deltaY}`);

        const pointBeforePan = {
            xBeforePan: state === GestureStateTypes.began ? x : xBeforePan,
            yBeforePan: state === GestureStateTypes.began ? y : yBeforePan,
        };

        /* If the screen is 370 px wide and you move your mouse from one side to another,
         * the deltaX will become ~370 px and we set 'left' to ~370.
         *
         * However, it seems that visually the orange box only moves half the screen distance.
         * For some reason, the x2 factor is necessary. Maybe it's pixel density? */
        this.setState({
            ...pointBeforePan,
            x: pointBeforePan.xBeforePan + deltaX * 2,
            y: pointBeforePan.yBeforePan + deltaY * 2,
        });
    };

    render() {
        const { x, y } = this.state;

        return (
            <contentView
                style={{
                    backgroundColor: "yellow",
                    width: { unit: "%", value: 100 },
                    height: { unit: "%", value: 100 },
                }}
            >
                <absoluteLayout>
                    <contentView
                        left={{ unit: "px", value: x }}
                        top={{ unit: "px", value: y }}
                        style={{
                            backgroundColor: "orange",
                            width: { unit: "px", value: 300 },
                            height: { unit: "px", value: 300 },
                        }}
                        onPan={this.onPan}
                    />
                </absoluteLayout>
            </contentView>
        );
    }
}

export class PageGestureTest extends React.Component<{ forwardedRef: React.RefObject<NSVElement<Page>> } & PageAttributes, {}> {
    private readonly yellowPageRef = React.createRef<NSVElement<Page>>();
    render() {
        const { forwardedRef, ...rest } = this.props;

        return (
            <page
                ref={forwardedRef}
                actionBarHidden={false}
                {...rest}
                onSwipe={(args: SwipeGestureEventData) => console.log(`[onSwipe] base Page`)}
            >
                <actionBar title="Navigation Hub" className="action-bar" />
                <stackLayout>
                    <button
                        text={"Navigate to yellow page"}
                        onTap={() => {
                            const currentPage: Page = forwardedRef.current!.nativeView;
                            currentPage.frame.navigate({
                                create: () => {
                                    return this.yellowPageRef.current!.nativeView;
                                },
                            });
                        }}
                    />
                </stackLayout>

                <PortalToPageWithActionBar
                    forwardedRef={this.yellowPageRef}
                    actionBarTitle={"Yellow page"}
                    backgroundColor={"yellow"}
                    onSwipe={(args: SwipeGestureEventData) => {
                        if (args.direction === SwipeDirection.right) {
                            console.log(`[onSwipe] yellow Page, rightwards (so shall go back)`);
                            this.yellowPageRef.current!.nativeView.frame.goBack();
                        } else {
                            console.log(`[onSwipe] yellow Page, not rightwards (so shan't go back). direction: ${args.direction}`);
                        }
                    }}
                >
                    <label>You're viewing the yellow page!</label>
                </PortalToPageWithActionBar>
            </page>
        );
    }
}

/**
 * Navigates to a Page (via a Portal) that holds an inlined child that can update state upon clicking a button.
 * App will crash upon button click if the portal is rendering into an incorrect container,
 * as it will re-reconcile the DOM tree incorrectly.
 *
 * Expected result: app doesn't crash (any more)
 */
export class StatefulPageGestureTest extends React.Component<{ forwardedRef: React.RefObject<NSVElement<Page>> } & PageAttributes, {}> {
    private readonly yellowPageRef = React.createRef<NSVElement<Page>>();

    private readonly onSwipeBasePage = (args: GestureEventData) => {
        console.log(`[onSwipe] onSwipeBasePage`);
    };

    private readonly onTapBasePage = (args: EventData) => {
        const currentPage: Page = this.props.forwardedRef.current!.nativeView;
        // currentPage.frame.page
        currentPage.frame.navigate({
            create: () => {
                return this.yellowPageRef.current!.nativeView;
            },
        });
    };

    shouldComponentUpdate(nextProps: StatefulPageGestureTest["props"], nextState: StatefulPageGestureTest["state"]): boolean {
        console.log(`[StatefulPageGestureTest.shouldComponentUpdate]`);
        return true;
    }

    render() {
        const { forwardedRef, ...rest } = this.props;

        console.log(
            `[StatefulPageGestureTest.render()] forwardedRef.current: ${forwardedRef.current}; this.yellowPageRef.current: ${
                this.yellowPageRef.current
            }; currentPage: ${forwardedRef.current && forwardedRef.current!.nativeView.frame.currentPage}`
        );
        // const yellowPageRef = React.createRef<NSVElement<Page>>();

        return (
            <page ref={forwardedRef} actionBarHidden={false} {...rest} onSwipe={this.onSwipeBasePage}>
                <actionBar title="Navigation Hub" className="action-bar" />
                <stackLayout>
                    <button text={"Navigate to yellow page"} onTap={this.onTapBasePage} />
                </stackLayout>

                <PortalToStatefulPage yellowPageRef={this.yellowPageRef} />
            </page>
        );
    }
}

/**
 * A portal with an inlined child that can update state upon clicking a button.
 * App will crash upon button click if the portal is rendering into an incorrect container reference,
 * as it will re-reconcile the DOM tree incorrectly.
 */
export class PortalToStatefulPage extends React.Component<
    { yellowPageRef: React.RefObject<NSVElement<Page>> } & PageAttributes,
    {
        xBeforePan: number;
        yBeforePan: number;
        x: number;
        y: number;
    }
> {
    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            xBeforePan: 0,
            yBeforePan: 0,
        };
    }

    private readonly onSwipeYellowPage = (args: SwipeGestureEventData) => {
        console.log(`[onSwipe] orange`);

        if (args.direction === SwipeDirection.right) {
            console.log(`[onSwipe] yellow Page, rightwards (so shall go back)`);
            this.props.yellowPageRef.current!.nativeView.frame.goBack();
        } else {
            console.log(`[onSwipe] yellow Page, not rightwards (so shan't go back). direction: ${args.direction}`);
        }
    };

    private readonly onTap = (args: GestureEventData) => {
        console.log(`[onTap] yellow`);

        this.setState((prevState) => ({
            x: prevState.x + 10,
            y: prevState.y + 10,
        }));
    };

    shouldComponentUpdate(nextProps: PortalToStatefulPage["props"], nextState: PortalToStatefulPage["state"]): boolean {
        console.log(`[PortalToStatefulPage.shouldComponentUpdate]`);
        return true;
    }

    render() {
        const { yellowPageRef, ...rest } = this.props;
        const { x, y } = this.state;

        console.log(`[StatefulPage.render()] yellowPageRef.current: ${this.props.yellowPageRef.current}`);
        // const yellowPageRef = React.createRef<NSVElement<Page>>();

        return (
            <StatefulPortalToPageWithActionBar
                forwardedRef={this.props.yellowPageRef}
                actionBarTitle={"Yellow page"}
                backgroundColor={"yellow"}
                onSwipe={this.onSwipeYellowPage}
            >
                <contentView
                    style={{
                        backgroundColor: "yellow",
                        width: { unit: "%", value: 100 },
                        height: { unit: "%", value: 100 },
                    }}
                >
                    <absoluteLayout>
                        <contentView
                            left={{ unit: "px", value: x }}
                            top={{ unit: "px", value: y }}
                            style={{
                                backgroundColor: "orange",
                                width: { unit: "px", value: 300 },
                                height: { unit: "px", value: 300 },
                            }}
                            // onPan={this.onPan}
                            onTap={this.onTap}
                        />
                    </absoluteLayout>
                </contentView>
            </StatefulPortalToPageWithActionBar>
        );
    }
}

/**
 * A hub that navigates to a portal with a child that can update state internally upon clicking a button.
 *
 * Unlike StatefulPageGestureTest, the app will NOT crash upon button click if the portal is rendering
 * into an incorrect container. This is because the state change is isolated to the
 * PortalToPageWithStatefulContentView component, so does not cause the whole component tree to be
 * re-reconciled.
 *
 * Expected: doesn't crash.
 */
export class StatefulPageGestureTest2 extends React.Component<{ forwardedRef: React.RefObject<NSVElement<Page>> } & PageAttributes, {}> {
    private readonly yellowPageRef = React.createRef<NSVElement<Page>>();

    private readonly onTapBasePage = (args: EventData) => {
        const currentPage: Page = this.props.forwardedRef.current!.nativeView;
        // currentPage.frame.page
        currentPage.frame.navigate({
            create: () => {
                return this.yellowPageRef.current!.nativeView;
            },
        });
    };

    shouldComponentUpdate(nextProps: StatefulPageGestureTest2["props"], nextState: StatefulPageGestureTest2["state"]): boolean {
        console.log(`[StatefulPageGestureTest2.shouldComponentUpdate]`);
        return true;
    }

    render() {
        const { forwardedRef, ...rest } = this.props;

        console.log(
            `[StatefulPageGestureTest2.render()] forwardedRef.current: ${forwardedRef.current}; this.yellowPageRef.current: ${
                this.yellowPageRef.current
            }; currentPage: ${forwardedRef.current && forwardedRef.current!.nativeView.frame.currentPage}`
        );

        return (
            <page ref={forwardedRef} actionBarHidden={false} {...rest}>
                <actionBar title="Navigation Hub" className="action-bar" />
                <stackLayout>
                    <button text={"Navigate to yellow page"} onTap={this.onTapBasePage} />
                </stackLayout>

                <PortalToPageWithStatefulContentView yellowPageRef={this.yellowPageRef} />
            </page>
        );
    }
}

/**
 * A portal with a child (StatefulContentView) that can update state internally upon clicking a button.
 */
export class PortalToPageWithStatefulContentView extends React.Component<
    { yellowPageRef: React.RefObject<NSVElement<Page>> } & PageAttributes,
    {}
> {
    shouldComponentUpdate(nextProps: PortalToStatefulPage["props"], nextState: PortalToStatefulPage["state"]): boolean {
        console.log(`[PortalToStatefulPage.shouldComponentUpdate]`);
        return true;
    }

    render() {
        const { yellowPageRef, ...rest } = this.props;

        console.log(`[PortalToPage.render()] yellowPageRef.current: ${this.props.yellowPageRef.current!.nativeView}`);

        return (
            <PortalToPageWithActionBar forwardedRef={this.props.yellowPageRef} actionBarTitle={"Yellow page"} backgroundColor={"yellow"}>
                <StatefulContentView />
            </PortalToPageWithActionBar>
        );
    }
}

/**
 * A class component whose state will update upon clicking a button.
 */
export class StatefulContentView extends React.Component<
    {} & PageAttributes,
    {
        xBeforePan: number;
        yBeforePan: number;
        x: number;
        y: number;
    }
> {
    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            xBeforePan: 0,
            yBeforePan: 0,
        };
    }

    private readonly onTap = (args: GestureEventData) => {
        console.log(`[onTap] yellow`);

        this.setState((prevState) => ({
            x: prevState.x + 10,
            y: prevState.y + 10,
        }));
    };

    shouldComponentUpdate(nextProps: StatefulContentView["props"], nextState: StatefulContentView["state"]): boolean {
        console.log(`[StatefulContentView.shouldComponentUpdate]`);
        return true;
    }

    render() {
        const { ...rest } = this.props;
        const { x, y } = this.state;

        return (
            <contentView
                style={{
                    backgroundColor: "yellow",
                    width: { unit: "%", value: 100 },
                    height: { unit: "%", value: 100 },
                }}
            >
                <absoluteLayout>
                    <contentView
                        left={{ unit: "px", value: x }}
                        top={{ unit: "px", value: y }}
                        style={{
                            backgroundColor: "orange",
                            width: { unit: "px", value: 300 },
                            height: { unit: "px", value: 300 },
                        }}
                        onTap={this.onTap}
                    />
                </absoluteLayout>
            </contentView>
        );
    }
}
