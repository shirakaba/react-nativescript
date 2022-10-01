import type { RNSStyle } from "../shared/NativeScriptJSXTypings";

/**
 * An (unfinished) implementation of React Native's StyleSheet API.
 * @see https://reactnative.dev/docs/stylesheet
 */
export namespace StyleSheet {
    type NamedStyles<T> = { [P in keyof T]: RNSStyle };

    /**
     * A convenience function for creating a reusable, type-checked record of RNSStyles.
     *
     * At present, its output is no different from a manually declared a style object.
     * i.e. this API  does not implement any optimisations like style deduplication
     * across the app or anything. Though in future, it may do.
     *
     * @param styles An object keyed by classNames, whose values are Records of styles.
     * @example { bigText: { fontSize: 72 } }
     */
    export function create<T extends NamedStyles<T> | NamedStyles<any>>(styles: T | NamedStyles<T>): T {
        return styles as T;
    }
}
