
export interface Post {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  altText: string;
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  stats: {
    climbs: number;
    followers: string;
    following: number;
  };
  avatarUrl: string;
  bannerUrl: string;
}

export enum TabType {
  POSTS = 'posts',
  TRAILS = 'trails',
  GEAR = 'gear'
}
