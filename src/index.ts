// External modules
import midi from "midi";
import { getLogger } from "log4js";
import rc from "rc";
import parse from "parse-strings-in-object";

import {
  MidiDevice,
  DeviceFilter,
  ExtendedType,
  MessageType,
  RawMessage,
  NoteMessage,
  ControlChangeMessage,
  MidiMessageEvent,
  MessageTypeName
} from "./types";

import defaults from "./config/defaults";
import { Config } from "./config/types";

const config: Config = parse(rc("prestissimo", defaults));

export const logger = getLogger("prestissimo");
logger.level = config.loglevel;

export * from "./input";
export * from "./output";

export const findMatch = (
  midiInterface: typeof midi.Input | typeof midi.Output,
  filter: DeviceFilter
): MidiDevice =>
  filter.name !== undefined
    ? matchByName(midiInterface, filter.name)
    : listPorts(midiInterface)[filter.port];

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
        payload: note
      };
    case MessageType.controlChange:
      const c: ControlChangeMessage = getControlChange(bytes);
      return {
        name: getNameFromType(messageType),
        payload: c
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
  velocity: bytes[2]
});

export const getControlChange = (bytes: number[]): ControlChangeMessage => ({
  channel: getChannel(bytes),
  controller: bytes[1],
  value: bytes[2]
});

export const getChannel = (bytes: number[]): number => bytes[0] & 0xf;

export const matchByName = (
  midiInterface: typeof midi.Input | typeof midi.Output,
  name: string,
  exact = false
): MidiDevice => {
  const ports = listPorts(midiInterface);
  return exact
    ? ports.find(i => i.name === name)
    : ports.find(i => i.name.includes(name));
};

export const listPorts = (
  midiInterface: typeof midi.Input | typeof midi.Output
): MidiDevice[] => {
  const numInputs = midiInterface.getPortCount();

  const portNumbers = Array(numInputs)
    .fill(0)
    .map((i, index) => index);

  return portNumbers.map(i => {
    const name = midiInterface.getPortName(i);
    logger.debug(`device #${i} = ${name}`);
    return {
      port: i,
      name
    };
  });
};

export const setLoglevel = (
  level: "trace" | "debug" | "info" | "warn" | "error"
) => {
  logger.level = level;
};

export const isExtendedType = (bytes: number[]) => bytes[0] >= 0xf0;
