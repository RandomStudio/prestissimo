"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InputVirtual_1 = require("./InputVirtual");
describe("virtual inputs", () => {
    test("create virtual input", () => {
        const input = new InputVirtual_1.InputVirtual("myVirtualDevice");
        expect(input).toBeDefined();
        expect(input.getName()).toBe("myVirtualDevice");
    });
});
//# sourceMappingURL=input.test.js.map