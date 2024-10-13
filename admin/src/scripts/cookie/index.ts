import Cookies from "js-cookie";

export function getCookie(name: string) {
  return Cookies.get(name);
}

export function setCookie(name: string, data: string) {
  return Cookies.set(name, data, { expires: 7 });
}

export function removeCookie(name: string) {
  return Cookies.remove(name);
}
