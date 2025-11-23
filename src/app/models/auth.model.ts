// src/app/models/auth.model.ts
export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  expiresAt: Date;
}
