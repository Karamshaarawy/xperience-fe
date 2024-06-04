"use client";
import axios from "axios";
import { ResponseType } from "axios";

const baseUrl = "https://impressive-domini-royals-1be52931.koyeb.app/";

export function setAuthorizationToken(token?: string) {
  if (token) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE5Nzc3Mjg4LCJpYXQiOjE3MTcxODUyODgsImp0aSI6ImZlODRjYzE5OGUwMDQxYzliMzhlMjIwNTE5MTkwOWVlIiwidXNlcl9pZCI6MX0.W9wVLza1_C2YMzjtskiv-2EJNe_X7cozPYYFvm59ktc`;
    return;
  }
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("currentUser") as string);
    const userToken = user?.access;
    if (userToken) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE5Nzc3Mjg4LCJpYXQiOjE3MTcxODUyODgsImp0aSI6ImZlODRjYzE5OGUwMDQxYzliMzhlMjIwNTE5MTkwOWVlIiwidXNlcl9pZCI6MX0.W9wVLza1_C2YMzjtskiv-2EJNe_X7cozPYYFvm59ktc`;
    } else {
      axios.defaults.headers.common["Authorization"] = null;
    }
  }
  return;
}
setAuthorizationToken();

export function handelBaseUrl(path: string) {
  if (path.includes("auth")) {
    return baseUrl + path;
  }
  //  else if (path.includes("dashboard")) {
  //   return `${baseUrl}api/${path}`;
  // }
  else {
    return `${baseUrl}api/${path}`;
  }
}
export function GetReq(path: string) {
  setAuthorizationToken();
  const res = axios
    .create({ baseURL: baseUrl })
    .get(handelBaseUrl(path))
    .catch(handelErrors);
  return res;
}
export function GetByIdReq(path: string) {
  setAuthorizationToken();
  const res = axios
    .create({ baseURL: baseUrl })
    .get(handelBaseUrl(path))
    .catch(handelErrors);

  return res;
}

export function GetByResType(
  path: string,
  responseType: ResponseType | undefined
) {
  setAuthorizationToken();
  const res = axios
    .create({ baseURL: baseUrl })
    .get(handelBaseUrl(path), { responseType: responseType })
    .catch(handelErrors);

  return res;
}

export function PostReq(path: string, body: any) {
  setAuthorizationToken();
  const res = axios
    .create({ baseURL: baseUrl })
    .post(handelBaseUrl(path), body)
    .catch(handelErrors);
  return res;
}

export function PutReq(path: string, body: any) {
  setAuthorizationToken();
  const res = axios
    .create({ baseURL: baseUrl })
    .put(handelBaseUrl(path), body)
    .catch(handelErrors);

  return res;
}

export function PatchReq(path: string, body: any) {
  setAuthorizationToken();
  const res = axios
    .create({ baseURL: baseUrl })
    .patch(handelBaseUrl(path), body)
    .catch(handelErrors);
  return res;
}

export function DeleteReq(path: string) {
  const res = axios
    .create({ baseURL: baseUrl })
    .delete(handelBaseUrl(path))
    .catch(handelErrors);

  return res;
}

export function handelErrors(err: any) {
  if (err.response?.status == 404) {
    //window.location.href = "/404";
  } else if (
    err.response?.data?.errors[0]?.code === "not_authenticated" ||
    err.response?.data?.errors[0]?.code === "token_not_valid" ||
    err.response?.data?.errors[0]?.code === "authentication_failed"
  ) {
    localStorage.removeItem("currentUser");
    window.location.href = "/auth/login";
  }
  return err.response?.data;
}
