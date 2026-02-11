import type { HttpClient, HttpClientResponse } from "../lib/types";

export class AudienceApi {
  constructor(private http: HttpClient) {}

  async CreateProfile(dto: TAudienceApi.CreateProfileDto) {
    return this.http<TAudienceApi.CreateProfileResponse>({
      body: dto,
      method: "POST",
      path: "/project/audience/profile/create",
    });
  }
}

export namespace TAudienceApi {
  export type CreateProfileDto = {
    audienceId: string;
    name: string;
    identity: string;
    sendConsentEmail: boolean;
  };

  export type CreateProfileResponse = HttpClientResponse<{
    profile: {
      ref: string;
      name: string;
      identity: string;
      type: string;
      status: string;
      createdAt: string;
    };
  }>;
}
