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

  // REORDER CHANGE: current saved photo position in lookbook.
  displayOrder: number;
}

// REORDER CHANGE: ids in the exact order selected in admin panel.
export interface PhotoOrderUpdateRequest {
  photoIds: number[];
}

// CMS TEXT: teksty strony jako key/value.
export interface PageContentResponse {
  key: string;
  value: string;
}
