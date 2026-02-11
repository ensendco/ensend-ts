import fetch from "node-fetch-native";
import { SendApi } from "./apis/SendApi";
import type {
  ClientOptions,
  HttpClientOptions,
  HttpClientError,
} from "./lib/types";

export class Client<
  const I extends readonly string[],
  const T extends readonly string[],
> {
  private ENSEND_BASE_URL =
    typeof process !== "undefined"
      ? process.env.ENSEND_BASE_URL
      : "https://api.ensend.co";
  private PROJECT_SECRET =
    typeof process !== "undefined"
      ? process?.env?.ENSEND_PROJECT_SECRET
      : undefined;

  constructor(options?: ClientOptions<I, T>) {
    if (options?.secret) {
      this.PROJECT_SECRET = options.secret;
    }
  }

  private http = async (options: HttpClientOptions) => {
    let data: any = null;
    let error: any = null;

    await fetch(this.ENSEND_BASE_URL + options.path, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.PROJECT_SECRET}`,
      },
      method: options.method,
      body:
        options.method === "POST" ? JSON.stringify(options.body) : undefined,
    })
      .then(async (res) => {
        const responseData = await res.json();
        if (res.status === 200) {
          data = responseData;
        } else {
          error = responseData;
        }
      })
      .catch((error) => {
        error = {
          message: error.message,
          statusCode: 500,
        };
      });

    return { data, error };
  };

  SendApi = new SendApi<I, T>(this.http);
}

export type EnsendError = HttpClientError;
export type { TSendApi as SendApi } from "./apis/SendApi";
