export interface GetUserProfileResponse {
  publicName: string;
  email: string;
  emailIsVerified: boolean;
  emailPublicKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  email: string;
  publicName: string;
  emailPublicKey: string;
}
