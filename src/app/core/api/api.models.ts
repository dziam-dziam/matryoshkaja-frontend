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
  // CAPTION CHANGE: editable text displayed under the photo.
  caption: string;
  // REORDER CHANGE: current saved photo position in lookbook.
  displayOrder: number;
}

// CAPTION CHANGE: request used when admin edits a photo caption.
export interface PhotoCaptionUpdateRequest {
  caption: string;
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
