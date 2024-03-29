import { EventEmitter } from "events";
import { MidiDeviceDetails } from "./types";
import midi from "midi";
import { logger } from ".";

export declare interface BaseMidiDevice {
  // on(event: string, listener: (payload: any) => void): this;
  on(event: "ready", listener: (payload: MidiDeviceDetails) => void): this;
}
export class BaseMidiDevice extends EventEmitter {
  protected midi: typeof midi.Input | typeof midi.Output;
  protected deviceDetails: MidiDeviceDetails;

  constructor() {
    super(); // EventEmitter
  }

  public getName = () => this.deviceDetails.name;
  public getPort = () => this.deviceDetails.port;
  public getDeviceDetails = () => this.deviceDetails;

  public close = () => {
    logger.info("closing MIDI device", this.deviceDetails);
    this.midi.closePort();
  };

  protected emitReady = () => {
    logger.info("opened MIDI device", this.deviceDetails);
    setTimeout(() => {
      this.emit("ready", this.deviceDetails);
    });
  };
}
