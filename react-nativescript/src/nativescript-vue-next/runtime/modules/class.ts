import { INSVElement } from '../nodes'

// compiler should normalize class + :class bindings on the same element
// into a single binding ['staticClass', dynamic]
export function patchClass(el: INSVElement, value: string | null) {
  if (value == null) {
    value = ''
  }
  el.setAttribute('class', value)
}
