import { Input } from "./Input";

export class InputVirtual extends Input {
  constructor(name: string) {
    super({ name }, true);
  }
}
