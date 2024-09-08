import {
  userLoginRequestSchema,
  userLoginResponseSchema,
} from "../user/schemas";
import { createDocument } from "zod-openapi";
import "zod-openapi/extend";

const openApiDocument = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Backend API",
    version: "1.0.0",
  },
  paths: {
    "/api/v1/login": {
      post: {
        requestBody: {
          content: {
            "application/json": { schema: userLoginRequestSchema },
          },
        },
        responses: {
          "200": {
            description: "Successful login",
            content: {
              "application/json": { schema: userLoginResponseSchema },
            },
          },
          "401": {
            description: "Invalid username or password",
          },
        },
      },
    },
  },
});

export default openApiDocument;
