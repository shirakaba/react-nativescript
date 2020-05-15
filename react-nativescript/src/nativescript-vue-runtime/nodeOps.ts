import { RendererOptions } from '@vue/runtime-core'
import {
  INSVElement,
  INSVNode,
  NSVComment,
  NSVElement,
  NSVRoot,
  NSVText
} from './nodes'

export interface NSVNodeOps
  extends Omit<RendererOptions<INSVNode, INSVElement>, 'patchProp'> {
  createRoot(): NSVRoot
}

export const nodeOps: NSVNodeOps = {
  createRoot() {
    return new NSVRoot()
  },
  createComment(text) {
    return new NSVComment(text)
  },
  createElement(type, isSVG) {
    return new NSVElement(type)
  },
  createText(text) {
    return new NSVText(text)
  },
  nextSibling(node) {
    return node.nextSibling
  },
  parentNode(node) {
    return node.parentNode
  },
  insert(child, parent, anchor) {
    if (anchor !== null) {
      parent.insertBefore(child, anchor)
    } else {
      parent.appendChild(child)
    }
  },
  remove(el) {
    if (el.parentNode != null) {
      el.parentNode.removeChild(el)
    }
  },
  setElementText(node, text) {
    node.text = text
  },
  setText(node, text) {
    node.text = text
  },
  setScopeId(el, id) {
    el.setAttribute(id, '')
  }
}
