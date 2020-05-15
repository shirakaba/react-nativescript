import { isOn } from '@nativescript-vue/shared'
import { patchEvent } from './modules/events'
import { INSVElement } from './nodes'
import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { patchAttr } from './modules/attrs'

export function patchProp(
  el: INSVElement,
  key: string,
  prevValue: any,
  nextValue: any
) {
  // console.log('->patchProp')

  switch (key) {
    // special
    case 'class':
      // console.log('->patchProp+Class')
      patchClass(el, nextValue)
      break
    case 'style':
      // console.log('->patchProp+Style')
      patchStyle(el, prevValue, nextValue)
      break
    case 'modelValue':
    case 'onUpdate:modelValue':
      // handled by v-model directive
      break
    default:
      if (isOn(key)) {
        patchEvent(el, key.slice(2), prevValue, nextValue)
      } else {
        patchAttr(el, key, prevValue, nextValue)
      }
  }
}
