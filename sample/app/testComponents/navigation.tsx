import * as React from "react";
import { PercentLength, FormattedString } from "tns-core-modules/ui/text-base/text-base";
import { Color } from "tns-core-modules/color";
import { Span } from "tns-core-modules/text/span";
import { ContentView, TextBase, ViewBase, StackLayout, Label, TabView, Page, ProxyViewContainer } from "react-nativescript/dist/client/ElementRegistry";
import { ViewProps, StylePropContents } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import {
    RCTButton,
    RCTContentView,
    RCTTextView,
    RCTLabel,
    // StylePropContents,
    RCTDockLayout,
    RCTAbsoluteLayout,
    RCTStackLayout,
    RCTFlexboxLayout,
    RCTListView,
    RCTActionBar,
    RCTTabView,
    RCTTabViewItem,
    RCTPage,
} from "react-nativescript/dist/index";
import * as ReactNativeScript from "react-nativescript/dist/index";
import { TabViewItem } from "tns-core-modules/ui/tab-view/tab-view";
import { PageComponentProps } from "react-nativescript/dist/components/Page";
import { DockLayoutTest, FlexboxLayoutTest, AbsoluteLayoutTest } from "./layout";

export class NestedHub extends React.Component<{
    innerRef: React.RefObject<Page>;
} & PageComponentProps, {}> {
    render() {
        const { innerRef, ...rest } = this.props;
        const greenPageRef = React.createRef<Page>();
        const redPageRef = React.createRef<Page>();
        return (<RCTPage innerRef={innerRef} actionBarHidden={false} {...rest}>
            <RCTActionBar title="Hub" className="action-bar" />
            <RCTStackLayout>
                <RCTButton text={"Navigate to green page"} onPress={() => {
                    const currentPage: Page = innerRef.current!;
                    currentPage.frame.navigate({
                        create: () => {
                            return greenPageRef.current;
                        }
                    });
                }} />
            </RCTStackLayout>

            <PortalToPageWithActionBar innerRef={greenPageRef} actionBarTitle={"Green"} backgroundColor={"green"}>
                <RCTStackLayout>
                    <RCTLabel>You're viewing the green page!</RCTLabel>
                    <RCTButton text={"Navigate to red page"} onPress={() => {
                        const currentPage: Page = greenPageRef.current!;
                        currentPage.frame.navigate({
                            create: () => {
                                return redPageRef.current;
                            }
                        });
                    }} />
                </RCTStackLayout>

            </PortalToPageWithActionBar>

            <PortalToPageWithActionBar innerRef={redPageRef} actionBarTitle={"Red"} backgroundColor={"red"}>
                <RCTStackLayout>
                    <RCTLabel>You're viewing the red page!</RCTLabel>
                </RCTStackLayout>
            </PortalToPageWithActionBar>
        </RCTPage>);
    }
}
export class NestedModalTest extends React.Component<{
    innerRef: React.RefObject<Page>;
} & PageComponentProps, {}> {
    render() {
        const { innerRef, ...rest } = this.props;
        const yellowPageRef = React.createRef<Page>();
        const greenPageRef = React.createRef<Page>();
        return (<RCTPage innerRef={innerRef} actionBarHidden={false} {...rest}>
            <RCTActionBar title="Navigation Hub" className="action-bar" />
            <RCTStackLayout>
                <RCTButton text={"Open yellow modal"} onPress={() => {
                    const currentPage: Page = innerRef.current!;
                    currentPage.showModal(yellowPageRef.current!, {
                        context: {},
                        closeCallback: () => { },
                        animated: true,
                        stretched: false,
                    });
                }} />
            </RCTStackLayout>

            <PortalToPageWithActionBar innerRef={yellowPageRef} actionBarTitle={"Yellow page"} backgroundColor={"yellow"}>
                <RCTStackLayout>
                    <RCTLabel>You're viewing the yellow page!</RCTLabel>
                    <RCTButton text={"Open green modal"} onPress={() => {
                        const currentPage: Page = yellowPageRef.current!;
                        currentPage.showModal(greenPageRef.current!, {
                            context: {},
                            closeCallback: () => { },
                            animated: true,
                            stretched: false,
                        });
                    }} />
                    <RCTButton text={"Close yellow modal"} onPress={() => {
                        const currentPage: Page = yellowPageRef.current!;
                        currentPage.closeModal({});
                    }} />
                </RCTStackLayout>
            </PortalToPageWithActionBar>

            <PortalToPageWithActionBar innerRef={greenPageRef} actionBarTitle={"Green page"} backgroundColor={"green"}>
                <RCTStackLayout>
                    <RCTLabel>You're viewing the green page!</RCTLabel>
                    <RCTButton text={"Close green modal"} onPress={() => {
                        const currentPage: Page = greenPageRef.current!;
                        currentPage.closeModal({});
                    }} />
                </RCTStackLayout>
            </PortalToPageWithActionBar>
        </RCTPage>);
    }
}


export class ActionBarTest extends React.Component<{}, {}> {
    render(){
        const navigationButton = new NavigationButton();
        navigationButton.text = "Go Back";
        return React.createElement(
            RCTActionBar,
            {
                navigationButton,
                // color: new Color("red"),
                // backgroundColor: new Color("blue"),
            },
            null
        );
    }
}

