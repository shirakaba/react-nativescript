import { NavigationEntry } from "@nativescript/core";

export type RNSNavigationOptions = Pick<NavigationEntry, "animated"|"transition"|"transitioniOS"|"transitionAndroid"|"backstackVisible"|"clearHistory">;

class RNSNavigationOptionsManager {
    public readonly defaultOptions: RNSNavigationOptions = {
        // Fall back to NativeScript Core internal defaults.
    };

    private pendingOptions: RNSNavigationOptions|null = null;

    getPendingOptions(): RNSNavigationOptions | null {
        return this.pendingOptions;
    }

    push(options: RNSNavigationOptions|null): void {
        this.pendingOptions = options;
    }

    pop(): RNSNavigationOptions|null {
        const pendingOptions = this.pendingOptions;
        this.pendingOptions = null;
        return pendingOptions;
    }
}

export const __unstable__forwardNavOpts = new RNSNavigationOptionsManager();
/**
  * TODO: Implement. The goBack() API is a bit more annoying to work with, as it requires you
  * to specify the target BackStackEntry that you're trying to navigate back to.
  * 
 */
// export const backwardNavOpts = new RNSNavigationOptionsManager();