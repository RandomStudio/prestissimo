"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const midi_1 = __importDefault(require("midi"));
const __1 = require("..");
class Input extends __1.BaseMidiDevice {
    constructor(description, virtual) {
        super();
        this.handleMessage = (deltaTime, bytes) => {
            __1.logger.debug("handleMessage:", deltaTime, bytes);
            const rawPayload = {
                deltaTime,
                bytes,
                deviceName: this.device.name
            };
            this.emit("rawMessage", rawPayload);
            const messageType = __1.getMessageType(bytes);
            const e = __1.getMessageEvent(messageType, bytes);
            this.emit(e.name, e.payload);
        };
        this.emitReady = () => {
            setTimeout(() => {
                this.emit("ready", this.device);
            });
        };
        this.midi = new midi_1.default.input();
        const { name, port } = description;
        if (virtual) {
            if (name === undefined) {
                throw Error("you must define a name for a virtual MIDI Input Device");
            }
            this.midi.openVirtualPort(name);
            this.device = { name, port };
            this.emitReady();
        }
        else {
            if (name === undefined && port === undefined) {
                throw Error("you must define either a name or a portNumber for MIDI Input Device, if not a virtual device");
            }
            const match = __1.findMatch(this.midi, description);
            if (match === undefined) {
                __1.logger.error("could not find MIDI device matching filter", {
                    name,
                    port
                });
                throw Error("could not find midi device");
            }
            this.device = match;
            __1.logger.info("found matching MIDI device:", match);
            this.midi.openPort(match.port);
            this.emitReady();
        } // if not virtual
        this.midi.on("message", this.handleMessage);
    }
}
exports.Input = Input;
//# sourceMappingURL=Input.js.map