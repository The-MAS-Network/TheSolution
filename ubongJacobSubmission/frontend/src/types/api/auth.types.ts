import { GenericAPIResponse } from ".";

export interface LoginRequest {
  lightningAddress: string;
  password: string;
}

export interface RegisterRequest {
  lightningAddress: string;
  password: string;
  nickName: string;
}

export interface NickNameRequest {
  nickname: string;
}

export interface UserData {
  id: string;
  lightningAddress: string;
  isVerified: boolean;
  nickName: string;
  imageURL: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LoginData extends UserData {
  token: string;
}

export interface LoginResponse extends GenericAPIResponse {
  data: LoginData;
}

export interface RegisterResponse extends GenericAPIResponse {
  data: UserData;
}
