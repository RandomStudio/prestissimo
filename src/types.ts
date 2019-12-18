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

export type ValidPayloadTypes = RawMessage | NoteMessage | ControlChangeMessage;

export interface MidiMessageEvent {
  name: MessageTypeName;
  payload: ValidPayloadTypes;
}

export enum MessageType {
  noteOff = 0x08,
  noteOn = 0x09,
  polyAftertouch = 0x0a,
  controlChange = 0x0b,
  program = 0x0c,
  channelAftertouch = 0x0d,
  pitch = 0x0e
}

export enum ExtendedType {
  sysex = 0xf0,
  mtc = 0xf1,
  position = 0xf2,
  select = 0xf3,
  tune = 0xf6,
  sysexEnd = 0xf7,
  clock = 0xf8,
  start = 0xfa,
  continue = 0xfb,
  stop = 0xfc,
  reset = 0xff
}

// https://users.cs.cf.ac.uk/Dave.Marshall/Multimedia/node158.html
export enum MessageTypeName {
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
