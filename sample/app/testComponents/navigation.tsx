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
    $Switch,
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
    $NavigationButton,
    $ActionItem,
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
        return (<page ref={forwardedRef} actionBarHidden={false} {...rest}>
            <actionBar title="Hub" className="action-bar" />
            <stackLayout>
                <button text={"Navigate to green page"} onTap={() => {
                    const currentPage: Page = forwardedRef.current!;
                    currentPage.frame.navigate({
                        create: () => {
                            return greenPageRef.current;
                        }
                    });
                }} />
            </stackLayout>

            <PortalToPageWithActionBar forwardedRef={greenPageRef} actionBarTitle={"Green"} backgroundColor={"green"}>
                <stackLayout>
                    <label>You're viewing the green page!</label>
                    <button text={"Navigate to red page"} onTap={() => {
                        const currentPage: Page = greenPageRef.current!;
                        currentPage.frame.navigate({
                            create: () => {
                                return redPageRef.current;
                            }
                        });
                    }} />
                </stackLayout>

            </PortalToPageWithActionBar>

            <PortalToPageWithActionBar forwardedRef={redPageRef} actionBarTitle={"Red"} backgroundColor={"red"}>
                <stackLayout>
                    <label>You're viewing the red page!</label>
                </stackLayout>
            </PortalToPageWithActionBar>
        </page>);
    }
}
export class NestedModalTest extends React.Component<{
    forwardedRef: React.RefObject<Page>;
} & PageComponentProps<Page>, {}> {
    render() {
        const { forwardedRef, ...rest } = this.props;
        const yellowPageRef = React.createRef<Page>();
        const greenPageRef = React.createRef<Page>();
        return (<page ref={forwardedRef} actionBarHidden={false} {...rest}>
            <actionBar title="Navigation Hub" className="action-bar" />
            <stackLayout>
                <button text={"Open yellow modal"} onTap={() => {
                    const currentPage: Page = forwardedRef.current!;
                    currentPage.showModal(yellowPageRef.current!, {
                        context: {},
                        closeCallback: () => { },
                        animated: true,
                        stretched: false,
                    });
                }} />
            </stackLayout>

            <PortalToPageWithActionBar forwardedRef={yellowPageRef} actionBarTitle={"Yellow page"} backgroundColor={"yellow"}>
                <stackLayout>
                    <label>You're viewing the yellow page!</label>
                    <button text={"Open green modal"} onTap={() => {
                        const currentPage: Page = yellowPageRef.current!;
                        currentPage.showModal(greenPageRef.current!, {
                            context: {},
                            closeCallback: () => { },
                            animated: true,
                            stretched: false,
                        });
                    }} />
                    <button text={"Close yellow modal"} onTap={() => {
                        const currentPage: Page = yellowPageRef.current!;
                        currentPage.closeModal({});
                    }} />
                </stackLayout>
            </PortalToPageWithActionBar>

            <PortalToPageWithActionBar forwardedRef={greenPageRef} actionBarTitle={"Green page"} backgroundColor={"green"}>
                <stackLayout>
                    <label>You're viewing the green page!</label>
                    <button text={"Close green modal"} onTap={() => {
                        const currentPage: Page = greenPageRef.current!;
                        currentPage.closeModal({});
                    }} />
                </stackLayout>
            </PortalToPageWithActionBar>
        </page>);
    }
}


