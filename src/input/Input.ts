import midi from "midi";
import { RawMessage, MidiMessageEvent, DeviceDescription } from "../types";
import {
  findMatch,
  logger,
  getMessageType,
  getMessageEvent,
  BaseMidiDevice
} from "..";

export class Input extends BaseMidiDevice {
  constructor(description: DeviceDescription, virtual: boolean) {
    super();
    this.midi = new midi.input();
    const { name, port } = description;
    if (virtual) {
      if (name === undefined) {
        throw Error("you must define a name for a virtual MIDI Input Device");
      }
      this.midi.openVirtualPort(name);
      this.device = { name, port };
      this.emitReady();
    } else {
      if (name === undefined && port === undefined) {
        throw Error(
          "you must define either a name or a portNumber for MIDI Input Device, if not a virtual device"
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
    } // if not virtual

    this.midi.on("message", this.handleMessage);
  }

  protected handleMessage = (deltaTime: number, bytes: number[]) => {
    logger.debug("handleMessage:", deltaTime, bytes);
    const rawPayload: RawMessage = {
      deltaTime,
      bytes,
      deviceName: this.device.name
    };
    this.emit("rawMessage", rawPayload);

    const messageType = getMessageType(bytes);

    const e: MidiMessageEvent = getMessageEvent(messageType, bytes);

    this.emit(e.name, e.payload);
  };
}
