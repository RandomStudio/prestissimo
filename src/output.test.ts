import { MidiMessageEvent, MessageTypeName } from "./types";
import { messageToBytes } from ".";

describe("messages to bytes", () => {
  test("noteOn middle C", () => {
    const msg: MidiMessageEvent = {
      name: "noteOn" as MessageTypeName,
      payload: {
        note: 60,
        velocity: 105,
        channel: 0
      }
    };
    const bytes = messageToBytes(msg);
    expect(bytes).toEqual([144, 60, 105]);
  });

  test("noteOff middle C", () => {
    const msg: MidiMessageEvent = {
      name: "noteOff" as MessageTypeName,
      payload: {
        note: 60,
        velocity: 47,
        channel: 0
      }
    };
    const bytes = messageToBytes(msg);
    expect(bytes).toEqual([128, 60, 47]);
  });
});
