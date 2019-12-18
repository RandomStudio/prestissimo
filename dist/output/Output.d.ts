/// <reference types="node" />
import { EventEmitter } from "events";
import { ValidPayloadTypes, MessageTypeName, MidiMessageEvent, MidiDevice, DeviceDescription } from "../types";
export declare class Output extends EventEmitter {
    private midi;
    private device;
    constructor(description: DeviceDescription, virtual?: boolean);
    send: (name: MessageTypeName, payload: ValidPayloadTypes) => void;
    getName: () => string;
    getPort: () => number;
    getDevice: () => MidiDevice;
    private emitReady;
}
export declare const messageToBytes: (msg: MidiMessageEvent) => number[];
export declare const isNormalMessage: (name: MessageTypeName) => boolean;
export declare const channelBytes: (typeName: MessageTypeName, channel: number) => number;
export declare const isNoteMessage: (typeName: MessageTypeName) => boolean;
