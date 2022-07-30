import { GestureTypes, Observable, EventData } from "@nativescript/core";
import * as console from "../shared/Logger";

type GenericListener = (data: EventData) => void;

export function updateListener<T extends Observable>(
    node: T,
    eventName: string | GestureTypes,
    currentListener: GenericListener | undefined,
    incomingListener: GenericListener | undefined,
    eventLogName: string = eventName as string
): void {
    if (currentListener) {
        if (incomingListener) {
            if (incomingListener !== currentListener) {
                console.log(
                    `Replacing '${eventLogName}' currentListener ${currentListener.toString()} with an incomingListener ${incomingListener.toString()}.`
                );
                node.off(eventName as string, currentListener);
                node.on(eventName as string, incomingListener);
            } else {
            }
        } else {
            console.log(`Removing '${eventLogName}' listener as there is a currentListener without an incomingListener.`);
            node.off(eventName as string, currentListener);
        }
    } else {
        if (incomingListener) {
            console.log(`Adding '${eventLogName}' incomingListener; currentListener was falsy.`);
            node.on(eventName as string, incomingListener);
        }
    }
}
