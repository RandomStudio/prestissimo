import { DeviceDescription } from "../types";
import { BaseMidiDevice } from "..";
export declare class Input extends BaseMidiDevice {
    constructor(description: DeviceDescription, virtual: boolean);
    protected handleMessage: (deltaTime: number, bytes: number[]) => void;
    private emitReady;
}
