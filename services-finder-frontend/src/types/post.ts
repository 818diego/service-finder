export interface PostFormInput {
  title: string;
  description: string;
  images: string[];
}

export interface PostResponse {
  portfolio: string;
  title: string;
  description: string;
  images: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