export class ActionBarTest extends React.Component<{}, {}> {
    render(){
        const navigationButton = new NavigationButton();
        navigationButton.text = "Go Back";
        return React.createElement(
            "actionbar",
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
            "tabview",
            {
                selectedIndex: 1
            },

            React.createElement(
                "tabviewitem",
                {
                    title: "Dock",
                },
                React.createElement(
                    DockLayoutTest,
                    {},
                    null
                )
            ),

            React.createElement(
                "tabviewitem",
                {
                    title: "Flexbox",
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
        actionBarTitle?: string,
        forwardedRef: React.RefObject<Page>,
    } & PageComponentProps<Page>,
    {}
> {
    render(){
        const { children, forwardedRef, actionBarTitle, ...rest } = this.props;

        return (
            <page ref={forwardedRef} actionBarHidden={false} {...rest} >
                <actionBar {...{ title: actionBarTitle }} />
                {children}
            </page>
        );
    }
}

export class PageWithComplexActionBarTest extends React.Component<
    {
        actionBarTitle?: string,
        forwardedRef: React.RefObject<Page>,
    },
    {}
> {
    render(){
        const { children, forwardedRef, ...rest } = this.props;

        return (
            <page ref={forwardedRef} actionBarHidden={false} {...rest} >
                <actionBar>
                    {/* The Switch will become the titleView */}
                    <switch/>
                    {/* The ActionItem will be added to the actionItems array */}
                    <actionItem text={"AI"} ios={{ position: "right", systemIcon: 4 }}></actionItem>
                    {/* The NavigationButton will set as the NavigationButton (but won't be visible because there's no backwards navigation to do from here). */}
                    <navigationButton text={"NB"}></navigationButton>
                </actionBar>
                {children}
            </page>
        );
    }
}

export class FramedPageWithComplexActionBarTest extends React.Component<{ forwardedRef: React.RefObject<Frame> }, {}> {
    private readonly pageWithActionBarRef = React.createRef<Page>();

    render(){
        const { forwardedRef, children, ...rest } = this.props;

        return (
            <FramedChildTest forwardedRef={forwardedRef} childPageRef={this.pageWithActionBarRef} {...rest} >
                <PageWithComplexActionBarTest forwardedRef={this.pageWithActionBarRef}>
                    {children}
                </PageWithComplexActionBarTest>
            </FramedChildTest>
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
            <page ref={forwardedRef} actionBarHidden={false}>
                <actionBar title="Navigation Hub" className="action-bar" />
                <stackLayout>
                    <button
                        text={"Navigate to AbsoluteLayout"}
                        onTap={() => {
                            this.navigateToPage(this.absoluteLayoutPageRef.current, "AbsoluteLayout");
                        }}
                    />
                    <button
                        text={"Navigate to DockLayout"}
                        onTap={() => {
                            this.navigateToPage(this.dockLayoutPageRef.current, "DockLayout");
                        }}
                    />
                    <button
                        text={"Navigate to FlexboxLayout"}
                        onTap={() => {
                            this.navigateToPage(this.flexboxLayoutPageRef.current, "FlexboxLayout");
                        }}
                    />
                </stackLayout>
                
                <PortalToPage forwardedRef={this.absoluteLayoutPageRef} actionBarTitle={"AbsoluteLayout"}>
                    <AbsoluteLayoutTest/>
                </PortalToPage>
                
                <PortalToPage forwardedRef={this.dockLayoutPageRef} actionBarTitle={"DockLayout"}>
                    <DockLayoutTest/>
                </PortalToPage>
                
                <PortalToPage forwardedRef={this.flexboxLayoutPageRef} actionBarTitle={"FlexboxLayout"}>
                    <FlexboxLayoutTest/>
                </PortalToPage>
            </page>
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
            <page ref={forwardedRef} actionBarHidden={false} {...rest} >
                <actionBar title={actionBarTitle} className={"action-bar"}/>
                {children}
            </page>
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
                <page actionBarHidden={false} {...rest} ref={forwardedRef} >
                    <actionBar title={actionBarTitle} className={"action-bar"}/>
                    {children}
                </page>
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
            <page ref={forwardedRef} actionBarHidden={false} {...rest}>
                <actionBar title="Navigation Hub" className="action-bar" />
                <stackLayout>
                    <button
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
                </stackLayout>
                
                <PortalToPageWithActionBar forwardedRef={this.bluePageRef} actionBarTitle={"Blue page"} backgroundColor={"blue"}>
                    <label>You're viewing the blue page!</label>
                </PortalToPageWithActionBar>
            </page>
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
            <frame ref={forwardedRef} {...rest}>
                <PortalToPageWithActionBar forwardedRef={this.bluePageRef} actionBarTitle={"Blue page"} backgroundColor={"blue"}>
                    <label>You're viewing the blue page!</label>
                </PortalToPageWithActionBar>
            </frame>
        );
    }
}

export class FramedChildTest extends React.Component<
    {
        forwardedRef: React.RefObject<Frame>,
        childPageRef: React.RefObject<Page>,
    },
    {}
>
{
    componentDidMount(){
        const node: Frame|null = this.props.forwardedRef.current;
        if(!node){
            console.warn(`[FramedChildTest] React ref to NativeScript View lost, so unable to update event listeners.`);
            return;
        }

        console.log(`[FramedChildTest] componentDidMount; shall navigate to page within.`);
        node.navigate({
            create: () => {
                const childPage: Page|undefined = this.props.childPageRef.current
                console.log(`[FramedChildTest] create(); shall return ref to page: ${childPage}`);
                return childPage;
            }
        });
    }

    componentWillUnmount(){
        console.log(`[FramedChildTest] componentWillUnmount`);
    }

    render(){
        return (
            <frame ref={this.props.forwardedRef}>
                {(
                    ReactNativeScript.createPortal(
                        (
                            this.props.children
                        ),
                        null,
                        `Portal('FramedChild')`
                    )
                )}
            </frame>
        );
    }
}

export class FramedHubTest extends React.Component<{ forwardedRef: React.RefObject<Frame> }, {}> {
    private readonly hubTestPageRef = React.createRef<Page>();

    render(){
        const { forwardedRef, children, ...rest } = this.props;

        return (
            <FramedChildTest forwardedRef={forwardedRef} childPageRef={this.hubTestPageRef} {...rest} >
                <HubTest forwardedRef={this.hubTestPageRef}/>
            </FramedChildTest>
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
            <frame ref={this.props.forwardedRef}>
                {(
                    ReactNativeScript.createPortal(
                        (
                            <contentView ref={this.layoutTestPageRef}>
                                <DockLayoutTest/>
                            </contentView>
                        ),
                        null,
                        `Portal('Dock Layout Test')`
                    )
                )}
            </frame>
        );
    }
}
