export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
};

export type Review = {
  id: string;
  user: User;
  rating: number;
  text: string;
  date: string;
};

export type CategoryVersion = {
  id: string;
  date: string;
  changes: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  color?: string;
  icon?: string;
  archived?: boolean;
  versions?: CategoryVersion[];
};

export type ProjectStatus = "draft" | "active" | "completed";

export type Project = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  categoryId?: string;
  status?: ProjectStatus;
  timeline?: string;
  team?: User[];
  author: User;
  reviews: Review[];
  averageRating: number;
};
