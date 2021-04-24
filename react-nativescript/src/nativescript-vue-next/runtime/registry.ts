import {
    View as TNSView,
    Frame as TNSFrame,
    Page as TNSPage,
    ViewBase as TNSViewBase,
    FormattedString as TNSFormattedString,
    Span as TNSSpan,
    ActionBar as TNSActionBar,
    ActionItem as TNSActionItem,
    NavigationButton as TNSNavigationButton,
    TabView as TNSTabView,
    TabViewItem as TNSTabViewItem,
    Label as TNSLabel,
    Image as TNSImage,
    NavigationContext as TNSNavigationContext,
    NavigationEntry as TNSNavigationEntry,
    BackstackEntry as TNSBackstackEntry,
} from '@nativescript/core';
import { NSVElement, NSVViewFlags } from './nodes'
import { __unstable__forwardNavOpts } from "./navigation";
import { RNSNavigationOptions } from "./navigation";
// import { actionBarNodeOps } from './components/ActionBar'
// import { warn } from '@vue/runtime-core'
import { warn } from "../../shared/Logger";

export type NSVElementResolver = () => TNSViewBase

export type NSVModelDescriptor = {
    prop: string
    event: string
}

export interface NSVViewMeta {
    viewFlags: NSVViewFlags
    stackDepth?: number;
    nodeOps?: {
        insert(child: NSVElement, parent: NSVElement, atIndex?: number): void
        remove(child: NSVElement, parent: NSVElement): void
    }
    model?: NSVModelDescriptor
    overwriteExisting?: boolean
}

export interface NSVElementDescriptor {
    meta: NSVViewMeta
    resolver?: NSVElementResolver
}

export let defaultViewMeta: NSVViewMeta = {
    viewFlags: NSVViewFlags.NONE,
}

let elementMap: Record<string, NSVElementDescriptor> = {}

export function getViewMeta(elementName: string): NSVViewMeta {
    // console.log(`->getViewMeta(${elementName})`)

    const normalizedName = normalizeElementName(elementName)

    const entry = elementMap[normalizedName]

    if (!entry) {
        throw new Error(`No known component for element ${elementName}.`)
    }

    return entry.meta
}

export function getViewClass(elementName: string): any {
    // console.log(`->getViewClass(${elementName})`)
    const normalizedName = normalizeElementName(elementName)
    const entry = elementMap[normalizedName]

    if (!entry) {
        throw new Error(`No known component for element ${elementName}.`)
    }

    try {
        return entry.resolver!()
    } catch (e) {
        throw new Error(`Could not load view for: ${elementName}. ${e}`)
    }
}

export function normalizeElementName(elementName: string): string {
    return elementName.replace(/-/g, '').toLowerCase()
}

export function registerElement(
    elementName: string,
    resolver?: NSVElementResolver,
    meta?: Partial<NSVViewMeta>
) {
    const normalizedName = normalizeElementName(elementName)
    const mergedMeta = Object.assign({}, defaultViewMeta, meta)

    if (elementMap[normalizedName] && !mergedMeta.overwriteExisting) {
        throw new Error(
            `Element for ${elementName} already registered.\n` +
                `If this is intentional set 'overwriteExisting: true' in 'meta'`
        )
    }

    elementMap[normalizedName] = {
        meta: mergedMeta,
        resolver,
    }
    // console.log(`->registerElement(${elementName})`)
}

export function isKnownView(elementName: string): boolean {
    return elementMap.hasOwnProperty(normalizeElementName(elementName))
}

type TNSFramePrivate = {
    _navigationQueue: TNSNavigationContext[],
    _backStack: TNSBackstackEntry[], // backStack just returns a copy.
    _currentEntry: TNSBackstackEntry|undefined,
    isCurrent: (entry: TNSBackstackEntry) => boolean,
    _removeEntry: (entry: TNSBackstackEntry) => void,
};

