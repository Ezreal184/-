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

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isAI?: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  status: 'online' | 'offline' | 'climbing';
  isAI?: boolean;
}
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  postId: string;
  parentId?: string;
  content: string;
  likesCount: number;
  createdAt: string;
  replies?: Comment[];
}