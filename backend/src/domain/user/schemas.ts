import { extendZodWithOpenApi } from "zod-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const signupUsernameSchema = z
  .string({ invalid_type_error: "Username must be a string" })
  .refine((v) => /^[^\s]*$/g.test(v || ""), "Username can not contain spaces")
  .refine(
    (v) => /^[a-z0-9\s]*$/g.test(v || ""),
    "Username must be lowercase letters and numbers only"
  )
  .openapi({
    description:
      "Name of the user. Only lowercase letters and numbers are allowed",
    example: "john",
  });

export const signupPasswordSchema = z
  .string({ invalid_type_error: "Password must be a string" })
  .min(8, "Password must be at least 8 characters long")
  .openapi({
    description: "Password of the user",
    example: "hunter22",
  });

export const userSignupRequestSchema = z.object({
  username: signupUsernameSchema,
  password: signupPasswordSchema,
});

export const userLoginRequestSchema = z.object({
  username: signupUsernameSchema,
  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .openapi({
      description: "Password of the user",
      example: "hunter22",
    }),
});

export const userLoginResponseSchema = z.object({
  token: z.string({ invalid_type_error: "Token must be a string" }).openapi({
    description: "Bearer token requests requiring user authentication",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MjU4MTU0NjIsImV4cCI6MTcyNTgxOTA2Mn0.vdFohh35toSN2hdV3dD-ro8EmWUWKynYQgX26VMq4Bc",
  }),
});
