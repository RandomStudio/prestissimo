"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Output_1 = require("./Output");
const OutputVirtual_1 = require("./OutputVirtual");
describe("virtual outputs", () => {
    const output = new OutputVirtual_1.OutputVirtual("virtualOutputDevice");
    expect(output).toBeDefined();
    expect(output.getName()).toBe("virtualOutputDevice");
    expect(output.getPort()).toBeUndefined();
});
describe("messages to bytes", () => {
    test("noteOn middle C", () => {
        const msg = {
            name: "noteOn",
            payload: {
                note: 60,
                velocity: 105,
                channel: 0
            }
        };
        const bytes = Output_1.messageToBytes(msg);
        expect(bytes).toEqual([144, 60, 105]);
    });
    test("noteOff middle C", () => {
        const msg = {
            name: "noteOff",
            payload: {
                note: 60,
                velocity: 47,
                channel: 0
            }
        };
        const bytes = Output_1.messageToBytes(msg);
        expect(bytes).toEqual([128, 60, 47]);
    });
});
//# sourceMappingURL=output.test.js.map