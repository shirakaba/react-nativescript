import * as React from "react";
import { PropsWithChildren } from "react";
import * as ReactNativeScript from "react-nativescript";
import { NSVElement, FrameAttributes, PageAttributes } from "react-nativescript";
import { Page, Frame, NavigationButton } from "@nativescript/core";
import { DockLayoutTest, FlexboxLayoutTest, AbsoluteLayoutTest } from "./layout";

export class NestedHub extends React.Component<
    {
        forwardedRef: React.RefObject<NSVElement<Page>>;
    } & PageAttributes,
    {}
> {
    render() {
        const { forwardedRef, ...rest } = this.props;
        const greenPageRef = React.createRef<NSVElement<Page>>();
        const redPageRef = React.createRef<NSVElement<Page>>();
        return (
            <page ref={forwardedRef} actionBarHidden={false} {...rest}>
                <actionBar title="Hub" className="action-bar" />
                <stackLayout>
                    <button
                        text={"Navigate to green page"}
                        onTap={() => {
                            const currentPage: Page = forwardedRef.current!.nativeView;
                            currentPage.frame.navigate({
                                create: () => {
                                    return greenPageRef.current.nativeView;
                                },
                            });
                        }}
                    />
                </stackLayout>

                <PortalToPageWithActionBar forwardedRef={greenPageRef} actionBarTitle={"Green"} backgroundColor={"green"}>
                    <stackLayout>
                        <label>You're viewing the green page!</label>
                        <button
                            text={"Navigate to red page"}
                            onTap={() => {
                                const currentPage: Page = greenPageRef.current!.nativeView;
                                currentPage.frame.navigate({
                                    create: () => {
                                        return redPageRef.current.nativeView;
                                    },
                                });
                            }}
                        />
                    </stackLayout>
                </PortalToPageWithActionBar>

                <PortalToPageWithActionBar forwardedRef={redPageRef} actionBarTitle={"Red"} backgroundColor={"red"}>
                    <stackLayout>
                        <label>You're viewing the red page!</label>
                    </stackLayout>
                </PortalToPageWithActionBar>
            </page>
        );
    }
}
export class NestedModalTest extends React.Component<
    {
        forwardedRef: React.RefObject<NSVElement<Page>>;
    } & PageAttributes,
    {}
> {
    render() {
        const { forwardedRef, ...rest } = this.props;
        const yellowPageRef = React.createRef<NSVElement<Page>>();
        const greenPageRef = React.createRef<NSVElement<Page>>();
        return (
            <page ref={forwardedRef} actionBarHidden={false} {...rest}>
                <actionBar title="Navigation Hub" className="action-bar" />
                <stackLayout>
                    <button
                        text={"Open yellow modal"}
                        onTap={() => {
                            const currentPage: Page = forwardedRef.current!.nativeView;
                            currentPage.showModal(yellowPageRef.current!.nativeView, {
                                context: {},
                                closeCallback: () => {},
                                animated: true,
                                stretched: false,
                            });
                        }}
                    />
                </stackLayout>

                <PortalToPageWithActionBar forwardedRef={yellowPageRef} actionBarTitle={"Yellow page"} backgroundColor={"yellow"}>
                    <stackLayout>
                        <label>You're viewing the yellow page!</label>
                        <button
                            text={"Open green modal"}
                            onTap={() => {
                                const currentPage: Page = yellowPageRef.current!.nativeView;
                                currentPage.showModal(greenPageRef.current!.nativeView, {
                                    context: {},
                                    closeCallback: () => {},
                                    animated: true,
                                    stretched: false,
                                });
                            }}
                        />
                        <button
                            text={"Close yellow modal"}
                            onTap={() => {
                                const currentPage: Page = yellowPageRef.current!.nativeView;
                                currentPage.closeModal({});
                            }}
                        />
                    </stackLayout>
                </PortalToPageWithActionBar>

                <PortalToPageWithActionBar forwardedRef={greenPageRef} actionBarTitle={"Green page"} backgroundColor={"green"}>
                    <stackLayout>
                        <label>You're viewing the green page!</label>
                        <button
                            text={"Close green modal"}
                            onTap={() => {
                                const currentPage: Page = greenPageRef.current!.nativeView;
                                currentPage.closeModal({});
                            }}
                        />
                    </stackLayout>
                </PortalToPageWithActionBar>
            </page>
        );
    }
}

