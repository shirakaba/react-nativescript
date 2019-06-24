import * as React from "react";
import { PercentLength, FormattedString } from "tns-core-modules/ui/text-base/text-base";
import { Color } from "tns-core-modules/color";
import { Span } from "tns-core-modules/text/span";
import { ContentView, TextBase, ViewBase, StackLayout, Label, TabView, Page, ProxyViewContainer, Frame } from "react-nativescript/dist/client/ElementRegistry";
import { ViewProps, StylePropContents } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { NavigationButton } from "tns-core-modules/ui/action-bar/action-bar";
import {
    $Button,
    $Frame,
    $ContentView,
    $TextView,
    $Label,
    // StylePropContents,
    $DockLayout,
    $AbsoluteLayout,
    $StackLayout,
    $FlexboxLayout,
    $ListView,
    $ActionBar,
    $TabView,
    $TabViewItem,
    $Page,
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
        return (<$Page ref={forwardedRef} actionBarHidden={false} {...rest}>
            <$ActionBar title="Hub" className="action-bar" />
            <$StackLayout>
                <$Button text={"Navigate to green page"} onTap={() => {
                    const currentPage: Page = forwardedRef.current!;
                    currentPage.frame.navigate({
                        create: () => {
                            return greenPageRef.current;
                        }
                    });
                }} />
            </$StackLayout>

            <PortalToPageWithActionBar forwardedRef={greenPageRef} actionBarTitle={"Green"} backgroundColor={"green"}>
                <$StackLayout>
                    <$Label>You're viewing the green page!</$Label>
                    <$Button text={"Navigate to red page"} onTap={() => {
                        const currentPage: Page = greenPageRef.current!;
                        currentPage.frame.navigate({
                            create: () => {
                                return redPageRef.current;
                            }
                        });
                    }} />
                </$StackLayout>

            </PortalToPageWithActionBar>

            <PortalToPageWithActionBar forwardedRef={redPageRef} actionBarTitle={"Red"} backgroundColor={"red"}>
                <$StackLayout>
                    <$Label>You're viewing the red page!</$Label>
                </$StackLayout>
            </PortalToPageWithActionBar>
        </$Page>);
    }
}
export class NestedModalTest extends React.Component<{
    forwardedRef: React.RefObject<Page>;
} & PageComponentProps<Page>, {}> {
    render() {
        const { forwardedRef, ...rest } = this.props;
        const yellowPageRef = React.createRef<Page>();
        const greenPageRef = React.createRef<Page>();
        return (<$Page ref={forwardedRef} actionBarHidden={false} {...rest}>
            <$ActionBar title="Navigation Hub" className="action-bar" />
            <$StackLayout>
                <$Button text={"Open yellow modal"} onTap={() => {
                    const currentPage: Page = forwardedRef.current!;
                    currentPage.showModal(yellowPageRef.current!, {
                        context: {},
                        closeCallback: () => { },
                        animated: true,
                        stretched: false,
                    });
                }} />
            </$StackLayout>

            <PortalToPageWithActionBar forwardedRef={yellowPageRef} actionBarTitle={"Yellow page"} backgroundColor={"yellow"}>
                <$StackLayout>
                    <$Label>You're viewing the yellow page!</$Label>
                    <$Button text={"Open green modal"} onTap={() => {
                        const currentPage: Page = yellowPageRef.current!;
                        currentPage.showModal(greenPageRef.current!, {
                            context: {},
                            closeCallback: () => { },
                            animated: true,
                            stretched: false,
                        });
                    }} />
                    <$Button text={"Close yellow modal"} onTap={() => {
                        const currentPage: Page = yellowPageRef.current!;
                        currentPage.closeModal({});
                    }} />
                </$StackLayout>
            </PortalToPageWithActionBar>

            <PortalToPageWithActionBar forwardedRef={greenPageRef} actionBarTitle={"Green page"} backgroundColor={"green"}>
                <$StackLayout>
                    <$Label>You're viewing the green page!</$Label>
                    <$Button text={"Close green modal"} onTap={() => {
                        const currentPage: Page = greenPageRef.current!;
                        currentPage.closeModal({});
                    }} />
                </$StackLayout>
            </PortalToPageWithActionBar>
        </$Page>);
    }
}


