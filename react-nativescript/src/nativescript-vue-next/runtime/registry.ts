import {
    Frame as TNSFrame,
    Page as TNSPage,
    ViewBase as TNSViewBase,
} from '@nativescript/core'
import { NSVElement, NSVViewFlags } from './nodes'
// import { actionBarNodeOps } from './components/ActionBar'
// import { warn } from '@vue/runtime-core'
const warn = console.warn.bind(console);

export type NSVElementResolver = () => TNSViewBase

export type NSVModelDescriptor = {
    prop: string
    event: string
}

export interface NSVViewMeta {
    viewFlags: NSVViewFlags
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

    /** TODO */
    // // ActionBar
    // registerElement(
    //     'internalActionBar',
    //     () => require('@nativescript/core').ActionBar,
    //     {
    //         viewFlags: NSVViewFlags.SKIP_ADD_TO_DOM,
    //         nodeOps: actionBarNodeOps
    //     }
    // )
    registerElement(
        'actionItem',
        () => require('@nativescript/core').ActionItem
    )
    registerElement(
        'navigationButton',
        () => require('@nativescript/core').NavigationButton
    )

    // navigation
    registerElement(
        'frame',
        () => require('@nativescript/core').Frame,
        {
            // todo: move into Frame.ts when we end up creating a component for Frame
            nodeOps: {
                insert(child: NSVElement, parent: NSVElement, atIndex?: number): void {
                    const frame = parent.nativeView as TNSFrame
                    if (child.nativeView instanceof TNSPage) {
                        frame.navigate({
                            create() {
                                return child.nativeView
                            }
                        })
                    } else {
                        if (__DEV__) {
                            warn(
                                `<Frame> must only contain <Page> elements - ` +
                                `got <${child.nativeView.constructor.name}> instead.`
                            )
                        }
                    }
                },
                remove(child: NSVElement, parent: NSVElement): void {
                    // ignore? warn? throw? navigate back?
                }
            }
        }
    )
    registerElement(
        'page',
        () => require('@nativescript/core').Page,
        { viewFlags: NSVViewFlags.CONTENT_VIEW }
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
        () => require('@nativescript/core').FormattedString
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
    /** TODO */
    registerElement(
        'internalListView',
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
}
// todo: more
