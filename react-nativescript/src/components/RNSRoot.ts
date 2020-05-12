import { ViewBase } from "@nativescript/core";

export class RNSRoot {
    public baseRef: ViewBase|null = null;
    setBaseRef(child: ViewBase|null){
        this.baseRef = child;
    }
}