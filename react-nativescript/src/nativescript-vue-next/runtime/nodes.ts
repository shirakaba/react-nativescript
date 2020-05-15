import {
    getViewClass,
    getViewMeta,
    normalizeElementName,
    NSVViewMeta,
} from './registry'
import { ELEMENT_REF } from './runtimeHelpers';
import { debug } from '../shared';
import { ViewBase, LayoutBase, Style } from '@nativescript/core'
import { unsetValue } from '@nativescript/core/ui/core/properties'
/* 
 * I had some difficulty importing this as:
 *   import set from 'set-value';
 * I believe that turning on `"esModuleInterop": true` in tsconfig.json would allow us to use the default import.
 * But maybe this is just a problem in the Webpack domain.
 */
import set = require('set-value');

// import unset from 'unset-value'

// import {isContentView, isLayout} from "./index";

export const enum NSVNodeTypes {
    TEXT = 'text',
    ELEMENT = 'element',
    COMMENT = 'comment',
    ROOT = 'root',
}

// View Flags indicate the kind of view the element is
// this avoids extra checks during runtime to determine
// the method to use for adding/removing child nodes
//
export const enum NSVViewFlags {
    NONE = 0,
    SKIP_ADD_TO_DOM = 1 << 0,
    CONTENT_VIEW = 1 << 1,
    LAYOUT_VIEW = 1 << 2,
    NO_CHILDREN = 1 << 3,
}

export interface INSVNode {
    nodeId: number
    nodeType: NSVNodeTypes
    text: string | undefined

    parentNode: INSVElement | null

    childNodes: INSVNode[]
    firstChild: INSVNode | null
    lastChild: INSVNode | null
    prevSibling: INSVNode | null
    nextSibling: INSVNode | null
}

export interface INSVElement extends INSVNode {
    tagName: string
    meta: NSVViewMeta
    style: Style | string

    addEventListener(
        event: string,
        handler: any,
        options?: AddEventListenerOptions
    ): void

    removeEventListener(event: string, handler?: any): void

    dispatchEvent(event: string): void

    nativeView: (ViewBase | LayoutBase) & { [ELEMENT_REF]: INSVElement }

    getAttribute(name: string): unknown

    setAttribute(name: string, value: unknown): void

    removeAttribute(name: string): void

    insertBefore(el: INSVNode, anchor?: INSVNode | null): void

    appendChild(el: INSVNode): void

    removeChild(el: INSVNode): void
}

let nodeId = 0

export abstract class NSVNode implements INSVNode {
    protected constructor(nodeType: NSVNodeTypes) {
        this.nodeType = nodeType
        this.nodeId = nodeId++
    }

    nodeId: number
    nodeType: NSVNodeTypes
    text: string | undefined

    parentNode: INSVElement | null = null
    childNodes: INSVNode[] = []

    nextSibling: INSVNode | null = null
    prevSibling: INSVNode | null = null

    get firstChild() {
        return this.childNodes.length ? this.childNodes[0] : null
    }

    get lastChild() {
        return this.childNodes.length
            ? this.childNodes[this.childNodes.length - 1]
            : null
    }
}

export class NSVElement extends NSVNode implements INSVElement {
    private readonly _tagName: string
    private readonly _nativeView: any
    private _meta: NSVViewMeta | undefined

    constructor(tagName: string) {
        super(NSVNodeTypes.ELEMENT)

        this._tagName = normalizeElementName(tagName)
        const viewClass = getViewClass(tagName)
        this._nativeView = new viewClass()
        this._nativeView[ELEMENT_REF] = this
    }

    get tagName(): string {
        return this._tagName
    }

    get nativeView() {
        return this._nativeView
    }

    get style(): Style | string {
        return this.nativeView.style
    }

    set style(inlineStyle: Style | string) {
        this.nativeView.style = inlineStyle
    }

    get text(): string | undefined {
        return this.nativeView.text
    }

    set text(t: string | undefined) {
        this.nativeView.text = t
    }

    get meta() {
        if (this._meta) {
            return this._meta
        }

        return (this._meta = getViewMeta(this.tagName))
    }

    addEventListener(
        event: string,
        handler: any,
        options: AddEventListenerOptions = {}
    ) {
        const { capture, once } = options
        if (capture) {
            debug('Bubble propagation is not supported')
            return
        }
        if (once) {
            const oldHandler = handler
            const self = this
            handler = (...args: any) => {
                const res = oldHandler.call(null, ...args)
                if (res !== null) {
                    self.removeEventListener(event, handler)
                }
            }
        }
        this.nativeView.addEventListener(event, handler)
    }

    removeEventListener(event: string, handler?: any) {
        this.nativeView.removeEventListener(event, handler)
    }

    dispatchEvent(event: string) {
        this.nativeView.notify({ eventName: event, object: this.nativeView })
    }

    getAttribute(name: string): unknown {
        return this.nativeView[name]
    }

    setAttribute(name: string, value: unknown) {
        set(this.nativeView, name, value)
    }

    removeAttribute(name: string) {
        // potential issue: unsetValue is an empty object
        // not all properties/attributes may know/check for this
        set(this.nativeView, name, unsetValue)
        // originally we deleted the property, but in case of built-in properties
        // this would break them. For example, deleting the padding property
        // will prevent us from changing the padding once we deleted it
        // that's not the expected behaviour.
        // unset(this.nativeView, name)
    }

