import * as midi from "midi";
import { logger } from ".";
import {
  DeviceDescription,
  MidiDeviceDetails,
  MessageType,
  ExtendedType,
  MidiMessageEvent,
  NoteMessage,
  ControlChangeMessage,
  MessageTypeName,
} from "./types";

export const findMatch = (
  midiInterface: typeof midi.Input | typeof midi.Output,
  filter: DeviceDescription
): MidiDeviceDetails =>
  filter.name === undefined
    ? listPorts(midiInterface)[filter.port]
    : matchByName(midiInterface, filter.name);

export const getMessageEvent = (
  messageType: MessageType | ExtendedType,
  bytes: number[]
): MidiMessageEvent => {
  switch (messageType) {
    case MessageType.noteOn:
    case MessageType.noteOff:
      const note: NoteMessage = getNote(bytes);
      return {
        name: getNameFromType(messageType),
        payload: note,
      };
    case MessageType.controlChange:
      const c: ControlChangeMessage = getControlChange(bytes);
      return {
        name: getNameFromType(messageType),
        payload: c,
      };
    default:
      logger.warn("unknown message type");
      return null;
  }
};

export const getNameFromType = (messageType: MessageType): MessageTypeName =>
  MessageTypeName[MessageType[messageType]];

export const getNameFromExtendedType = (
  messageType: ExtendedType
): MessageTypeName => MessageTypeName[ExtendedType[messageType]];

export const getMessageType = (bytes: number[]): MessageType | ExtendedType => {
  if (isExtendedType(bytes)) {
    const name = ExtendedType[bytes[0]];
    return ExtendedType[name];
  } else {
    const name = MessageType[bytes[0] >> 4];
    return MessageType[name];
  }
};

export const getNote = (bytes: number[]): NoteMessage => ({
  channel: getChannel(bytes),
  note: bytes[1],
  velocity: bytes[2],
});

export const getControlChange = (bytes: number[]): ControlChangeMessage => ({
  channel: getChannel(bytes),
  controller: bytes[1],
  value: bytes[2],
});

export const getChannel = (bytes: number[]): number => bytes[0] & 0xf;

export const matchByName = (
  midiInterface: typeof midi.Input | typeof midi.Output,
  name: string,
  exact = false
): MidiDeviceDetails => {
  const ports = listPorts(midiInterface);
  return exact
    ? ports.find((i) => i.name === name)
    : ports.find((i) => i.name.includes(name));
};

export const listPorts = (
  midiInterface: typeof midi.Input | typeof midi.Output
): MidiDeviceDetails[] => {
  const numInputs = midiInterface.getPortCount();

  const portNumbers = Array(numInputs)
    .fill(0)
    .map((i, index) => index);

  return portNumbers.map((i) => {
    const name = midiInterface.getPortName(i);
    logger.debug(`device #${i} = ${name}`);
    return {
      port: i,
      name,
    };
  });
};

export const setLoglevel = (
  level: "trace" | "debug" | "info" | "warn" | "error"
) => {
  logger.level = level;
};

export const isExtendedType = (bytes: number[]) => bytes[0] >= 0xf0;

export const shortDescription = (description: MidiDeviceDetails): string =>
  `#${description.port ?? "unknown"}: ${description.name ?? "unknown"}`;
