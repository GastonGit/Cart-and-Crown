import {
  userLoginRequestSchema,
  userLoginResponseSchema,
  userSignupRequestSchema,
  userStatusRequestSchema,
  userStatusResponseSchema,
} from "../user/schemas";
import {
  routeUserLogin,
  routeUserSignup,
  routeUserStatus,
} from "../router/routes";
import { createDocument } from "zod-openapi";
import "zod-openapi/extend";

const openApiDocument = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Backend API",
    version: "1.0.0",
  },
  paths: {
    [routeUserSignup.path]: {
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
    [routeUserLogin.path]: {
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
    [routeUserStatus.path]: {
      post: {
        requestBody: {
          content: {
            "application/json": { schema: userStatusRequestSchema },
          },
        },
        responses: {
          "200": {
            description: "User status properties such as authentication",
            content: {
              "application/json": { schema: userStatusResponseSchema },
            },
          },
        },
      },
    },
  },
});

export default openApiDocument;
