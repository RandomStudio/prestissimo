import { Output } from "./Output";

export class OutputVirtual extends Output {
  constructor(name: string) {
    super({ name }, true);
  }
}
