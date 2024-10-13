import { userLoginSchema, userStatusSchema } from "./schemas";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "../../../cookie";
import { parseBody } from "../../util";

const env = import.meta.env;
const BASE_URL = env.VITE_API_BASE_URL;
const USER_LOGIN_URL = `${BASE_URL}${env.VITE_API_USER_LOGIN}`;
const USER_STATUS_URL = `${BASE_URL}${env.VITE_API_USER_STATUS}`;

async function getToken(username: string, password: string): Promise<string> {
  const response = await fetch(USER_LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const body = await parseBody(response, userLoginSchema);
    return body.token;
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

function useAuth() {
  return useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: async (): Promise<boolean> => {
      const token = getCookie("authToken");
      if (!token) {
        return false;
      }

      const response = await fetch(USER_STATUS_URL, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          token,
        }),
      });

      if (response.ok) {
        const body = await parseBody(response, userStatusSchema);
        return body.isAuthenticated;
      }

      const errorMessage = await response.text();
      throw new Error(errorMessage);
    },
  });
}

export default {
  useAuth,
  getToken,
};
