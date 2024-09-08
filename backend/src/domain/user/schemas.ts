import { extendZodWithOpenApi } from "zod-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const userLoginRequestSchema = z.object({
  username: z.string().openapi({
    description: "Name of the user",
    example: "John Doe",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .openapi({
      description: "Password of the user",
      example: "hunter2",
    }),
});

export const userLoginResponseSchema = z.object({
  token: z.string().openapi({
    description: "Bearer token requests requiring user authentication",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MjU4MTU0NjIsImV4cCI6MTcyNTgxOTA2Mn0.vdFohh35toSN2hdV3dD-ro8EmWUWKynYQgX26VMq4Bc",
  }),
});
