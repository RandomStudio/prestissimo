export interface MidiDevice {
    name: string;
    port?: number;
}
export interface DeviceDescription {
    name?: string;
    port?: number;
}
export interface RawMessage {
    deviceName: string;
    deltaTime: number;
    bytes: number[];
}
export interface NoteMessage {
    note: number;
    velocity: number;
    channel: number;
}
export interface ControlChangeMessage {
    controller: number;
    channel: number;
    value: number;
}
export declare type ValidPayloadTypes = RawMessage | NoteMessage | ControlChangeMessage;
export interface MidiMessageEvent {
    name: MessageTypeName;
    payload: ValidPayloadTypes;
}
export declare enum MessageType {
    noteOff = 8,
    noteOn = 9,
    polyAftertouch = 10,
    controlChange = 11,
    program = 12,
    channelAftertouch = 13,
    pitch = 14
}
export declare enum ExtendedType {
    sysex = 240,
    mtc = 241,
    position = 242,
    select = 243,
    tune = 246,
    sysexEnd = 247,
    clock = 248,
    start = 250,
    continue = 251,
    stop = 252,
    reset = 255
}
export declare enum MessageTypeName {
    noteOff = "noteOff",
    noteOn = "noteOn",
    polyAftertouch = "polyphonicKeyPressure",
    controlChange = "controlChange",
    program = "programChange",
    channelAftertouch = "channelPressure",
    pitch = "pitchBend",
    sysex = "systemExclusive",
    mtc = "timeCode",
    position = "songPositionPointer",
    select = "songSelect",
    sysexEnd = "terminateSystemExclusiveDump",
    clock = "timingClock",
    start = "startCurrentSequence",
    continue = "continueSequence",
    stop = "stopCurrentSequence",
    reset = "resetAllReceivers"
}
export interface MidiMessage {
    type: MessageType | ExtendedType;
}
