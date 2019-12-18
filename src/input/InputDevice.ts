import { Input } from "./Input";
import { DeviceDescription } from "../types";

export class InputDevice extends Input {
  constructor(filter: DeviceDescription) {
    const { name, port } = filter;
    super({ name, port }, false);
  }
}
