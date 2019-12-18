import { Input } from "./Input";
import { InputVirtual } from "./InputVirtual";

describe("virtual inputs", () => {
  test("create virtual input", () => {
    const input = new InputVirtual("myVirtualDevice");

    expect(input).toBeDefined();
    expect(input.getName()).toBe("myVirtualDevice");

    input.close();
  });
});
