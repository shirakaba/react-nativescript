import { Observable, EventData } from "tns-core-modules/data/observable";
import { GestureTypes } from "tns-core-modules/ui/gestures/gestures";

// type GenericListener = (...args: any[]) => void;
type GenericListener = (data: EventData) => void

export function updateListener<T extends Observable>(node: T, eventName: string|GestureTypes, currentListener: GenericListener|undefined, incomingListener: GenericListener|undefined): void {
    if(currentListener){
        if(incomingListener){
            if(incomingListener !== currentListener){
                node.off(eventName as any as string, currentListener);
                node.on(eventName as any as string, incomingListener);
            }
        } else {
            node.off(eventName as any as string, currentListener);
        }
    } else {
        if(incomingListener){
            node.on(eventName as any as string, incomingListener);
        }
    }
}