import midi from "midi";
import { EventEmitter } from "events";
import {
  ValidPayloadTypes,
  MessageTypeName,
  MidiMessageEvent,
  MessageType,
  ControlChangeMessage,
  NoteMessage,
  MidiDevice,
  DeviceDescription
} from "../types";
import { findMatch, logger, BaseMidiDevice } from "../";

export class Output extends BaseMidiDevice {
  protected midi: typeof midi.Input;
  protected device: MidiDevice;

  constructor(description: DeviceDescription, virtual = false) {
    super();
    this.midi = new midi.output();

    const { name, port } = description;
    if (virtual) {
      this.midi.openVirtualPort(name);
      this.device = { name };
      this.emitReady();
    } else {
      if (name === undefined && port === undefined) {
        throw Error(
          "you must define either a name or a portNumber for MIDI Output Device"
        );
      }

      const match = findMatch(this.midi, description);

      if (match === undefined) {
        logger.error("could not find MIDI device matching filter", {
          name,
          port
        });
        throw Error("could not find midi device");
      }

      this.device = match;

      logger.info("found matching MIDI device:", match);

      this.midi.openPort(match.port);
      this.emitReady();
    }
  }

  public send = (name: MessageTypeName, payload: ValidPayloadTypes) => {
    logger.debug("request to send", name, payload);
    const bytes = messageToBytes({ name, payload });
    this.midi.sendMessage(bytes);
  };

  public getName = () => this.device.name;
  public getPort = () => this.device.port;

  public getDevice = () => this.device;

  private emitReady = () => {
    setTimeout(() => {
      this.emit("ready", this.device);
    });
  };
}

export const messageToBytes = (msg: MidiMessageEvent): number[] => {
  // tslint:disable-next-line: prefer-const
  let bytes = [];
  if (isNormalMessage(msg.name)) {
    const { channel } = msg.payload as ControlChangeMessage & NoteMessage;
    bytes.push(channelBytes(msg.name, channel));
  }
  if (isNoteMessage(msg.name)) {
    const note = msg.payload as NoteMessage;
    bytes.push(note.note);
    bytes.push(note.velocity);
  }
  if (msg.name === MessageTypeName.controlChange) {
    const c = msg.payload as ControlChangeMessage;
    bytes.push(c.controller);
    bytes.push(c.value);
  }
  return bytes;
};

export const isNormalMessage = (name: MessageTypeName) =>
  name === "noteOff" ||
  name === "noteOn" ||
  name === "polyphonicKeyPressure" ||
  name === "controlChange" ||
  name === "programChange" ||
  name === "channelPressure" ||
  name === "pitchBend";

export const channelBytes = (typeName: MessageTypeName, channel: number) => {
  const hexValue = MessageType[typeName];
  return (hexValue << 4) + channel;
};

export const isNoteMessage = (typeName: MessageTypeName) =>
  typeName === MessageTypeName.noteOn || typeName === MessageTypeName.noteOff;
