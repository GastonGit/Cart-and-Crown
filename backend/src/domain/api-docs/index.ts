import {
  userLoginRequestSchema,
  userLoginResponseSchema,
  userSignupRequestSchema,
} from "../user/schemas";
import { routeLogin, routeSignup } from "../../globalconfig";
import { createDocument } from "zod-openapi";
import "zod-openapi/extend";

const openApiDocument = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Backend API",
    version: "1.0.0",
  },
  paths: {
    [routeSignup.path]: {
      post: {
        requestBody: {
          content: {
            "application/json": { schema: userSignupRequestSchema },
          },
        },
        responses: {
          "201": {
            description: "Successful signup",
          },
          "400": {
            description: "Invalid username or password",
          },
          "422": {
            description: "Username is taken",
          },
        },
      },
    },
    [routeLogin.path]: {
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
          "400": {
            description: "Incorrect username or password",
          },
        },
      },
    },
  },
});

export default openApiDocument;
