import * as React from "react";
import { PercentLength, FormattedString } from "tns-core-modules/ui/text-base/text-base";
import { Color } from "tns-core-modules/color";
import { Span } from "tns-core-modules/text/span";
import { ContentView, TextBase, ViewBase, StackLayout, Label, TabView, Page, ProxyViewContainer, Frame } from "react-nativescript/dist/client/ElementRegistry";
import { ViewProps, StylePropContents } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import {
    RCTButton,
    RCTFrame,
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
import { FrameComponentProps } from "react-nativescript/dist/components/Frame";
import { DockLayoutTest, FlexboxLayoutTest, AbsoluteLayoutTest } from "./layout";

export class NestedHub extends React.Component<{
    forwardedRef: React.RefObject<Page>;
} & PageComponentProps<Page>, {}> {
    render() {
        const { forwardedRef, ...rest } = this.props;
        const greenPageRef = React.createRef<Page>();
        const redPageRef = React.createRef<Page>();
        return (<RCTPage ref={forwardedRef} actionBarHidden={false} {...rest}>
            <RCTActionBar title="Hub" className="action-bar" />
            <RCTStackLayout>
                <RCTButton text={"Navigate to green page"} onTap={() => {
                    const currentPage: Page = forwardedRef.current!;
                    currentPage.frame.navigate({
                        create: () => {
                            return greenPageRef.current;
                        }
                    });
                }} />
            </RCTStackLayout>

            <PortalToPageWithActionBar forwardedRef={greenPageRef} actionBarTitle={"Green"} backgroundColor={"green"}>
                <RCTStackLayout>
                    <RCTLabel>You're viewing the green page!</RCTLabel>
                    <RCTButton text={"Navigate to red page"} onTap={() => {
                        const currentPage: Page = greenPageRef.current!;
                        currentPage.frame.navigate({
                            create: () => {
                                return redPageRef.current;
                            }
                        });
                    }} />
                </RCTStackLayout>

            </PortalToPageWithActionBar>

            <PortalToPageWithActionBar forwardedRef={redPageRef} actionBarTitle={"Red"} backgroundColor={"red"}>
                <RCTStackLayout>
                    <RCTLabel>You're viewing the red page!</RCTLabel>
                </RCTStackLayout>
            </PortalToPageWithActionBar>
        </RCTPage>);
    }
}
export class NestedModalTest extends React.Component<{
    forwardedRef: React.RefObject<Page>;
} & PageComponentProps<Page>, {}> {
    render() {
        const { forwardedRef, ...rest } = this.props;
        const yellowPageRef = React.createRef<Page>();
        const greenPageRef = React.createRef<Page>();
        return (<RCTPage ref={forwardedRef} actionBarHidden={false} {...rest}>
            <RCTActionBar title="Navigation Hub" className="action-bar" />
            <RCTStackLayout>
                <RCTButton text={"Open yellow modal"} onTap={() => {
                    const currentPage: Page = forwardedRef.current!;
                    currentPage.showModal(yellowPageRef.current!, {
                        context: {},
                        closeCallback: () => { },
                        animated: true,
                        stretched: false,
                    });
                }} />
            </RCTStackLayout>

            <PortalToPageWithActionBar forwardedRef={yellowPageRef} actionBarTitle={"Yellow page"} backgroundColor={"yellow"}>
                <RCTStackLayout>
                    <RCTLabel>You're viewing the yellow page!</RCTLabel>
                    <RCTButton text={"Open green modal"} onTap={() => {
                        const currentPage: Page = yellowPageRef.current!;
                        currentPage.showModal(greenPageRef.current!, {
                            context: {},
                            closeCallback: () => { },
                            animated: true,
                            stretched: false,
                        });
                    }} />
                    <RCTButton text={"Close yellow modal"} onTap={() => {
                        const currentPage: Page = yellowPageRef.current!;
                        currentPage.closeModal({});
                    }} />
                </RCTStackLayout>
            </PortalToPageWithActionBar>

            <PortalToPageWithActionBar forwardedRef={greenPageRef} actionBarTitle={"Green page"} backgroundColor={"green"}>
                <RCTStackLayout>
                    <RCTLabel>You're viewing the green page!</RCTLabel>
                    <RCTButton text={"Close green modal"} onTap={() => {
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
        forwardedRef: React.RefObject<Page>,
        actionBarTitle: string,
    },
    {}
> {
    render(){
        const { children, forwardedRef, actionBarTitle, ...rest } = this.props;

        return (
            <RCTPage ref={forwardedRef} actionBarHidden={false} {...rest} >
                <RCTActionBar title={actionBarTitle} className={"action-bar"}/>
                {children}
            </RCTPage>
        );
    }
}

const PortalToPage: React.SFC<{ forwardedRef: React.RefObject<Page>, actionBarTitle: string }> = (props) => {
    const { forwardedRef, actionBarTitle, children } = props;
    return ReactNativeScript.createPortal(
        (
            <PageWithActionBar forwardedRef={forwardedRef} actionBarTitle={actionBarTitle}>
                {children}
            </PageWithActionBar>
        ),
        forwardedRef.current,
        `Portal('${actionBarTitle}')`
    );
}

export class HubTest extends React.Component<{ forwardedRef: React.RefObject<Page> }, {}> {
    private readonly absoluteLayoutPageRef = React.createRef<Page>();
    private readonly dockLayoutPageRef = React.createRef<Page>();
    private readonly flexboxLayoutPageRef = React.createRef<Page>();

    render(){
        const { forwardedRef } = this.props;

        return (
            <RCTPage ref={forwardedRef} actionBarHidden={false}>
                <RCTActionBar title="Navigation Hub" className="action-bar" />
                <RCTStackLayout>
                    <RCTButton
                        text={"Navigate to AbsoluteLayout"}
                        onTap={() => {
                            const page: Page = forwardedRef.current!;
                            page.frame.navigate({
                                create: () => {
                                    console.log(`Navigating from ${forwardedRef.current} to AbsoluteLayout page. Ref:`, this.absoluteLayoutPageRef.current);
                                    return this.absoluteLayoutPageRef.current;
                                }
                            });
                        }}
                    />
                    <RCTButton
                        text={"Navigate to DockLayout"}
                        onTap={() => {
                            const page: Page = forwardedRef.current!;
                            page.frame.navigate({
                                create: () => {
                                    console.log(`Navigating from ${forwardedRef.current} to DockLayout page. Ref:`, this.dockLayoutPageRef.current);
                                    return this.dockLayoutPageRef.current;
                                }
                            });
                        }}
                    />
                    <RCTButton
                        text={"Navigate to FlexboxLayout"}
                        onTap={() => {
                            const page: Page = forwardedRef.current!;
                            page.frame.navigate({
                                create: () => {
                                    console.log(`Navigating from ${forwardedRef.current} to FlexboxLayout page. Ref:`, this.flexboxLayoutPageRef.current);
                                    return this.flexboxLayoutPageRef.current;
                                }
                            });
                        }}
                    />
                </RCTStackLayout>
                
                <PortalToPage forwardedRef={this.absoluteLayoutPageRef} actionBarTitle={"AbsoluteLayout"}>
                    <AbsoluteLayoutTest/>
                </PortalToPage>
                
                <PortalToPage forwardedRef={this.dockLayoutPageRef} actionBarTitle={"DockLayout"}>
                    <DockLayoutTest/>
                </PortalToPage>
                
                <PortalToPage forwardedRef={this.flexboxLayoutPageRef} actionBarTitle={"FlexboxLayout"}>
                    <FlexboxLayoutTest/>
                </PortalToPage>
            </RCTPage>
        );
    }
}

/**
 * MUST render the portal into a container (but only via a Host Config hack, as Pages can't have containers) or null.
 * 
 * Rendering into forwardedRef.current mysteriously works on the first render, but only because forwardedRef.current
 * is null at first. On second render (due to a state change of any component within), forwardedRef.current will become
 * populated and thus cause this to break (because it's not a container of the root component; it IS the root component).
 * 
 * ... So we render into null. This seems to work perfectly, but we'll probably have to add special-case handling in the
 * Host Config so that if the root component (Page) is ever unmounted, we don't call null.removeChild().
 *
 * The converse case of outerparent.removeChild(null) (when we unmount the Portal) might not need special handling,
 * because null is not regarded as a ReactNode to begin with.
 */
export const PortalToPageWithActionBar: React.SFC<
    { actionBarTitle: string } & PageComponentProps<Page>
> =
(props) => {
    const { forwardedRef, actionBarTitle, children, ...rest } = props;
    console.log(`[PortalToPageWithActionBar - "${actionBarTitle}"] createPortal() forwardedRef.current: ${forwardedRef.current}`);
    return ReactNativeScript.createPortal(
        (
            <RCTPage ref={forwardedRef} actionBarHidden={false} {...rest} >
                <RCTActionBar title={actionBarTitle} className={"action-bar"}/>
                {children}
            </RCTPage>
        ),
        null,
        `Portal('${actionBarTitle}')`
    );
}

/**
 * Above, we use a Stateless Functional Component. Here is the equivalent using a regular class component.
 * 
 * We may find that a class component is necessary to provide the lifecycle methods to clean up upon unmount 
 * (componentWillUnmount), but also... maybe not.
 * 
 * An explicit shouldComponentUpdate() is purely there to help me follow the logs. It's not needed otherwise.
 */
export class StatefulPortalToPageWithActionBar extends React.Component<
    { actionBarTitle: string } & PageComponentProps<Page>,
    {}
> {
    shouldComponentUpdate(
        nextProps: StatefulPortalToPageWithActionBar["props"],
        nextState: StatefulPortalToPageWithActionBar["state"]
    ): boolean {
        console.log(`[StatefulPortalToPageWithActionBar.shouldComponentUpdate]`);
        return true;
    }

    render(){
        const { forwardedRef, actionBarTitle, children, ...rest } = this.props;
        console.log(`[StatefulPortalToPageWithActionBar - "${actionBarTitle}"] createPortal() forwardedRef.current: ${forwardedRef.current}`);

        return ReactNativeScript.createPortal(
            (
                <RCTPage actionBarHidden={false} {...rest} ref={forwardedRef} >
                    <RCTActionBar title={actionBarTitle} className={"action-bar"}/>
                    {children}
                </RCTPage>
            ),
            null,
            `Portal('${actionBarTitle}')`
        );
    }
}

export class SimpleHub extends React.Component<{ forwardedRef: React.RefObject<Page> } & PageComponentProps<Page>, {}> {
    private readonly bluePageRef = React.createRef<Page>();
    render(){
        const { forwardedRef, ...rest } = this.props;

        return (
            <RCTPage ref={forwardedRef} actionBarHidden={false} {...rest}>
                <RCTActionBar title="Navigation Hub" className="action-bar" />
                <RCTStackLayout>
                    <RCTButton
                        text={"Navigate to blue page"}
                        onTap={() => {
                            const currentPage: Page = forwardedRef.current!;
                            currentPage.frame.navigate({
                                create: () => {
                                    return this.bluePageRef.current;
                                }
                            });
                        }}
                    />
                </RCTStackLayout>
                
                <PortalToPageWithActionBar forwardedRef={this.bluePageRef} actionBarTitle={"Blue page"} backgroundColor={"blue"}>
                    <RCTLabel>You're viewing the blue page!</RCTLabel>
                </PortalToPageWithActionBar>
            </RCTPage>
        );
    }
}

export class FrameTest extends React.Component<{ forwardedRef: React.RefObject<Frame> } & FrameComponentProps<Frame>, {}> {
    private readonly bluePageRef = React.createRef<Page>();

    componentDidMount(){
        const node: Frame|null = this.props.forwardedRef.current;
        if(node){
            node.navigate({
                create: () => {
                    return this.bluePageRef.current;
                }
            });
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    render(){
        const { forwardedRef, ...rest } = this.props;

        return (
            <RCTFrame ref={forwardedRef} {...rest}>
                <PortalToPageWithActionBar forwardedRef={this.bluePageRef} actionBarTitle={"Blue page"} backgroundColor={"blue"}>
                    <RCTLabel>You're viewing the blue page!</RCTLabel>
                </PortalToPageWithActionBar>
            </RCTFrame>
        );
    }
}