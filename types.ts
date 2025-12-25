
export interface CastMember {
  name: string;
  role: string;
  avatar: string;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  poster: string;
  banner: string;
  description: string;
  year: number;
  duration: string;
  country: string;
  genres: string[];
  rating: number;
  cast: CastMember[];
  embedUrl: string;
}

export interface WatchingProgress {
  movieId: string;
  percent: number;
  lastUpdated: number;
}
