import { Output } from "./Output";
import { DeviceDescription } from "../types";

export class OutputDevice extends Output {
  constructor(filter: DeviceDescription) {
    super(filter, false);
  }
}
