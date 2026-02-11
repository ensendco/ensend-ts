export type HttpClientOptions = {
  method: "POST" | "GET";
  path: string;
  body: Record<string, any>;
};

export type HttpClientResponse<T = undefined> = {
  message: string;
  statusCode: number;
  data: T;
} | null;

export type HttpClientError = {
  message: string;
  statusCode: number;
} | null;

export type HttpClient = <T extends HttpClientResponse<Record<string, any>>>(
  body: HttpClientOptions,
) => Promise<{
  data: T;
  error: HttpClientError;
}>;

export type ClientOptions<
  I extends readonly string[],
  T extends readonly string[],
> = {
  secret: string;
  identities?: I;
  templates?: T;
};
