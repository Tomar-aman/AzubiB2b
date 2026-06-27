import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import urlcat from "urlcat";

interface ResponseType {
  status: number;
  message: string;
  data: any | null;
}
// Check for required environment variable
if (process.env.NEXT_PUBLIC_API_BASE_URL === undefined) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

export function exists(json: any, key: string) {
  const value = json[key];
  return value !== undefined;
}
export class BaseAPI {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    this.axiosInstance = axios.create({
      baseURL: urlcat(this.baseUrl, "/api"),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  protected async request(config: AxiosRequestConfig) {
    try {
      if (!config.headers) {
        config.headers = {};
      }
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "multipart/form-data";
      }
      if (tokenStore.getRequestHeaderToken()) {
        config.headers["Authorization"] =
          `Bearer ${tokenStore.getRequestHeaderToken()}`;
      }
      const response: any = await this.axiosInstance.request({ ...config });
      return {
        remote: "success",
        data: response.data,
      };
    } catch (error: any) {
      console.log(error);
      const status = error.status;
      if (typeof window !== "undefined" && status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
      if (error.response) {
        const axiosError = error as AxiosError<ResponseType>;
        let errorMessage = axiosError.response?.data?.message;
        const errorCode = axiosError.response?.status;
        let errorData = axiosError.response?.data?.data;
        if (errorMessage === undefined) {
          errorMessage = "Something went wrong";
        }
        if (errorData === undefined) {
          errorData = null;
        }
        return {
          remote: "failure",
          error: {
            status: errorCode,
            errors: {
              message: errorMessage,
              data: errorData,
            },
          },
        };
      }
      throw error;
    }
  }
}

class TokenStore {
  nativeToken: null | string = null;

  getRequestHeaderToken = (tokenOverride?: string) =>
    tokenOverride
      ? tokenOverride
      : process.env.IS_REACT_NATIVE
        ? this.nativeToken
        : typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : undefined;
}

export const tokenStore = new TokenStore();
