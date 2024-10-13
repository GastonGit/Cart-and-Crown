import { z } from "zod";

export const userLoginSchema = z.object({
  token: z.string(),
});

export const userStatusSchema = z.object({
  isAuthenticated: z.boolean(),
});
