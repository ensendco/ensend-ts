import type { HttpClient, HttpClientResponse } from "../lib/types";

export class SendApi<
  const I extends readonly string[],
  const T extends readonly string[],
> {
  constructor(private http: HttpClient) {}
  /**
   * This API method creates and sends a new mail message or notification.
   * @example
   * const ensend = new Client({...})
   * await ensend.SendApi.SendMailMessage({
   *   subject: "Hello Ensend!",
   *   sender: "noreply@ensend.co",
   *   recipients: "tenotea@smtpexpress.com"
   *   message: "<i>reach your customers wherever they are</i>",
   *   attachments: [{
   *     name: "Attachment.pdf",
   *     content?: "data:application/pdf;base64,..."
   *     url?: "https://link-to-file.pdf"
   *   }]
   * });
   * @see {@link https://docs.ensend.co/send/mail-message | More in the documentation}
   */
  async SendMailMessage(dto: TSendApi.SendMailMessageDto<I, T>) {
    return this.http<TSendApi.SendMailMessageResponse>({
      method: "POST",
      path: "/send/mail",
      body: dto,
    });
  }

  /**
   * This API method Creates and sends a new mail broadcast.
   * @example
   * const ensend = new Client({...})
   * await ensend.SendApi.SendMailBroadcast({
   *   subject: "{{profile.firstName}}, Welcome to Ensend!",
   *   sender: "noreply@ensend.co",
   *   recipients: ["tenotea@smtpexpress.com"]
   *   message: "<i>reach your customers wherever they are</i>",
   *   attachments: [{
   *     name: "Attachment.pdf",
   *     content?: "data:application/pdf;base64,..."
   *     url?: "https://link-to-file.pdf"
   *   }]
   * });
   * @see {@link https://docs.ensend.co/send/mail-broadast | More about personalization in the documentation}
   */
  async SendMailBroadcast(dto: TSendApi.SendMailBroadcastDto<I, T>) {
    return this.http<TSendApi.SendMailBroadcastResponse>({
      method: "POST",
      path: "/send/mail/broadast",
      body: dto,
    });
  }

  /**
   * This API method sends a mail message to new recipients in a broadcast.
   * @example
   * const ensend = new Client({...})
   * await ensend.SendApi.SendExistingMailBroadcast({
   *   broadcastRef: "ref of a previously created broadcast",
   *   // new recipients to deliver to
   *   recipients: ["tenotea@smtpexpress.com"]
   * });
   * // No other modifications can me made to a previously processed broadcast.
   * @see {@link https://docs.ensend.co/send/mail-broadcast | More in the documentation}
   */
  async SendExistingMailBroadcast(dto: TSendApi.SendExistingMailBroadcastDto) {
    return this.http<TSendApi.SendMailBroadcastResponse>({
      method: "POST",
      path: "/send/mail/broadast",
      body: dto,
    });
  }
}

export namespace TSendApi {
  type RequiresAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
  > &
    {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

  export type SendMailMessageDto<
    I extends readonly string[] = [],
    T extends readonly string[] = [],
  > = {
    subject: string;
    sender:
      | I[number]
      | {
          name?: string;
          address: I[number];
        };
    recipients:
      | string
      | string[]
      | {
          name?: string;
          address: string;
        }
      | Array<{
          name?: string;
          address: string;
        }>;
    replyAddress?: string;
    attachments?: Array<
      { name: string } & RequiresAtLeastOne<
        { url: string; content: string },
        "content" | "url"
      >
    >;
    invitation?: {
      title: string;
      startDate: Date;
      endDate: Date;
      url?: string | null;
      description?: string | null;
      location?: string | null;
    };
    options?: {
      acquiringAudience?: string | null;
      storeContent?: boolean | null;
    } | null;
  } & RequiresAtLeastOne<
    {
      message: string;
      template: {
        id: T[number];
        variables?: Record<string, string>;
      };
    },
    "message" | "template"
  >;

  export type SendMailMessageResponse = HttpClientResponse<{
    ref: string;
  }>;

  export type SendMailBroadcastDto<
    I extends readonly string[] = [],
    T extends readonly string[] = [],
  > = {
    subject: string;
    sender:
      | I[number]
      | {
          name?: string;
          address: I[number];
        };
    replyAddress?: string;
    attachments?: Array<
      { name: string } & RequiresAtLeastOne<
        { url: string; content: string },
        "content" | "url"
      >
    >;
    invitation?: {
      title: string;
      startDate: Date;
      endDate: Date;
      url?: string | null;
      description?: string | null;
      location?: string | null;
    };
    options?: {
      acquiringAudience?: string | null;
      scheduleFor?: string | null;
      storeContent?: boolean | null;
    } | null;
  } & RequiresAtLeastOne<
    {
      message: string;
      template: {
        id: T[number];
        variables?: Record<string, string>;
      };
    },
    "message" | "template"
  > &
    RequiresAtLeastOne<{
      recipients:
        | string
        | string[]
        | {
            name?: string;
            address: string;
          }
        | Array<{
            name?: string;
            address: string;
          }>;
      audience: string[];
    }>;

  export type SendExistingMailBroadcastDto = {
    broadcastRef: string;
    recipients?:
      | string
      | string[]
      | {
          name?: string;
          address: string;
        }
      | Array<{
          name?: string;
          address: string;
        }>;
  };

  export type SendMailBroadcastResponse = HttpClientResponse<{
    broadcast: {
      ref: string;
      status: string;
    };
  }>;
}