export class ActionBarTest extends React.Component<{}, {}> {
    render() {
        const navigationButton = new NavigationButton();
        navigationButton.text = "Go Back";
        return React.createElement(
            "actionBar",
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
    render() {
        return React.createElement(
            "tabView",
            {
                selectedIndex: 1,
            },

            React.createElement(
                "tabViewItem",
                {
                    title: "Dock",
                },
                React.createElement(DockLayoutTest, {}, null)
            ),

            React.createElement(
                "tabViewItem",
                {
                    title: "Flexbox",
                },
                React.createElement(FlexboxLayoutTest, {}, null)
            )

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
    PropsWithChildren<
        {
            actionBarTitle?: string;
            forwardedRef: React.RefObject<NSVElement<Page>>;
        } & PageAttributes
    >,
    {}
> {
    render() {
        const { children, forwardedRef, actionBarTitle, ...rest } = this.props;

        return (
            <page ref={forwardedRef} actionBarHidden={false} {...rest}>
                <actionBar {...{ title: actionBarTitle }} />
                {children}
            </page>
        );
    }
}

export function FrameWithPageWithActionBarNew(props: PropsWithChildren<PageAttributes>) {
    const { children, ...rest } = props;

    return (
        // Page expected to be auto-mounted by the Frame in the new React NativeScript.
        <frame>
            <PageWithActionBarNew>
                <label>Hello Page</label>
            </PageWithActionBarNew>
        </frame>
    );
}

export function PageWithActionBarNew(props: PropsWithChildren<PageAttributes>) {
    const { children, ...rest } = props;

    return (
        <page actionBarHidden={false} {...rest}>
            <actionBar>
                <label nodeRole={"titleView"}>Hello Title View</label>

                <actionItem nodeRole={"actionItems"}>
                    <button nodeRole={"actionView"}>One</button>
                </actionItem>
                <actionItem nodeRole={"actionItems"}>
                    <button nodeRole={"actionView"}>Two</button>
                </actionItem>
                <actionItem nodeRole={"actionItems"}>
                    <button nodeRole={"actionView"}>Three</button>
                </actionItem>
            </actionBar>
            {children}
        </page>
    );
}

export class PageWithComplexActionBarTest extends React.Component<
    PropsWithChildren<{
        actionBarTitle?: string;
        forwardedRef: React.RefObject<NSVElement<Page>>;
    }>,
    {}
> {
    render() {
        const { children, forwardedRef, ...rest } = this.props;

        return (
            <page ref={forwardedRef} actionBarHidden={false} {...rest}>
                <actionBar>
                    {/* The Switch will become the titleView */}
                    <switch />
                    {/* The ActionItem will be added to the actionItems array */}
                    <actionItem text={"AI"} ios={{ position: "right" as const, systemIcon: 4 }}></actionItem>
                    {/* The NavigationButton will set as the NavigationButton (but won't be visible because there's no backwards navigation to do from here). */}
                    <navigationButton text={"NB"}></navigationButton>
                </actionBar>
                {children}
            </page>
        );
    }
}

export class FramedPageWithComplexActionBarTest extends React.Component<
    PropsWithChildren<{ forwardedRef: React.RefObject<NSVElement<Frame>> }>,
    {}
> {
    private readonly pageWithActionBarRef = React.createRef<NSVElement<Page>>();

    render() {
        const { forwardedRef, children, ...rest } = this.props;

        return (
            <FramedChildTest forwardedRef={forwardedRef} childPageRef={this.pageWithActionBarRef} {...rest}>
                <PageWithComplexActionBarTest forwardedRef={this.pageWithActionBarRef}>{children}</PageWithComplexActionBarTest>
            </FramedChildTest>
        );
    }
}

const PortalToPage: React.FC<
    PropsWithChildren<{
        forwardedRef: React.RefObject<NSVElement<Page>>;
        actionBarTitle: string;
    }>
> = (props) => {
    const { forwardedRef, actionBarTitle, children } = props;
    return ReactNativeScript.createPortal(
        <PageWithActionBar forwardedRef={forwardedRef} actionBarTitle={actionBarTitle}>
            {children}
        </PageWithActionBar>,
        null,
        `Portal('${actionBarTitle}')`
    );
};

export class HubTest extends React.Component<{ forwardedRef: React.RefObject<NSVElement<Page>> }, {}> {
    private readonly absoluteLayoutPageRef = React.createRef<NSVElement<Page>>();
    private readonly dockLayoutPageRef = React.createRef<NSVElement<Page>>();
    private readonly flexboxLayoutPageRef = React.createRef<NSVElement<Page>>();

    private navigateToPage(targetPage: Page, title: string) {
        const page: Page = this.props.forwardedRef.current!.nativeView;
        const frame: Frame | undefined = page.frame;
        if (!frame) {
            console.error(`No frame found for page ${page}. Ensure that HubTest is embedded in a Frame (e.g. via FramedHubTest).`);
            return;
        }
        frame.navigate({
            create: () => {
                console.log(`Navigating from ${page} to ${title} page. Ref:`, targetPage);
                return targetPage;
            },
        });
    }

    render() {
        const { forwardedRef } = this.props;

        return (
            <page ref={forwardedRef} actionBarHidden={false}>
                <actionBar title="Navigation Hub" className="action-bar" />
                <stackLayout>
                    <button
                        text={"Navigate to AbsoluteLayout"}
                        onTap={() => {
                            this.navigateToPage(this.absoluteLayoutPageRef.current!.nativeView, "AbsoluteLayout");
                        }}
                    />
                    <button
                        text={"Navigate to DockLayout"}
                        onTap={() => {
                            this.navigateToPage(this.dockLayoutPageRef.current!.nativeView, "DockLayout");
                        }}
                    />
                    <button
                        text={"Navigate to FlexboxLayout"}
                        onTap={() => {
                            this.navigateToPage(this.flexboxLayoutPageRef.current!.nativeView, "FlexboxLayout");
                        }}
                    />
                </stackLayout>

                <PortalToPage forwardedRef={this.absoluteLayoutPageRef} actionBarTitle={"AbsoluteLayout"}>
                    <AbsoluteLayoutTest />
                </PortalToPage>

                <PortalToPage forwardedRef={this.dockLayoutPageRef} actionBarTitle={"DockLayout"}>
                    <DockLayoutTest />
                </PortalToPage>

                <PortalToPage forwardedRef={this.flexboxLayoutPageRef} actionBarTitle={"FlexboxLayout"}>
                    <FlexboxLayoutTest />
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
export const PortalToPageWithActionBar: React.FC<
    PropsWithChildren<
        {
            forwardedRef: React.RefObject<NSVElement<Page>>;
            actionBarTitle: string;
        } & PageAttributes
    >
> = (props) => {
    const { forwardedRef, actionBarTitle, children, ...rest } = props;
    console.log(`[PortalToPageWithActionBar - "${actionBarTitle}"] createPortal() forwardedRef.current: ${forwardedRef.current}`);
    return ReactNativeScript.createPortal(
        <page ref={forwardedRef} actionBarHidden={false} {...rest}>
            <actionBar title={actionBarTitle} className={"action-bar"} />
            {children}
        </page>,
        null,
        `Portal('${actionBarTitle}')`
    );
};

/**
 * Above, we use a Stateless Functional Component. Here is the equivalent using a regular class component.
 *
 * We may find that a class component is necessary to provide the lifecycle methods to clean up upon unmount
 * (componentWillUnmount), but also... maybe not.
 *
 * An explicit shouldComponentUpdate() is purely there to help me follow the logs. It's not needed otherwise.
 */
export class StatefulPortalToPageWithActionBar extends React.Component<
    PropsWithChildren<{
        forwardedRef: React.RefObject<NSVElement<Page>>;
        actionBarTitle: string;
    }> &
        PageAttributes,
    {}
> {
    shouldComponentUpdate(
        nextProps: StatefulPortalToPageWithActionBar["props"],
        nextState: StatefulPortalToPageWithActionBar["state"]
    ): boolean {
        console.log(`[StatefulPortalToPageWithActionBar.shouldComponentUpdate]`);
        return true;
    }

    render() {
        const { forwardedRef, actionBarTitle, children, ...rest } = this.props;
        console.log(
            `[StatefulPortalToPageWithActionBar - "${actionBarTitle}"] createPortal() forwardedRef.current: ${forwardedRef.current}`
        );

        return ReactNativeScript.createPortal(
            <page actionBarHidden={false} {...rest} ref={forwardedRef}>
                <actionBar title={actionBarTitle} className={"action-bar"} />
                {children}
            </page>,
            null,
            `Portal('${actionBarTitle}')`
        );
    }
}

export class SimpleHub extends React.Component<{ forwardedRef: React.RefObject<NSVElement<Page>> } & PageAttributes, {}> {
    private readonly bluePageRef = React.createRef<NSVElement<Page>>();
    render() {
        const { forwardedRef, ...rest } = this.props;

        return (
            <page ref={forwardedRef} actionBarHidden={false} {...rest}>
                <actionBar title="Navigation Hub" className="action-bar" />
                <stackLayout>
                    <button
                        text={"Navigate to blue page"}
                        onTap={() => {
                            const currentPage: Page = forwardedRef.current!.nativeView;
                            currentPage.frame.navigate({
                                create: () => {
                                    return this.bluePageRef.current.nativeView;
                                },
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

export class FrameTest extends React.Component<{ forwardedRef: React.RefObject<NSVElement<Frame>> } & FrameAttributes, {}> {
    private readonly bluePageRef = React.createRef<NSVElement<Page>>();

    componentDidMount() {
        const node: Frame | null = this.props.forwardedRef.current.nativeView;
        if (node) {
            node.navigate({
                create: () => {
                    return this.bluePageRef.current.nativeView;
                },
            });
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    render() {
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
    PropsWithChildren<{
        forwardedRef: React.RefObject<NSVElement<Frame>>;
        childPageRef: React.RefObject<NSVElement<Page>>;
    }>,
    {}
> {
    componentDidMount() {
        const node: Frame | null = this.props.forwardedRef.current.nativeView;
        if (!node) {
            console.warn(`[FramedChildTest] React ref to NativeScript View lost, so unable to update event listeners.`);
            return;
        }

        console.log(`[FramedChildTest] componentDidMount; shall navigate to page within.`);
        node.navigate({
            create: () => {
                const childPage: Page | undefined = this.props.childPageRef.current!.nativeView;
                console.log(`[FramedChildTest] create(); shall return ref to page: ${childPage}`);
                return childPage;
            },
        });
    }

    componentWillUnmount() {
        console.log(`[FramedChildTest] componentWillUnmount`);
    }

    render() {
        return (
            <frame ref={this.props.forwardedRef}>
                {ReactNativeScript.createPortal(this.props.children, null, `Portal('FramedChild')`)}
            </frame>
        );
    }
}

export class FramedHubTest extends React.Component<PropsWithChildren<{ forwardedRef: React.RefObject<NSVElement<Frame>> }>, {}> {
    private readonly hubTestPageRef = React.createRef<NSVElement<Page>>();

    render() {
        const { forwardedRef, children, ...rest } = this.props;

        return (
            <FramedChildTest forwardedRef={forwardedRef} childPageRef={this.hubTestPageRef} {...rest}>
                <HubTest forwardedRef={this.hubTestPageRef} />
            </FramedChildTest>
        );
    }
}

export class FramedLayoutTest extends React.Component<{ forwardedRef: React.RefObject<NSVElement<Frame>> }, {}> {
    private readonly layoutTestPageRef = React.createRef<NSVElement<Page>>();

    componentDidMount() {
        const node: Frame | null = this.props.forwardedRef.current.nativeView;
        if (node) {
            node.navigate({
                create: () => {
                    return this.layoutTestPageRef.current.nativeView;
                },
            });
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    render() {
        return (
            <frame ref={this.props.forwardedRef}>
                {ReactNativeScript.createPortal(
                    <contentView ref={this.layoutTestPageRef}>
                        <DockLayoutTest />
                    </contentView>,
                    null,
                    `Portal('Dock Layout Test')`
                )}
            </frame>
        );
    }
}
