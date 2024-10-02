import { ZodError } from "zod";

export function getZodErrorMessages(err: ZodError) {
  return err.issues.map((v) => v.message).join(" - ");
}
