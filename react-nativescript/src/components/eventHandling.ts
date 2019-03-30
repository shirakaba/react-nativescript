import { Observable } from "tns-core-modules/data/observable";

export interface ListenerEventsMap {
    [eventName: string]: (...args: any[]) => void;
}

export function attachListeners<T extends Observable>(node: T, listeners: ListenerEventsMap): void {
    return attachOrDetachListeners(node, listeners, true);
}

export function detachListeners<T extends Observable>(node: T, listeners: ListenerEventsMap): void {
    return attachOrDetachListeners(node, listeners, false);
}

function attachOrDetachListeners<T extends Observable>(node: T, listeners: ListenerEventsMap, attach: boolean): void {
    Object.keys(listeners).forEach((name: string) => {
        const listener = listeners[name];
        if(!listener) return;
        attach ? node.on(name, listener) : node.off(name, listener);
    });
}

export function updateListeners<T extends Observable>(node: T, oldListeners: ListenerEventsMap, newListeners: ListenerEventsMap): void {
    Object.keys(oldListeners).forEach((name: string) => {
        const currentListener = oldListeners[name];
        const incomingListener = newListeners[name];

        if(currentListener){
            if(incomingListener){
                if(incomingListener !== currentListener){
                    node.off(name, currentListener);
                    node.on(name, incomingListener);
                }
            } else {
                node.off(name, currentListener);
            }
        } else {
            if(incomingListener){
                node.on(name, incomingListener);
            }
        }
    });
}