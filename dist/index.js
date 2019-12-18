"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = require("log4js");
const rc_1 = __importDefault(require("rc"));
const parse_strings_in_object_1 = __importDefault(require("parse-strings-in-object"));
// Internal modules
const types_1 = require("./types");
// Config
const defaults_1 = __importDefault(require("./config/defaults"));
const events_1 = require("events");
const config = parse_strings_in_object_1.default(rc_1.default("prestissimo", defaults_1.default));
exports.logger = log4js_1.getLogger("prestissimo");
exports.logger.level = config.loglevel;
// export * from "./input/Input";
// export * from "./output";
class BaseMidiDevice extends events_1.EventEmitter {
    constructor() {
        super();
        this.getName = () => this.device.name;
        this.getPort = () => this.device.port;
        this.getDevice = () => this.device;
        this.close = () => {
            exports.logger.warn("closing MIDI input device");
            this.midi.close();
        };
    }
}
exports.BaseMidiDevice = BaseMidiDevice;
exports.findMatch = (midiInterface, filter) => filter.name === undefined
    ? exports.listPorts(midiInterface)[filter.port]
    : exports.matchByName(midiInterface, filter.name);
exports.getMessageEvent = (messageType, bytes) => {
    switch (messageType) {
        case types_1.MessageType.noteOn:
        case types_1.MessageType.noteOff:
            const note = exports.getNote(bytes);
            return {
                name: exports.getNameFromType(messageType),
                payload: note
            };
        case types_1.MessageType.controlChange:
            const c = exports.getControlChange(bytes);
            return {
                name: exports.getNameFromType(messageType),
                payload: c
            };
        default:
            exports.logger.warn("unknown message type");
            return null;
    }
};
exports.getNameFromType = (messageType) => types_1.MessageTypeName[types_1.MessageType[messageType]];
exports.getNameFromExtendedType = (messageType) => types_1.MessageTypeName[types_1.ExtendedType[messageType]];
exports.getMessageType = (bytes) => {
    if (exports.isExtendedType(bytes)) {
        const name = types_1.ExtendedType[bytes[0]];
        return types_1.ExtendedType[name];
    }
    else {
        const name = types_1.MessageType[bytes[0] >> 4];
        return types_1.MessageType[name];
    }
};
exports.getNote = (bytes) => ({
    channel: exports.getChannel(bytes),
    note: bytes[1],
    velocity: bytes[2]
});
exports.getControlChange = (bytes) => ({
    channel: exports.getChannel(bytes),
    controller: bytes[1],
    value: bytes[2]
});
exports.getChannel = (bytes) => bytes[0] & 0xf;
exports.matchByName = (midiInterface, name, exact = false) => {
    const ports = exports.listPorts(midiInterface);
    return exact
        ? ports.find(i => i.name === name)
        : ports.find(i => i.name.includes(name));
};
exports.listPorts = (midiInterface) => {
    const numInputs = midiInterface.getPortCount();
    const portNumbers = Array(numInputs)
        .fill(0)
        .map((i, index) => index);
    return portNumbers.map(i => {
        const name = midiInterface.getPortName(i);
        exports.logger.debug(`device #${i} = ${name}`);
        return {
            port: i,
            name
        };
    });
};
exports.setLoglevel = (level) => {
    exports.logger.level = level;
};
exports.isExtendedType = (bytes) => bytes[0] >= 0xf0;
//# sourceMappingURL=index.js.map