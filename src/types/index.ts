export type ContentType =
  | 'youtube'
  | 'website'
  | 'article'
  | 'tutorial'
  | 'design'
  | 'development'
  | 'ai_tools'
  | 'video'
  | 'inspiration';

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string;
  description?: string;
  itemCount?: number;
  displayOrder?: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Resource {
  id: string;
  url: string;
  domain: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  faviconUrl?: string;
  contentType: ContentType;
  categoryId?: string;
  tags?: string[];
  isFavorite: boolean;
  isReadLater: boolean;
  isArchived: boolean;
  isReviewed?: boolean;
  personalNotes?: string;
  viewCount: number;
  lastOpenedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // e.g. "10:00 AM"
  categoryId?: string;
  goalId?: string;
  subtasks?: Subtask[];
  tags?: string[];
  createdAt: string;
  completedAt?: string;
}

export type GoalStatus = 'not_started' | 'in_progress' | 'on_hold' | 'completed';

export interface GoalMilestone {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string; // e.g. "Aug 30, 2025" or "2025-08-30"
  progress: number; // 0-100
  status: GoalStatus;
  imageUrl?: string;
  milestones?: GoalMilestone[];
  linkedResourceIds?: string[];
  linkedTaskIds?: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  quote: string;
  bio?: string;
  theme: 'dark' | 'light' | 'system';
}

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  password?: string;
  avatarUrl: string;
  quote?: string;
  createdAt: string;
}

export interface ExtractedMetadata {
  url: string;
  domain: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  faviconUrl: string;
  contentType: ContentType;
  author?: string;
  publishedTime?: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'all-resources'
  | 'favorites'
  | 'collections'
  | 'categories'
  | 'read-later'
  | 'tasks'
  | 'goals'
  | 'recently-viewed'
  | 'archive'
  | 'settings';
