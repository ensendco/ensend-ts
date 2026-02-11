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

export type HttpClient = <T extends Record<string, any>>(
  body: HttpClientOptions,
) => Promise<{
  data: HttpClientResponse<T>;
  error: HttpClientResponse;
}>;

export type ClientOptions<
  I extends readonly string[],
  T extends readonly string[],
> = {
  secret: string;
  identities?: I;
  templates?: T;
};
