import { Observable, EventData } from "tns-core-modules/data/observable";
import { GestureTypes } from "tns-core-modules/ui/gestures/gestures";

// type GenericListener = (...args: any[]) => void;
type GenericListener = (data: EventData) => void;

export function updateListener<T extends Observable>(
    node: T,
    eventName: string|GestureTypes,
    currentListener: GenericListener|undefined,
    incomingListener: GenericListener|undefined,
    eventLogName: string = eventName as string,
): void {
    if(currentListener){
        if(incomingListener){
            if(incomingListener !== currentListener){
                console.log(`Replacing '${eventLogName}' currentListener ${currentListener.toString()} with an incomingListener ${incomingListener.toString()}.`);
                node.off(eventName as any as string, currentListener);
                node.on(eventName as any as string, incomingListener);
            } else {
                console.log(`No change to '${eventLogName}' incomingListener.`);
            }
        } else {
            console.log(`Removing '${eventLogName}' listener as there is a currentListener without an incomingListener.`);
            node.off(eventName as any as string, currentListener);
        }
    } else {
        if(incomingListener){
            console.log(`Adding '${eventLogName}' incomingListener; currentListener was falsy.`);
            node.on(eventName as any as string, incomingListener);
        }
    }
}
