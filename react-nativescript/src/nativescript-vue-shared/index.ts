import * as trace from '@nativescript/core/trace'

type DebugCategory = string | typeof trace.categories
export function debug(
  s: any,
  category: DebugCategory = trace.categories.Debug
) {
  trace.write(s, category as string, trace.messageType.log)
}

export const isOn = (key: string) => key.startsWith('on')
