import {
  getMessageType,
  getNote,
  getControlChange,
  getMessageEvent,
  getNameFromType,
  findMatch
} from "./index";
import {
  MessageType,
  MessageTypeName,
  NoteMessage,
  ControlChangeMessage,
  MidiMessageEvent,
  DeviceDescription
} from "./types";

describe("convert types properly from first byte of message", () => {
  test("control change messages", () => {
    const bytes = [177, 7, 72];
    const messageType = getMessageType(bytes);

    expect(messageType).toBe(MessageType.controlChange);
    expect(MessageTypeName.controlChange).toBe("controlChange");
  });

  test("note on messages", () => {
    const bytes = [144, 45, 58];
    const messageType = getMessageType(bytes);
  });

  test("note on messages", () => {
    const bytes = [128, 45, 81];
    const messageType = getMessageType(bytes);

    expect(messageType).toBe(MessageType.noteOff);
    expect(MessageTypeName.noteOff).toBe("noteOff");
  });

  test("pitch bend messages", () => {
    const bytes = [224, 0, 0];
    const messageType = getMessageType(bytes);

    expect(messageType).toBe(MessageType.pitch);
    expect(MessageTypeName.pitch).toBe("pitchBend");
  });
});

describe("names from message type enums", () => {
  test("names", () => {
    const messageType = MessageType.controlChange;
    expect(getNameFromType(messageType)).toBe("controlChange");
  });
});

describe("bytes to message payloads", () => {
  test("middle C noteOn", () => {
    const bytes = [144, 60, 105];
    const messageType = getMessageType(bytes);

    expect(messageType).toBe(MessageType.noteOn);
    expect(MessageTypeName.noteOn).toBe("noteOn");

    const n: NoteMessage = getNote(bytes);
    expect(n.note).toBe(60); // middle C
    expect(n.velocity).toBe(105);
    expect(n.channel).toBeDefined();
    expect(n.channel).toBe(0);
  });

  test("middle C noteOff", () => {
    const bytes = [128, 60, 47];
    const messageType = getMessageType(bytes);

    expect(messageType).toBe(MessageType.noteOff);
    expect(MessageTypeName.noteOff).toBe("noteOff");

    const n: NoteMessage = getNote(bytes);
    expect(n.note).toBe(60); // middle C
    expect(n.velocity).toBe(47);
    expect(n.channel).toBeDefined();
    expect(n.channel).toBe(0);
  });

  test("control change controller 7 channel 0", () => {
    const bytes = [176, 7, 96];
    const messageType = getMessageType(bytes);

    expect(messageType).toBe(MessageType.controlChange);

    const c: ControlChangeMessage = getControlChange(bytes);
    expect(c.channel).toBe(0);
    expect(c.controller).toBe(7);
    expect(c.value).toBe(96);
  });
});

describe("message events", () => {
  test("note message", () => {
    const bytes = [128, 60, 47];
    const messageType = getMessageType(bytes);

    expect(messageType).toBe(MessageType.noteOff);
    expect(MessageTypeName.noteOff).toBe("noteOff");

    const e: MidiMessageEvent = getMessageEvent(messageType, bytes);
    expect(e.name).toBe("noteOff");
  });

  test("control change message", () => {
    const bytes = [177, 7, 83];
    const messageType = getMessageType(bytes);

    expect(messageType).toBe(MessageType.controlChange);

    const e: MidiMessageEvent = getMessageEvent(messageType, bytes);
    expect(e.name).toBe("controlChange");
    // tslint:disable-next-line: no-string-literal
    expect(e.payload["controller"]).toBe(7);
    // tslint:disable-next-line: no-string-literal
    expect(e.payload["value"]).toBe(83);
    // tslint:disable-next-line: no-string-literal
    expect(e.payload["velocity"]).toBeUndefined();
  });
});