// register built in elements
// prettier-ignore
if (!__TEST__) {
    // layouts
    registerElement(
        'absoluteLayout',
        () => require('@nativescript/core').AbsoluteLayout,
        { viewFlags: NSVViewFlags.LAYOUT_VIEW }
    )
    registerElement(
        'dockLayout',
        () => require('@nativescript/core').DockLayout,
        { viewFlags: NSVViewFlags.LAYOUT_VIEW }
    )
    registerElement(
        'flexboxLayout',
        () => require('@nativescript/core').FlexboxLayout,
        { viewFlags: NSVViewFlags.LAYOUT_VIEW }
    )
    registerElement(
        'gridLayout',
        () => require('@nativescript/core').GridLayout,
        { viewFlags: NSVViewFlags.LAYOUT_VIEW }
    )
    registerElement(
        'stackLayout',
        () => require('@nativescript/core').StackLayout,
        { viewFlags: NSVViewFlags.LAYOUT_VIEW }
    )
    registerElement(
        'wrapLayout',
        () => require('@nativescript/core').WrapLayout,
        { viewFlags: NSVViewFlags.LAYOUT_VIEW }
    )

    // ContentViews
    registerElement(
        'contentView',
        () => require('@nativescript/core').ContentView,
        { viewFlags: NSVViewFlags.CONTENT_VIEW }
    )
    registerElement(
        'scrollView',
        () => require('@nativescript/core').ScrollView,
        { viewFlags: NSVViewFlags.CONTENT_VIEW }
    )

    registerElement(
        'actionBar',
        () => require('@nativescript/core').ActionBar,
        {
            nodeOps: {
                insert(child: NSVElement, parent: NSVElement<TNSActionBar>, atIndex?: number): void {
                    const actionBar = parent.nativeView;

                    if(child.nodeRole === "navigationButton"){
                        if(child.nativeView instanceof TNSNavigationButton){
                            actionBar.navigationButton = child.nativeView;
                        } else {
                            if (__DEV__) {
                                warn(
                                    `Unable to add child "${child.nativeView.constructor.name}" as the navigationButton of <actionBar> as it is not an instance of NavigationButton.`
                                );
                            }
                        }
                    } else if(child.nodeRole === "actionItems"){
                        if(child.nativeView instanceof TNSActionItem === false){
                            if (__DEV__) {
                                warn(
                                    `Unable to add child "${child.nativeView.constructor.name}" to the actionItems of <actionBar> as it is not an instance of ActionItem.`
                                );
                            };
                            return;
                        }

                        /**
                         * The implementation shows that getItems() returns a clone of the array, conforming to Array.
                         * @see action-bar-common.js
                         */
                        const existingItems: TNSActionItem[] = actionBar.actionItems.getItems();

                        if(typeof atIndex === "undefined" || atIndex === existingItems.length){
                            /**
                             * The implementation shows that addItem() acts as Array.prototype.push().
                             * @see action-bar-common.js
                             */
                            actionBar.actionItems.addItem(child.nativeView as TNSActionItem);
                        } else {
                            /**
                             * actionBar.actionItems doesn't publicly expose a splice() API, so we'll have to do things the hard way.
                             */
                            const updatedItems: TNSActionItem[] = actionBar.actionItems.getItems();
                            updatedItems.splice(
                                atIndex,
                                0,
                                child.nativeView as TNSActionItem
                            );
    
                            existingItems.forEach(actionItem => actionBar.actionItems.removeItem(actionItem));
                            updatedItems.forEach(actionItem => actionBar.actionItems.addItem(actionItem));
                        }
                    } else if(child.nodeRole === "actionItem"){
                        if (__DEV__) {
                            warn(
                                `Unable to add child "${child.nativeView.constructor.name}" to <actionBar> as it had the nodeRole "actionItem"; please correct it to "actionItems".`
                            );
                        }
                    } else if(child.nodeRole === "titleView"){
                        actionBar.titleView = child.nativeView as TNSView;
                    } else {
                        if (__DEV__) {
                            warn(
                                `Unable to add child "${child.nativeView.constructor.name}" to <actionBar> as it does not have a nodeRole specified; ` +
                                `please set a nodeRole of "navigationButton", "actionItems", or "titleView".`
                            )
                        }
                    }
                },
                remove(child: NSVElement, parent: NSVElement<TNSActionBar>): void {
                    const actionBar = parent.nativeView as TNSActionBar;

                    if(child.nodeRole === "navigationButton"){
                        actionBar.navigationButton = null; // Anything falsy should work.
                    } else if(child.nodeRole === "actionItems"){
                        actionBar.actionItems.removeItem(child.nativeView as TNSActionItem);
                    } else if(child.nodeRole === "actionItem"){
                        if (__DEV__) {
                            warn(
                                `Unable to remove child "${child.nativeView.constructor.name}" from <actionBar> as it had the nodeRole "actionItem"; please correct it to "actionItems".`
                            );
                        }
                    } else if(child.nodeRole === "titleView"){
                        actionBar.titleView = null; // Anything falsy should work.
                    } else {
                        if (__DEV__) {
                            warn(
                                `Unable to add child "${child.nativeView.constructor.name}" to <actionBar> as it does not have a nodeRole specified; ` +
                                `please set a nodeRole of "navigationButton", "actionItems", or "titleView".`
                            )
                        }
                    }
                }
            }
        }
    )
    registerElement(
        'actionItem',
        () => require('@nativescript/core').ActionItem
        // _addChildFromBuilder and removeChild both refer to actionView, so no strict need for nodeOps here.
    )
    registerElement(
        'navigationButton',
        () => require('@nativescript/core').NavigationButton
        // _addChildFromBuilder and removeChild both refer to actionView, so no strict need for nodeOps here.
    )

    // navigation
    registerElement(
        'frame',
        () => require('@nativescript/core').Frame,
        {
            stackDepth: 0,
            // todo: move into Frame.ts when we end up creating a component for Frame
            nodeOps: {
                insert(child: NSVElement, parent: NSVElement<TNSFrame>, atIndex?: number): void {
                    const frame = parent.nativeView;
                    const page = child.nativeView as TNSPage;
                    if (child.nativeView instanceof TNSPage) {
                        if(typeof atIndex === "undefined"){
                            const stackDepth = parent.meta.stackDepth;

                            const resolvedNavOpts: RNSNavigationOptions = Object.assign(
                                {},
                                __unstable__forwardNavOpts.defaultOptions,
                                {
                                    animated: stackDepth > -1,
                                    clearHistory: stackDepth === -1,
                                    backstackVisible: true,
                                },
                                __unstable__forwardNavOpts.pop() || {},
                            );

                            // console.log(`[frame.insert] [${parent} > ${child} @${atIndex}] => [${parent.childNodes}] via ${parent}.navigate(${child}) (clearHistory ${resolvedNavOpts.clearHistory}); stackDepth ${stackDepth} -> ${stackDepth + 1}`);
                            // console.log(`[frame.insert.pending] backstack is now: [${(frame as unknown as TNSFramePrivate)._backStack.map(entry => entry.resolvedPage)}]`);

                            frame.navigate({
                                ...resolvedNavOpts,
                                create() {
                                    return child.nativeView as TNSView
                                }
                            });

                            // At least on forward navigations, need to wait for the animation to complete before the backstack will reflect the update.
                            // setTimeout(() => {
                            //     console.log(`[frame.insert.done] backstack is now: [${(frame as unknown as TNSFramePrivate)._backStack.map(entry => entry.resolvedPage)}]`);
                            // }, 1000);

                            parent.meta.stackDepth++;
                            return;
                        } else {
                            if (__DEV__) {
                                warn(`NativeScript Core does not support splicing pages into frames. Can't add page to index ${atIndex}.`);
                            }
                        }
                    } else {
                        if (__DEV__) {
                            warn(
                                `<frame> must only contain <page> elements - ` +
                                `got <${child.nativeView.constructor.name}> instead.`
                            )
                        }
                    }
                },
                /**
                 * This is a best-of-a-bad-job. NativeScript Core implements push & pop, and
                 * replacement (but only of the topmost, currentEntry of the stack). The latter
                 * was only implemented for HMR purposes.
                 * 
                 * We can splice frame._backStack (belonging to frame-common.ts), but it doesn't
                 * update the logic of the frame.ios.ts and frame.android.ts native implementations.
                 */
                remove(child: NSVElement, parent: NSVElement<TNSFrame>): void {
                    // console.log(`[frame.remove] ${parent}.childNodes updating to: [${parent.childNodes}]`);

                    const frame = parent.nativeView;
                    const page = child.nativeView as TNSPage;

                    if((frame as unknown as TNSFramePrivate)._currentEntry?.resolvedPage === page){
                        if(frame.canGoBack()){
                            // console.log(`[frame.remove] [${parent} x ${child}] => [${parent.childNodes}] via ${parent}.goBack() on currentEntry page; stackDepth ${parent.meta.stackDepth} -> ${Math.max(0, parent.meta.stackDepth - 1)}`);

                            // console.log(`[frame.remove.pending] backstack is now: [${(frame as unknown as TNSFramePrivate)._backStack.map(entry => entry.resolvedPage)}]`);

                            /** { animated: false } is ignored even if you pass in a backStackEntry that explicitly specifies it. */
                            frame.goBack();
                            // console.log(`[frame.remove.done] backstack is now: [${(frame as unknown as TNSFramePrivate)._backStack.map(entry => entry.resolvedPage)}]`);
                            parent.meta.stackDepth = Math.max(0, parent.meta.stackDepth - 1);
                        } else {
                            /**
                             * NativeScript Core does not support transitioning a Frame back to Pageless state.
                             * It's simply not possible, whether by `frame.removeEntry()`, `frame._updateBackstack()`,
                             * or `frame.setCurrent()`.
                             * 
                             * ... So the best we can do is indicate that the stack is conceptually empty.
                             * This means that, on next navigation, we should call clearHistory.
                             */
                            // console.log(`[frame.remove] [${parent} x ${child}] = [${parent.childNodes}] via no-op on currentEntry page; stackDepth ${parent.meta.stackDepth} -> -1`);
                            // console.log(`[frame.remove.done] backstack is now: [${(frame as unknown as TNSFramePrivate)._backStack.map(entry => entry.resolvedPage)}]`);
                            parent.meta.stackDepth = -1;
                        }
                    } else {
                        // console.log(`[frame.remove] ${parent} x ${child}, but child isn't the currentEntry (which is ${frame._currentEntry?.resolvedPage}). May involve a splice or a no-op.`);
                        
                        /**
                         * When React Navigation pops back to the top, it removes from the root of the stack rather than the face. This has some sense, as
                         * it avoids rendering and animating every pop on the way, but it's very problematic for NativeScript Core, which cannot splice
                         * Pages from the Frame's stack.
                         * 
                         */

                        let indexOfBackstackEntry: number = -1;
                        const backstackEntry: TNSBackstackEntry | undefined = (frame as unknown as TNSFramePrivate)._backStack.find((entry, i) => {
                            if(entry.resolvedPage === page){
                                indexOfBackstackEntry = i;
                                return true;
                            }
                            return false;
                        });

                        if(backstackEntry){
                            // console.log(`[frame.remove] Found backStackEntry for ${child} at index ${indexOfBackstackEntry}, so it's a splice.`);
                            // const backStackLengthBefore = (frame as unknown as TNSFramePrivate)._backStack.length;
                            // console.log(`[frame.remove] [${parent} x ${child}] = [${parent.childNodes}] via splice@${indexOfBackstackEntry} of non-currentEntry page; stackDepth ${parent.meta.stackDepth} -> ${Math.max(0, parent.meta.stackDepth - 1)}`);
                            // console.log(`[frame.remove.pending] backstack is now: [${(frame as unknown as TNSFramePrivate)._backStack.map(entry => entry.resolvedPage)}]`);
                            (frame as unknown as TNSFramePrivate)._removeEntry(backstackEntry);
                            (frame as unknown as TNSFramePrivate)._backStack.splice(indexOfBackstackEntry, 1);
                            // console.log(`[frame.remove] backStackLengthBefore ${backStackLengthBefore} => backStackLengthAfter ${(frame as unknown as TNSFramePrivate)._backStack.length}`);
                            // console.log(`[frame.remove.done] backstack is now: [${(frame as unknown as TNSFramePrivate)._backStack.map(entry => entry.resolvedPage)}]`);
                        } else {
                            /* There's actually valid reason to no-op here:
                             * We might simply be trying to pop a child page in response to a native pop having occurred. */
                            // console.log(`[frame.remove] Didn't find a backStackEntry for ${child} at so it must have been handled by Core already. No-op. `);
                            // console.log(`[frame.remove] [${parent} x ${child}] = [${parent.childNodes}] via no-op on non-currentEntry page; stackDepth ${parent.meta.stackDepth} -> ${Math.max(0, parent.meta.stackDepth - 1)}`);
                            // console.log(`[frame.remove.done] backstack is now: [${(frame as unknown as TNSFramePrivate)._backStack.map(entry => entry.resolvedPage)}]`);
                        }

                        parent.meta.stackDepth = Math.max(0, parent.meta.stackDepth - 1);
                        return;
                    }
                }
            }
        }
    )
    registerElement(
        'page',
        () => require('@nativescript/core').Page,
        {
            viewFlags: NSVViewFlags.CONTENT_VIEW,
            nodeOps: {
                insert(child: NSVElement, parent: NSVElement<TNSPage>, atIndex?: number): void {
                    const page = parent.nativeView;

                    if(typeof atIndex === "number" && atIndex > 0){
                        if (__DEV__) {
                            warn(
                                `Cannot add child "${child.nativeView.constructor.name}" to Page, as Page only accepts a single child. ` +
                                `If you wish to add more than one child to a Page, wrap them in a LayoutBase like <stackLayout>.`
                            )
                        }
                        return;
                    }

                    if (child.nodeRole === "actionBar" || child.nativeView instanceof TNSActionBar) {
                        page.actionBar = child.nativeView as TNSActionBar;
                    } else {
                        page.content = child.nativeView as TNSView;
                    }
                },
                remove(child: NSVElement, parent: NSVElement<TNSPage>): void {
                    const page = parent.nativeView;
                    if (child.nodeRole === "actionBar" || child.nativeView instanceof TNSActionBar) {
                        /* Well we could technically do this, but it'd be better to just teach good practices. */
                        // page.actionBar = new TNSActionBar();
                        
                        if (__DEV__) {
                            warn(
                                `Unable to remove ActionBar from Page; not supported by NativeScript Core. ` +
                                `You may prefer to set page.actionBarHidden = true instead.`
                            )
                        }
                    } else {
                        page.content = null;
                    }
                }
            }
        }
    )

    // html
    registerElement(
        'htmlView',
        () => require('@nativescript/core').HtmlView
    )
    registerElement(
        'webView',
        () => require('@nativescript/core').WebView
    )

    // components
    registerElement(
        'activityIndicator',
        () => require('@nativescript/core').ActivityIndicator
    )
    registerElement(
        'button',
        () => require('@nativescript/core').Button
    )
    registerElement(
        'datePicker',
        () => require('@nativescript/core').DatePicker,
        {
            model: {
                prop: 'date',
                event: 'dateChange'
            }
        }
    )
    registerElement(
        'formattedString',
        () => require('@nativescript/core').FormattedString,
        {
            // todo: move into FormattedString.ts when we end up creating a component for FormattedString
            /**
             * The default parentView._addChildFromBuilder() seems to handle the case of pushing a new child in.
             * It might even handle the case of splicing a child into place. I wasn't able to check.
             */
            nodeOps: {
                insert(child: NSVElement, parent: NSVElement, atIndex?: number): void {
                    const formattedString = parent.nativeView as TNSFormattedString
                    if (child.nativeView instanceof TNSSpan) {
                        const spansLength: number = formattedString.spans.length;
                        formattedString.spans.splice(
                            typeof atIndex === "undefined" ? 
                                spansLength :
                                atIndex,
                            0,
                            child.nativeView
                        );
                    } else {
                        if (__DEV__) {
                            warn(
                                `<formattedString> must only contain <span> elements - ` +
                                `got <${child.nativeView.constructor.name}> instead.`
                            )
                        }
                    }
                },
                /**
                 * The default parentView._removeView() crashes upon removing a span.
                 * This implementation addresses that.
                 */
                remove(child: NSVElement, parent: NSVElement): void {
                    const formattedString = parent.nativeView as TNSFormattedString
                    if (child.nativeView instanceof TNSSpan) {
                        const childIndex: number = formattedString.spans.indexOf(child.nativeView);
                        formattedString.spans.splice(childIndex, 1);
                    } else {
                        if (__DEV__) {
                            warn(
                                `<formattedString> must only contain <span> elements - ` +
                                `got <${child.nativeView.constructor.name}> instead.`
                            )
                        }
                    }
                }
            }
        }
    )
    registerElement(
        'image',
        () => require('@nativescript/core').Image
    )
    registerElement(
        'label',
        () => require('@nativescript/core').Label
    )
    registerElement(
        'listPicker',
        () => require('@nativescript/core').ListPicker,
        {
            model: {
                prop: 'selectedIndex',
                event: 'selectedIndexChange'
            }
        }
    )
    registerElement(
        'listView',
        () => require('@nativescript/core').ListView,
        {
            viewFlags: NSVViewFlags.NO_CHILDREN
        }
    )
    registerElement(
        'placeholder',
        () => require('@nativescript/core').Placeholder,
    )
    registerElement(
        'progress',
        () => require('@nativescript/core').Progress
    )
    registerElement(
        'searchBar',
        () => require('@nativescript/core').SearchBar,
        {
            model: {
                prop: 'text',
                event: 'textChange',
            }
        }
    )
    registerElement(
        'segmentedBar',
        () => require('@nativescript/core').SegmentedBar,
        {
            model: {
                prop: 'selectedIndex',
                event: 'selectedIndexChange',
            }
        }
    )
    registerElement(
        'segmentedBarItem',
        () => require('@nativescript/core').SegmentedBarItem,
    )
    registerElement(
        'slider',
        () => require('@nativescript/core').Slider,
        {
            model: {
                prop: 'value',
                event: 'valueChange',
            }
        }
    )
    registerElement(
        'span',
        () => require('@nativescript/core').Span,
    )
    registerElement(
        'switch',
        () => require('@nativescript/core').Switch,
        {
            model: {
                prop: 'checked',
                event: 'checkedChange',
            }
        }
    )
    registerElement(
        'textField',
        () => require('@nativescript/core').TextField,
        {
            model: {
                prop: 'text',
                event: 'textChange',
            }
        }
    )
    registerElement(
        'textView',
        () => require('@nativescript/core').TextView,
        {
            model: {
                prop: 'text',
                event: 'textChange',
            },
        }
    )
    registerElement(
        'timePicker',
        () => require('@nativescript/core').TimePicker,
        {
            model: {
                prop: 'time',
                event: 'timeChange',
            },
        }
    )

    registerElement(
        'tabView',
        () => require('@nativescript/core').TabView,
        {
            nodeOps: {
                insert(child: NSVElement, parent: NSVElement<TNSTabView>, atIndex?: number): void {
                    const tabView = parent.nativeView;
                    
                    if(child.nodeRole === "items"){
                        if(child.nativeView instanceof TNSTabViewItem === false){
                            if (__DEV__) {
                                warn(
                                    `Unable to add child "${child.nativeView.constructor.name}" to the items of <tabView> as it is not an instance of TabViewItem.`
                                );
                            };
                            return;
                        }

                        const items = tabView.items || []; // Annoyingly, it's the consumer's responsibility to ensure there's an array there!

                        if(typeof atIndex === "undefined" || atIndex === items.length){
                            tabView.items = items.concat(child.nativeView as TNSTabViewItem);
                        } else {
                            tabView.items = items.slice().splice(
                                atIndex,
                                0,
                                child.nativeView as TNSTabViewItem
                            );
                        }
                    } else if(child.nodeRole === "item"){
                        if (__DEV__) {
                            warn(
                                `Unable to add child "${child.nativeView.constructor.name}" to <tabView> as it had the nodeRole "item"; please correct it to "items".`
                            );
                        }
                    } else {
                        if (__DEV__) {
                            warn(
                                `Unable to add child "${child.nativeView.constructor.name}" to <tabView> as it does not have a nodeRole specified; ` +
                                `please set a nodeRole of "items".`
                            )
                        }
                    }
                },
                remove(child: NSVElement, parent: NSVElement<TNSTabView>): void {
                    const tabView = parent.nativeView;

                    if(child.nodeRole === "items"){
                        tabView.items = (tabView.items || []).filter(i => i !== child.nativeView);
                    } else if(child.nodeRole === "item"){
                        if (__DEV__) {
                            warn(
                                `Unable to remove child "${child.nativeView.constructor.name}" from <tabView> as it had the nodeRole "item"; please correct it to "items".`
                            );
                        }
                    } else {
                        if (__DEV__) {
                            warn(
                                `Unable to add child "${child.nativeView.constructor.name}" to <tabView> as it does not have a nodeRole specified; ` +
                                `please set a nodeRole of "items"`
                            )
                        }
                    }
                }
            }
        }
    )

    registerElement(
        'tabViewItem',
        () => require('@nativescript/core').TabViewItem,
        {
            nodeOps: {
                insert(child: NSVElement, parent: NSVElement<TNSTabViewItem>, atIndex?: number): void {
                    const tabViewItem = parent.nativeView;

                    if(child.nativeView instanceof TNSView){
                        tabViewItem.view = child.nativeView;
                    } else {
                        if (__DEV__) {
                            warn(
                                `Unable to add child "${child.nativeView.constructor.name}" as the view of <tabViewItem> as it is not an instance of View.`
                            );
                        }
                    }
                },
                remove(child: NSVElement, parent: NSVElement<TNSTabViewItem>): void {
                    const tabViewItem = parent.nativeView;

                    // tabViewItem.view = null; // Anything falsy should work.
                    if (__DEV__) {
                        warn(
                            `Unable to remove child "${child.nativeView.constructor.name}" from <tabViewItem> as NativeScript Core does not support it; ` +
                            `please re-use and modify the existing TabViewItem instead.`
                        )
                    }
                }
            }
        }
    )
}
// todo: more
