import { ZodError, ZodSchema } from "zod";

export async function parseBody<T>(
  res: Response,
  schema: ZodSchema<T>
): Promise<T> {
  const body = await res.json();
  const parsedBody = schema.safeParse(body);
  if (parsedBody.success) {
    return parsedBody.data;
  }

  const messages = getZodErrorMessages(parsedBody.error);
  if (!messages) {
    console.log(`No error message for parsedBody: ${parsedBody}`);
  }
  throw new Error(messages || "Something went wrong, please try again later.");
}

function getZodErrorMessages(err: ZodError) {
  return err.issues.map((v) => v.message).join(" - ");
}
