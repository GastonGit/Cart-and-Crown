import { Route, RouteMethod } from "./schemas";
import * as user from "../user";
import files from "../files";

export const routeUserSignup: Route = {
  path: "/v1/user/signup",
  method: RouteMethod.POST,
  handler: user.signup,
  requiresAuth: false,
};
export const routeUserLogin: Route = {
  path: "/v1/user/login",
  method: RouteMethod.POST,
  handler: user.login,
  requiresAuth: false,
};
export const routeUserStatus: Route = {
  path: "/v1/user/status",
  method: RouteMethod.POST,
  handler: user.status,
  requiresAuth: false,
};

export const routeFilesImageUpload: Route = {
  path: "/v1/files/image/upload",
  method: RouteMethod.POST,
  handler: files.uploadImage,
  requiresAuth: true,
};

export const routes: Route[] = [
  routeUserSignup,
  routeUserLogin,
  routeUserStatus,
  routeFilesImageUpload,
];
