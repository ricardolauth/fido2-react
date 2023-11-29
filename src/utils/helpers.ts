﻿import { DebugContextType } from "../components/DebugView";

export const coerceToArrayBuffer = (thing: any, name: string) => {
    if (typeof thing === "string") {
        // base64url to base64
        thing = thing.replace(/-/g, "+").replace(/_/g, "/");

        // base64 to Uint8Array
        var str = window.atob(thing);
        var bytes = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        thing = bytes;
    }

    // Array to Uint8Array
    if (Array.isArray(thing)) {
        thing = new Uint8Array(thing);
    }

    // Uint8Array to ArrayBuffer
    if (thing instanceof Uint8Array) {
        thing = thing.buffer;
    }

    // error if none of the above worked
    if (!(thing instanceof ArrayBuffer)) {
        throw new TypeError("could not coerce '" + name + "' to ArrayBuffer");
    }

    return thing;
};


export const coerceToBase64Url = (thing: any): string => {
    // Array or ArrayBuffer to Uint8Array
    if (Array.isArray(thing)) {
        thing = Uint8Array.from(thing);
    }

    if (thing instanceof ArrayBuffer) {
        thing = new Uint8Array(thing);
    }

    // Uint8Array to base64
    if (thing instanceof Uint8Array) {
        var str = "";
        var len = thing.byteLength;

        for (var i = 0; i < len; i++) {
            str += String.fromCharCode(thing[i]);
        }
        thing = window.btoa(str);
    }

    if (typeof thing !== "string") {
        throw new Error("could not coerce to string");
    }

    // base64 to base64url
    // NOTE: "=" at the end of challenge is optional, strip it off here
    thing = thing.replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/g, "");

    return thing;
};

export const isConditionalMediationAvailable = async () => {
    if (window.PublicKeyCredential &&
        PublicKeyCredential.isConditionalMediationAvailable) {
        // Check if conditional mediation is available.  
        return await PublicKeyCredential.isConditionalMediationAvailable()
    }

    return false;
}

export type PickNotNullable<T> = {
    [P in keyof T as null extends T[P] ? never : P]: T[P]
}

export const debugSleepUntilContinue = async (debug: DebugContextType) => {
    let fininish = false;
    // do silly stuff to await user actions in debug view
    async function sleep() {
        while (true) {
            if (fininish) return
            await new Promise(resolve => setTimeout(resolve, 100))
        }
    }

    debug.setOnContinue(() => {
        fininish = true
    })

    await sleep()
    debug.setOnContinue(undefined)
}