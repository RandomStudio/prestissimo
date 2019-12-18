/// <reference types="node" />
import midi from "midi";
import { MidiDevice, ExtendedType, MessageType, NoteMessage, ControlChangeMessage, MidiMessageEvent, MessageTypeName, DeviceDescription } from "./types";
import { EventEmitter } from "events";
export declare const logger: import("log4js").Logger;
export declare class BaseMidiDevice extends EventEmitter {
    protected midi: typeof midi.Input;
    protected device: MidiDevice;
    constructor();
    getName: () => string;
    getPort: () => number;
    getDevice: () => MidiDevice;
    close: () => void;
}
export declare const findMatch: (midiInterface: any, filter: DeviceDescription) => MidiDevice;
export declare const getMessageEvent: (messageType: MessageType | ExtendedType, bytes: number[]) => MidiMessageEvent;
export declare const getNameFromType: (messageType: MessageType) => MessageTypeName;
export declare const getNameFromExtendedType: (messageType: ExtendedType) => MessageTypeName;
export declare const getMessageType: (bytes: number[]) => MessageType | ExtendedType;
export declare const getNote: (bytes: number[]) => NoteMessage;
export declare const getControlChange: (bytes: number[]) => ControlChangeMessage;
export declare const getChannel: (bytes: number[]) => number;
export declare const matchByName: (midiInterface: any, name: string, exact?: boolean) => MidiDevice;
export declare const listPorts: (midiInterface: any) => MidiDevice[];
export declare const setLoglevel: (level: "error" | "info" | "trace" | "debug" | "warn") => void;
export declare const isExtendedType: (bytes: number[]) => boolean;
