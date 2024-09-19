import { securePassword } from "../../../src/domain/user/securePassword";
import * as bcrypt from "bcryptjs";

jest.mock("bcryptjs");

describe("securePassword", () => {
  it("should produce an output different from the input", async () => {
    const password = "hunter2";
    const securedPassword = await securePassword(password);
    expect(securedPassword).not.toBe(password);
  });
  it('should produce a "hashed" password', async () => {
    const password = "hunter2";
    const hashedPassword = "abc123";

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const securedPassword = await securePassword(password);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(securedPassword).toBe(hashedPassword);
  });
});
