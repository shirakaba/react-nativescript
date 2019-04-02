import { Observable, EventData } from "tns-core-modules/data/observable";

// type GenericListener = (...args: any[]) => void;
type GenericListener = (data: EventData) => void

export function updateListener<T extends Observable>(node: T, eventName: string, currentListener: GenericListener|undefined, incomingListener: GenericListener|undefined): void {
    if(currentListener){
        if(incomingListener){
            if(incomingListener !== currentListener){
                node.off(eventName, currentListener);
                node.on(eventName, incomingListener);
            }
        } else {
            node.off(eventName, currentListener);
        }
    } else {
        if(incomingListener){
            node.on(eventName, incomingListener);
        }
    }
}