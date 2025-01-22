export interface User {
  id: string;
  username: string;
  avatar: string;
  followers: number;
  following: number;
}

export interface VideoComment {
  id: string;
  text: string;
  user: User;
  createdAt: Date;
  likes: number;
}

export interface Video {
  id: string;
  url: string;
  caption: string;
  creator: User;
  likes: number;
  comments: number;
  shares: number;
}