export class ActionBarTest extends React.Component<{}, {}> {
    render(){
        const navigationButton = new NavigationButton();
        navigationButton.text = "Go Back";
        return React.createElement(
            $ActionBar,
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
            $TabView,
            {
                selectedIndex: 1
            },

            React.createElement(
                $TabViewItem,
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
                $TabViewItem,
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
            <$Page ref={forwardedRef} actionBarHidden={false} {...rest} >
                <$ActionBar title={actionBarTitle} className={"action-bar"}/>
                {children}
            </$Page>
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
        null,
        `Portal('${actionBarTitle}')`
    );
}

export class HubTest extends React.Component<{ forwardedRef: React.RefObject<Page> }, {}> {
    private readonly absoluteLayoutPageRef = React.createRef<Page>();
    private readonly dockLayoutPageRef = React.createRef<Page>();
    private readonly flexboxLayoutPageRef = React.createRef<Page>();

    private navigateToPage(targetPage: Page, title: string){
        const page: Page = this.props.forwardedRef.current!;
        const frame: Frame|undefined = page.frame;
        if(!frame){
            console.error(`No frame found for page ${page}. Ensure that HubTest is embedded in a Frame (e.g. via FramedHubTest).`);
            return;
        }
        frame.navigate({
            create: () => {
                console.log(`Navigating from ${page} to ${title} page. Ref:`, targetPage);
                return targetPage;
            }
        });
    }

    render(){
        const { forwardedRef } = this.props;

        return (
            <$Page ref={forwardedRef} actionBarHidden={false}>
                <$ActionBar title="Navigation Hub" className="action-bar" />
                <$StackLayout>
                    <$Button
                        text={"Navigate to AbsoluteLayout"}
                        onTap={() => {
                            this.navigateToPage(this.absoluteLayoutPageRef.current, "AbsoluteLayout");
                        }}
                    />
                    <$Button
                        text={"Navigate to DockLayout"}
                        onTap={() => {
                            this.navigateToPage(this.dockLayoutPageRef.current, "DockLayout");
                        }}
                    />
                    <$Button
                        text={"Navigate to FlexboxLayout"}
                        onTap={() => {
                            this.navigateToPage(this.flexboxLayoutPageRef.current, "FlexboxLayout");
                        }}
                    />
                </$StackLayout>
                
                <PortalToPage forwardedRef={this.absoluteLayoutPageRef} actionBarTitle={"AbsoluteLayout"}>
                    <AbsoluteLayoutTest/>
                </PortalToPage>
                
                <PortalToPage forwardedRef={this.dockLayoutPageRef} actionBarTitle={"DockLayout"}>
                    <DockLayoutTest/>
                </PortalToPage>
                
                <PortalToPage forwardedRef={this.flexboxLayoutPageRef} actionBarTitle={"FlexboxLayout"}>
                    <FlexboxLayoutTest/>
                </PortalToPage>
            </$Page>
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
            <$Page ref={forwardedRef} actionBarHidden={false} {...rest} >
                <$ActionBar title={actionBarTitle} className={"action-bar"}/>
                {children}
            </$Page>
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
                <$Page actionBarHidden={false} {...rest} ref={forwardedRef} >
                    <$ActionBar title={actionBarTitle} className={"action-bar"}/>
                    {children}
                </$Page>
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
            <$Page ref={forwardedRef} actionBarHidden={false} {...rest}>
                <$ActionBar title="Navigation Hub" className="action-bar" />
                <$StackLayout>
                    <$Button
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
                </$StackLayout>
                
                <PortalToPageWithActionBar forwardedRef={this.bluePageRef} actionBarTitle={"Blue page"} backgroundColor={"blue"}>
                    <$Label>You're viewing the blue page!</$Label>
                </PortalToPageWithActionBar>
            </$Page>
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
            <$Frame ref={forwardedRef} {...rest}>
                <PortalToPageWithActionBar forwardedRef={this.bluePageRef} actionBarTitle={"Blue page"} backgroundColor={"blue"}>
                    <$Label>You're viewing the blue page!</$Label>
                </PortalToPageWithActionBar>
            </$Frame>
        );
    }
}

export class FramedHubTest extends React.Component<{ forwardedRef: React.RefObject<Frame> }, {}> {
    private readonly hubTestPageRef = React.createRef<Page>();

    componentDidMount(){
        const node: Frame|null = this.props.forwardedRef.current;
        if(node){
            console.log(`[FramedHubTest] componentDidMount; shall navigate to page within.`);
            node.navigate({
                create: () => {
                    const hubTestPage: Page|undefined = this.hubTestPageRef.current
                    console.log(`[FramedHubTest] create(); shall return ref to page: ${hubTestPage}`);
                    return hubTestPage;
                }
            });
        } else {
            console.warn(`[FramedHubTest] React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    componentWillUnmount(){
        console.log(`[FramedHubTest] componentWillUnmount`);
    }

    render(){
        return (
            <$Frame ref={this.props.forwardedRef}>
                {(
                    ReactNativeScript.createPortal(
                        (
                            <HubTest forwardedRef={this.hubTestPageRef}/>
                        ),
                        null,
                        `Portal('Navigation Hub')`
                    )
                )}
            </$Frame>
        );
    }
}

export class FramedLayoutTest extends React.Component<{ forwardedRef: React.RefObject<Frame> }, {}> {
    private readonly layoutTestPageRef = React.createRef<Page>();

    componentDidMount(){
        const node: Frame|null = this.props.forwardedRef.current;
        if(node){
            node.navigate({
                create: () => {
                    return this.layoutTestPageRef.current;
                }
            });
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    render(){
        return (
            <$Frame ref={this.props.forwardedRef}>
                {(
                    ReactNativeScript.createPortal(
                        (
                            <$ContentView ref={this.layoutTestPageRef}>
                                <DockLayoutTest/>
                            </$ContentView>
                        ),
                        null,
                        `Portal('Dock Layout Test')`
                    )
                )}
            </$Frame>
        );
    }
}
