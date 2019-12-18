"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const midi_1 = __importDefault(require("midi"));
const events_1 = require("events");
const types_1 = require("../types");
const __1 = require("../");
class Output extends events_1.EventEmitter {
    constructor(description, virtual = false) {
        super();
        this.send = (name, payload) => {
            __1.logger.debug("request to send", name, payload);
            const bytes = exports.messageToBytes({ name, payload });
            this.midi.sendMessage(bytes);
        };
        this.getName = () => this.device.name;
        this.getPort = () => this.device.port;
        this.getDevice = () => this.device;
        this.emitReady = () => {
            setTimeout(() => {
                this.emit("ready", this.device);
            });
        };
        this.midi = new midi_1.default.output();
        const { name, port } = description;
        if (virtual) {
            this.midi.openVirtualPort(name);
            this.device = { name };
            this.emitReady();
        }
        else {
            if (name === undefined && port === undefined) {
                throw Error("you must define either a name or a portNumber for MIDI Output Device");
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
        }
    }
}
exports.Output = Output;
exports.messageToBytes = (msg) => {
    // tslint:disable-next-line: prefer-const
    let bytes = [];
    if (exports.isNormalMessage(msg.name)) {
        const { channel } = msg.payload;
        bytes.push(exports.channelBytes(msg.name, channel));
    }
    if (exports.isNoteMessage(msg.name)) {
        const note = msg.payload;
        bytes.push(note.note);
        bytes.push(note.velocity);
    }
    if (msg.name === types_1.MessageTypeName.controlChange) {
        const c = msg.payload;
        bytes.push(c.controller);
        bytes.push(c.value);
    }
    return bytes;
};
exports.isNormalMessage = (name) => name === "noteOff" ||
    name === "noteOn" ||
    name === "polyphonicKeyPressure" ||
    name === "controlChange" ||
    name === "programChange" ||
    name === "channelPressure" ||
    name === "pitchBend";
exports.channelBytes = (typeName, channel) => {
    const hexValue = types_1.MessageType[typeName];
    return (hexValue << 4) + channel;
};
exports.isNoteMessage = (typeName) => typeName === types_1.MessageTypeName.noteOn || typeName === types_1.MessageTypeName.noteOff;
//# sourceMappingURL=Output.js.map