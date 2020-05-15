import { EMPTY_OBJ } from '@vue/shared'
import { INSVElement } from '../nodes'
import { callWithAsyncErrorHandling } from '@vue/runtime-core'

interface Invoker extends EventListener {
  value: EventValue
}

type EventValue = (Function | Function[]) & {
  invoker?: Invoker | null
}

type EventValueWithOptions = {
  handler: EventValue
  options: AddEventListenerOptions
  invoker?: Invoker | null
}

export function addEventListener(
  el: INSVElement,
  event: string,
  handler: EventListener,
  options: EventListenerOptions = {}
) {
  el.addEventListener(event, handler, options)
}

export function patchEvent(
  el: INSVElement,
  name: string,
  prevValue: EventValueWithOptions | EventValue | null,
  nextValue: EventValueWithOptions | EventValue | null
) {
  const prevOptions = prevValue && 'options' in prevValue && prevValue.options
  const nextOptions = nextValue && 'options' in nextValue && nextValue.options
  const invoker = prevValue && prevValue.invoker
  const value =
    nextValue && 'handler' in nextValue ? nextValue.handler : nextValue

  if (prevOptions || nextOptions) {
    const prev = prevOptions || EMPTY_OBJ
    const next = nextOptions || EMPTY_OBJ
    if (prev.once !== next.once) {
      if (invoker) {
        el.removeEventListener(name, invoker)
      }
      if (nextValue && value) {
        const invoker = createInvoker(value)
        nextValue.invoker = invoker
        addEventListener(el, name, invoker, next)
      }
      return
    }
    return
  }

  if (nextValue && value) {
    if (invoker) {
      ;(prevValue as any).invoker = null
      invoker.value = value
      nextValue.invoker = invoker
    } else {
      addEventListener(el, name, createInvoker(value))
    }
  } else if (invoker) {
    el.removeEventListener(name, invoker)
  }
}

function createInvoker(initialValue: EventValue) {
  const invoker: Invoker = (e) => {
    callWithAsyncErrorHandling(invoker.value, null, 5, [e])
  }
  invoker.value = initialValue
  initialValue.invoker = invoker
  return invoker
}
