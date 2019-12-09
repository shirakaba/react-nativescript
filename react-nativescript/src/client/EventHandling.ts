import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Observable, EventData } from "tns-core-modules/data/observable";
import { GestureTypes } from "tns-core-modules/ui/gestures/gestures";
// import * as console from "../shared/Logger";

// type GenericListener = (...args: any[]) => void;
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
                node.off((eventName as any) as string, currentListener);
                node.on((eventName as any) as string, incomingListener);
            } else {
                // console.log(`No change to '${eventLogName}' incomingListener.`);
            }
        } else {
            console.log(
                `Removing '${eventLogName}' listener as there is a currentListener without an incomingListener.`
            );
            node.off((eventName as any) as string, currentListener);
        }
    } else {
        if (incomingListener) {
            console.log(`Adding '${eventLogName}' incomingListener; currentListener was falsy.`);
            node.on((eventName as any) as string, incomingListener);
        }
    }
}

export function useEventListener<E extends Observable>(
    ref: React.RefObject<E>,
    eventName: string | GestureTypes,
    eventListener: GenericListener | undefined
): void 
{
    // console.log(`[useEventListener] Entered.`);
    useEffect(() => {
        if(ref.current && eventListener){
            // console.log(`[useEventListener.useEffect] "${eventName}" - ref.current ref was populated, with eventListener`, eventListener);
            ref.current.on(eventName as string, eventListener);
        } else {
            console.log(`[useEventListener.useEffect] "${eventName}" - ref.current ref was null!`);
        }

        return function cleanup() {
            if(ref.current && eventListener){
                ref.current.off(eventName as string, eventListener);
            }
        };
    }, [ref.current, eventListener]);
}