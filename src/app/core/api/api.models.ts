export interface LoginRequest {
  email: string;
  password: string;
}

export interface AdminCreateRequest {
  email: string;
  password: string;
}

export interface AdminResponse {
  id: number;
  email: string;
}

export interface PhotoResponse {
  id: number;
  imageUrl: string;
}

// CMS TEXT: teksty strony jako key/value.
export interface PageContentResponse {
  key: string;
  value: string;
}