export class TabViewTest extends React.Component<{}, {}> {
    render(){
        return React.createElement(
            RCTTabView,
            {
                selectedIndex: 1
            },

            React.createElement(
                RCTTabViewItem,
                {
                    title: "Dock",
                    identifier: `Item 0`,
                },
                React.createElement(
                    DockLayoutTest,
                    {},
                    null
                )
            ),

            React.createElement(
                RCTTabViewItem,
                {
                    title: "Flexbox",
                    identifier: `Item 1`,
                },
                React.createElement(
                    FlexboxLayoutTest,
                    {},
                    null
                )
            ),

            // React.createElement(
            //     ReactTabViewItem,
            //     {
            //         title: "Clock",
            //         identifier: `Item 2`,
            //     },
            //     React.createElement(
            //         Clock,
            //         {},
            //         null
            //     )
            // ),

            // React.createElement(
            //     ReactTabViewItem,
            //     {
            //         title: "Marquee",
            //         identifier: `Item 3`,
            //     },
            //     React.createElement(
            //         GameLoopComponent,
            //         {
            //             frameRateMs: 1000,
            //         },
            //         React.createElement(
            //             Marquee,
            //             {
            //                 text: "Have you ever seen a game-looped Marquee before?"
            //             },
            //             null
            //         )
            //     )
            // ),
        );
    }
}

export class PageWithActionBar extends React.Component<
    {
        innerRef: React.RefObject<Page>,
        actionBarTitle: string,
    },
    {}
> {
    render(){
        const { children, innerRef, actionBarTitle, ...rest } = this.props;

        return (
            <RCTPage innerRef={innerRef} actionBarHidden={false} {...rest} >
                <RCTActionBar title={actionBarTitle} className={"action-bar"}>
                    {children}
                </RCTActionBar>
            </RCTPage>
        );
    }
}

const PortalToPage: React.SFC<{ pageRef: React.RefObject<Page>, actionBarTitle: string }> = (props) => {
    const { pageRef, actionBarTitle, children } = props;
    return ReactNativeScript.createPortal(
        (
            <PageWithActionBar innerRef={pageRef} actionBarTitle={actionBarTitle}>
                {children}
            </PageWithActionBar>
        ),
        pageRef.current,
        `Portal('${actionBarTitle}')`
    );
}

export class HubTest extends React.Component<{ innerRef: React.RefObject<Page> }, {}> {
    render(){
        const { innerRef } = this.props;
        const absoluteLayoutPageRef = React.createRef<Page>();
        const dockLayoutPageRef = React.createRef<Page>();
        const flexboxLayoutPageRef = React.createRef<Page>();

        return (
            <RCTPage innerRef={innerRef} actionBarHidden={false}>
                <RCTActionBar title="Navigation Hub" className="action-bar" />
                <RCTStackLayout>
                    <RCTButton
                        text={"Navigate to AbsoluteLayout"}
                        onPress={() => {
                            const page: Page = innerRef.current!;
                            page.frame.navigate({
                                create: () => {
                                    console.log(`Navigating to AbsoluteLayout page. Ref:`, absoluteLayoutPageRef.current);
                                    return absoluteLayoutPageRef.current;
                                }
                            });
                        }}
                    />
                    <RCTButton
                        text={"Navigate to DockLayout"}
                        onPress={() => {
                            const page: Page = innerRef.current!;
                            page.frame.navigate({
                                create: () => {
                                    console.log(`Navigating to DockLayout page. Ref:`, dockLayoutPageRef.current);
                                    return dockLayoutPageRef.current;
                                }
                            });
                        }}
                    />
                    <RCTButton
                        text={"Navigate to FlexboxLayout"}
                        onPress={() => {
                            const page: Page = innerRef.current!;
                            page.frame.navigate({
                                create: () => {
                                    console.log(`Navigating to FlexboxLayout page. Ref:`, flexboxLayoutPageRef.current);
                                    return flexboxLayoutPageRef.current;
                                }
                            });
                        }}
                    />
                </RCTStackLayout>
                
                <PortalToPage pageRef={absoluteLayoutPageRef} actionBarTitle={"AbsoluteLayout"}>
                    <AbsoluteLayoutTest/>
                </PortalToPage>
                
                <PortalToPage pageRef={dockLayoutPageRef} actionBarTitle={"DockLayout"}>
                    <DockLayoutTest/>
                </PortalToPage>
                
                <PortalToPage pageRef={flexboxLayoutPageRef} actionBarTitle={"FlexboxLayout"}>
                    <FlexboxLayoutTest/>
                </PortalToPage>
            </RCTPage>
        );
    }
}

export const PortalToPageWithActionBar: React.SFC<
    { actionBarTitle: string } & PageComponentProps
> =
(props) => {
    const { innerRef, actionBarTitle, children, ...rest } = props;
    return ReactNativeScript.createPortal(
        (
            <RCTPage innerRef={innerRef} actionBarHidden={false} {...rest} >
                <RCTActionBar title={actionBarTitle} className={"action-bar"}/>
                {children}
            </RCTPage>
        ),
        innerRef.current,
        `Portal('${actionBarTitle}')`
    );
}

export class SimpleHub extends React.Component<{ innerRef: React.RefObject<Page> } & PageComponentProps, {}> {
    render(){
        const { innerRef, ...rest } = this.props;
        const bluePageRef = React.createRef<Page>();

        return (
            <RCTPage innerRef={innerRef} actionBarHidden={false} {...rest}>
                <RCTActionBar title="Navigation Hub" className="action-bar" />
                <RCTStackLayout>
                    <RCTButton
                        text={"Navigate to blue page"}
                        onPress={() => {
                            const currentPage: Page = innerRef.current!;
                            currentPage.frame.navigate({
                                create: () => {
                                    return bluePageRef.current;
                                }
                            });
                        }}
                    />
                </RCTStackLayout>
                
                <PortalToPageWithActionBar innerRef={bluePageRef} actionBarTitle={"Blue page"} backgroundColor={"blue"}>
                    <RCTLabel>You're viewing the blue page!</RCTLabel>
                </PortalToPageWithActionBar>
            </RCTPage>
        );
    }
}

