import * as React from "react";
import { PercentLength, FormattedString } from "tns-core-modules/ui/text-base/text-base";
import { Color } from "tns-core-modules/color";
import { Span } from "tns-core-modules/text/span";
import { ContentView, TextBase, ViewBase, StackLayout, Label, TabView, Page, ProxyViewContainer } from "react-nativescript/dist/client/ElementRegistry";
import { ViewProps, StylePropContents } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import {
    Button as ReactButton,
    ContentView as ReactContentView,
    TextView as ReactTextView,
    Label as ReactLabel,
    // StylePropContents,
    DockLayout as ReactDockLayout,
    AbsoluteLayout as ReactAbsoluteLayout,
    StackLayout as ReactStackLayout,
    FlexboxLayout as ReactFlexboxLayout,
    ListView as ReactListView,
    ActionBar as ReactActionBar,
    TabView as ReactTabView,
    TabViewItem as ReactTabViewItem,
    Page as ReactPage,
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
        return (<ReactPage innerRef={innerRef} actionBarHidden={false} {...rest}>
            <ReactActionBar title="Hub" className="action-bar" />
            <ReactStackLayout>
                <ReactButton text={"Navigate to green page"} onPress={() => {
                    const currentPage: Page = innerRef.current!;
                    currentPage.frame.navigate({
                        create: () => {
                            return greenPageRef.current;
                        }
                    });
                }} />
            </ReactStackLayout>

            <PortalToPageWithActionBar innerRef={greenPageRef} actionBarTitle={"Green"} backgroundColor={"green"}>
                <ReactStackLayout>
                    <ReactLabel>You're viewing the green page!</ReactLabel>
                    <ReactButton text={"Navigate to red page"} onPress={() => {
                        const currentPage: Page = greenPageRef.current!;
                        currentPage.frame.navigate({
                            create: () => {
                                return redPageRef.current;
                            }
                        });
                    }} />
                </ReactStackLayout>

            </PortalToPageWithActionBar>

            <PortalToPageWithActionBar innerRef={redPageRef} actionBarTitle={"Red"} backgroundColor={"red"}>
                <ReactStackLayout>
                    <ReactLabel>You're viewing the red page!</ReactLabel>
                </ReactStackLayout>
            </PortalToPageWithActionBar>
        </ReactPage>);
    }
}
export class NestedModalTest extends React.Component<{
    innerRef: React.RefObject<Page>;
} & PageComponentProps, {}> {
    render() {
        const { innerRef, ...rest } = this.props;
        const yellowPageRef = React.createRef<Page>();
        const greenPageRef = React.createRef<Page>();
        return (<ReactPage innerRef={innerRef} actionBarHidden={false} {...rest}>
            <ReactActionBar title="Navigation Hub" className="action-bar" />
            <ReactStackLayout>
                <ReactButton text={"Open yellow modal"} onPress={() => {
                    const currentPage: Page = innerRef.current!;
                    currentPage.showModal(yellowPageRef.current!, {
                        context: {},
                        closeCallback: () => { },
                        animated: true,
                        stretched: false,
                    });
                }} />
            </ReactStackLayout>

            <PortalToPageWithActionBar innerRef={yellowPageRef} actionBarTitle={"Yellow page"} backgroundColor={"yellow"}>
                <ReactStackLayout>
                    <ReactLabel>You're viewing the yellow page!</ReactLabel>
                    <ReactButton text={"Open green modal"} onPress={() => {
                        const currentPage: Page = yellowPageRef.current!;
                        currentPage.showModal(greenPageRef.current!, {
                            context: {},
                            closeCallback: () => { },
                            animated: true,
                            stretched: false,
                        });
                    }} />
                    <ReactButton text={"Close yellow modal"} onPress={() => {
                        const currentPage: Page = yellowPageRef.current!;
                        currentPage.closeModal({});
                    }} />
                </ReactStackLayout>
            </PortalToPageWithActionBar>

            <PortalToPageWithActionBar innerRef={greenPageRef} actionBarTitle={"Green page"} backgroundColor={"green"}>
                <ReactStackLayout>
                    <ReactLabel>You're viewing the green page!</ReactLabel>
                    <ReactButton text={"Close green modal"} onPress={() => {
                        const currentPage: Page = greenPageRef.current!;
                        currentPage.closeModal({});
                    }} />
                </ReactStackLayout>
            </PortalToPageWithActionBar>
        </ReactPage>);
    }
}


export class ActionBarTest extends React.Component<{}, {}> {
    render(){
        const navigationButton = new NavigationButton();
        navigationButton.text = "Go Back";
        return React.createElement(
            ReactActionBar,
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
            ReactTabView,
            {
                selectedIndex: 1
            },

            React.createElement(
                ReactTabViewItem,
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
                ReactTabViewItem,
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
            <ReactPage innerRef={innerRef} actionBarHidden={false} {...rest} >
                <ReactActionBar title={actionBarTitle} className={"action-bar"}>
                    {children}
                </ReactActionBar>
            </ReactPage>
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
            <ReactPage innerRef={innerRef} actionBarHidden={false}>
                <ReactActionBar title="Navigation Hub" className="action-bar" />
                <ReactStackLayout>
                    <ReactButton
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
                    <ReactButton
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
                    <ReactButton
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
                </ReactStackLayout>
                
                <PortalToPage pageRef={absoluteLayoutPageRef} actionBarTitle={"AbsoluteLayout"}>
                    <AbsoluteLayoutTest/>
                </PortalToPage>
                
                <PortalToPage pageRef={dockLayoutPageRef} actionBarTitle={"DockLayout"}>
                    <DockLayoutTest/>
                </PortalToPage>
                
                <PortalToPage pageRef={flexboxLayoutPageRef} actionBarTitle={"FlexboxLayout"}>
                    <FlexboxLayoutTest/>
                </PortalToPage>
            </ReactPage>
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
            <ReactPage innerRef={innerRef} actionBarHidden={false} {...rest} >
                <ReactActionBar title={actionBarTitle} className={"action-bar"}/>
                {children}
            </ReactPage>
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
            <ReactPage innerRef={innerRef} actionBarHidden={false} {...rest}>
                <ReactActionBar title="Navigation Hub" className="action-bar" />
                <ReactStackLayout>
                    <ReactButton
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
                </ReactStackLayout>
                
                <PortalToPageWithActionBar innerRef={bluePageRef} actionBarTitle={"Blue page"} backgroundColor={"blue"}>
                    <ReactLabel>You're viewing the blue page!</ReactLabel>
                </PortalToPageWithActionBar>
            </ReactPage>
        );
    }
}

