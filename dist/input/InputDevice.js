"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Input_1 = require("./Input");
class InputDevice extends Input_1.Input {
    constructor(filter) {
        const { name, port } = filter;
        super({ name, port }, false);
    }
}
exports.InputDevice = InputDevice;
//# sourceMappingURL=InputDevice.js.map