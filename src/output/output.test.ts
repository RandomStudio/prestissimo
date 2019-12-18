import { MidiMessageEvent, MessageTypeName } from "../types";
import { messageToBytes } from "./Output";
import { OutputVirtual } from "./OutputVirtual";

describe("virtual outputs", () => {
  test("create virtual output", () => {
    const output = new OutputVirtual("virtualOutputDevice");

    expect(output).toBeDefined();
    expect(output.getName()).toBe("virtualOutputDevice");
    expect(output.getPort()).toBeUndefined();

    output.close();
  });
});

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