    insertBefore(el: INSVNode, anchor?: INSVNode | null) {
        if (!anchor) {
            return this.appendChild(el)
        }

        const refIndex = this.childNodes.findIndex(
            (node) => node.nodeId === anchor.nodeId
        )

        if (refIndex === -1) {
            return this.appendChild(el)
        }

        if (el.parentNode) {
            el.parentNode.removeChild(el)
        }

        this.childNodes.splice(refIndex, 0, el)
        el.parentNode = this

        // find index to use for the native view, since non-visual nodes
        // (comment/text don't exist in the native view hierarchy)
        // todo: potentially refactor based on my benchmark:
        // https://www.measurethat.net/Benchmarks/Show/7450/0/filter-findindex
        const trueIndex = this.childNodes
            .filter((node) => node.nodeType === NSVNodeTypes.ELEMENT)
            .findIndex((node) => node.nodeId === el.nodeId)

        this.addChild(el, trueIndex)
    }

    appendChild(el: INSVNode) {
        this.childNodes.push(el)
        el.parentNode = this

        this.addChild(el)
    }

    removeChild(el: INSVNode) {
        const index = this.childNodes.findIndex((node) => node.nodeId === el.nodeId)

        if (index > -1) {
            this.childNodes.splice(index, 1)
            el.parentNode = null
            if (el.nodeType === NSVNodeTypes.ELEMENT) {
                removeChild(el as NSVElement, this)
            } else if (el.nodeType === NSVNodeTypes.TEXT) {
                this.updateText()
            }
        }
    }

    // abstracted from appendChild, and insertBefore to avoid code duplication
    private addChild(el: INSVNode, atIndex?: number): void {
        if (el.nodeType === NSVNodeTypes.ELEMENT) {
            addChild(el as NSVElement, this, atIndex)
        } else if (el.nodeType === NSVNodeTypes.TEXT) {
            this.updateText()
        }
    }

    updateText() {
        this.setAttribute(
            'text',
            this.childNodes
                .filter((node) => node.nodeType === NSVNodeTypes.TEXT)
                .reduce((text: string, currentNode) => {
                    return text + currentNode.text
                }, '')
        )
    }
}

export class NSVComment extends NSVNode {
    constructor(text: string) {
        super(NSVNodeTypes.COMMENT)

        this.text = text
    }
}

export class NSVText extends NSVNode {
    constructor(text: string) {
        super(NSVNodeTypes.TEXT)

        this.text = text
    }
}

export class NSVRoot extends NSVNode {
    baseRef?: NSVElement

    constructor() {
        super(NSVNodeTypes.ROOT)
    }

    setBaseRef(el: INSVNode|null): void {
        // console.log(`NSVRoot->appendChild(${el.nodeType})`)
        if (el instanceof NSVElement) {
            this.baseRef = el
        }
        // no-op
    }
}

function addChild(child: NSVElement, parent: NSVElement, atIndex?: number) {
    if (__TEST__) return
    // debug(
    //     `...addChild(    ${child.tagName}(${child.nodeId}), ${parent.tagName}(${
    //         parent.nodeId
    //     }), ${atIndex}    )`
    // )
    if (child.meta.viewFlags & NSVViewFlags.SKIP_ADD_TO_DOM) {
        // debug('SKIP_ADD_TO_DOM')
        return
    }

    const parentView = parent.nativeView
    const childView = child.nativeView

    if (parent.meta.viewFlags & NSVViewFlags.NO_CHILDREN) {
        // debug('NO_CHILDREN')
        return
    }
    if (parent.meta.nodeOps) {
        return parent.meta.nodeOps.insert(child, parent, atIndex)
    }

    if (parent.meta.viewFlags & NSVViewFlags.LAYOUT_VIEW) {
        if (atIndex) {
            parentView.insertChild(childView, atIndex)
        } else {
            parentView.addChild(childView)
        }
    } else if (parent.meta.viewFlags & NSVViewFlags.CONTENT_VIEW) {
        parentView.content = childView
    } else {
        parentView._addChildFromBuilder(childView.constructor.name, childView)
    }
}

function removeChild(child: NSVElement, parent: NSVElement) {
    if (__TEST__) return
    // debug(
    //     `...removeChild(    ${child.tagName}(${child.nodeId}), ${parent.tagName}(${
    //         parent.nodeId
    //     })    )`
    // )

    if (child.meta.viewFlags & NSVViewFlags.SKIP_ADD_TO_DOM) {
        // debug('SKIP_ADD_TO_DOM')
        return
    }
    if (parent.meta.viewFlags & NSVViewFlags.NO_CHILDREN) {
        // debug('NO_CHILDREN')
        return
    }
    if (parent.meta.nodeOps) {
        return parent.meta.nodeOps.remove(child, parent)
    }

    const parentView = parent.nativeView
    const childView = child.nativeView

    if (parent.meta.viewFlags & NSVViewFlags.LAYOUT_VIEW) {
        parentView.removeChild(childView)
    } else if (parent.meta.viewFlags & NSVViewFlags.CONTENT_VIEW) {
        parentView.content = null
    } else {
        parentView._removeView(childView)
    }
}
