'use client';

import { Resource, Task, Goal, Category, UserProfile, ExtractedMetadata } from '@/types';
import { supabase } from '@/lib/supabase';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-anim', name: 'Animation & Motion', slug: 'animation-motion', color: '#F97316', itemCount: 24, displayOrder: 1 },
  { id: 'cat-3d', name: '3D Websites & Three.js', slug: '3d-websites', color: '#06B6D4', itemCount: 18, displayOrder: 2 },
  { id: 'cat-uiux', name: 'UI/UX Design', slug: 'ui-ux-design', color: '#EC4899', itemCount: 32, displayOrder: 3 },
  { id: 'cat-web', name: 'Web Design Inspiration', slug: 'web-design-inspiration', color: '#10B981', itemCount: 27, displayOrder: 4 },
  { id: 'cat-front', name: 'Frontend Development', slug: 'frontend-development', color: '#3B82F6', itemCount: 45, displayOrder: 5 },
  { id: 'cat-back', name: 'Backend Development', slug: 'backend-development', color: '#EF4444', itemCount: 22, displayOrder: 6 },
  { id: 'cat-ai', name: 'AI Tools', slug: 'ai-tools', color: '#8B5CF6', itemCount: 16, displayOrder: 7 },
  { id: 'cat-tut', name: 'Tutorials & Courses', slug: 'tutorials-courses', color: '#F59E0B', itemCount: 30, displayOrder: 8 },
  { id: 'cat-yt', name: 'YouTube Resources', slug: 'youtube-resources', color: '#E11D48', itemCount: 28, displayOrder: 9 },
  { id: 'cat-art', name: 'Articles & Blogs', slug: 'articles-blogs', color: '#D946EF', itemCount: 19, displayOrder: 10 },
  { id: 'cat-creative', name: 'Creative Coding', slug: 'creative-coding', color: '#14B8A6', itemCount: 12, displayOrder: 11 },
  { id: 'cat-typo', name: 'Typography & Fonts', slug: 'typography-fonts', color: '#6366F1', itemCount: 15, displayOrder: 12 },
  { id: 'cat-icons', name: 'Icons & Illustrations', slug: 'icons-illustrations', color: '#A855F7', itemCount: 14, displayOrder: 13 },
  { id: 'cat-port', name: 'Portfolio Inspiration', slug: 'portfolio-inspiration', color: '#0EA5E9', itemCount: 21, displayOrder: 14 },
  { id: 'cat-biz', name: 'Business & Productivity', slug: 'business-productivity', color: '#64748B', itemCount: 9, displayOrder: 15 },
  { id: 'cat-movie', name: 'Movies & Entertainment', slug: 'movies-entertainment', color: '#F43F5E', itemCount: 11, displayOrder: 16 },
  { id: 'cat-read', name: 'Read Later', slug: 'read-later', color: '#84CC16', itemCount: 8, displayOrder: 17 },
  { id: 'cat-uncat', name: 'Uncategorized', slug: 'uncategorized', color: '#94A3B8', itemCount: 5, displayOrder: 18 },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-sanket-1',
  fullName: 'Sanket Kothiya',
  email: 'sanket@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  quote: 'Collect what inspires you, Build what you dream.',
  theme: 'dark',
};

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'The Future of Web Design in 2025',
    url: 'https://youtube.com/watch?v=webdesign2025',
    domain: 'DesignCourse',
    contentType: 'youtube',
    categoryId: 'cat-web',
    tags: ['Design', 'Future', 'Web'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128',
    description: 'Deep dive into next-gen modern UI interactions, spatial canvases, micro-animations, and AI workflows.',
    isFavorite: true,
    isReadLater: false,
    isArchived: false,
    viewCount: 42,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-2',
    title: 'Best Animated Short Films of All Time',
    url: 'https://yarrlist.net/movies-and-tv-shows',
    domain: 'yarrlist.net',
    contentType: 'website',
    categoryId: 'cat-anim',
    tags: ['Animation', 'Films', 'Art'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=yarrlist.net&sz=128',
    description: 'A curated handpicked list of world-class animation marvels, visual masterpieces, and indie indie gems.',
    isFavorite: true,
    isReadLater: true,
    isArchived: false,
    viewCount: 31,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-3',
    title: 'Three.js Crash Course - Build 3D Websites',
    url: 'https://youtube.com/watch?v=threejscrash',
    domain: 'youtube.com',
    contentType: 'tutorial',
    categoryId: 'cat-3d',
    tags: ['Three.js', 'WebGL', '3D'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128',
    description: 'Master Three.js shaders, lighting, glTF model loaders, orbit controls, and post-processing filters.',
    isFavorite: true,
    isReadLater: false,
    isArchived: false,
    viewCount: 56,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-4',
    title: 'Beautiful 3D Illustrations & Animations',
    url: 'https://lapa.ninja/inspiration/3d',
    domain: 'lapa.ninja',
    contentType: 'inspiration',
    categoryId: 'cat-anim',
    tags: ['Inspiration', '3D', 'VFX'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=lapa.ninja&sz=128',
    description: 'Stunning collection of modern 3D UI landing designs, pastel isometric renders, and Spline exports.',
    isFavorite: false,
    isReadLater: false,
    isArchived: false,
    viewCount: 19,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-5',
    title: 'Modern UI/UX Design Inspiration',
    url: 'https://dribbble.com/shots/popular',
    domain: 'dribbble.com',
    contentType: 'design',
    categoryId: 'cat-uiux',
    tags: ['Design', 'UI', 'UX'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=dribbble.com&sz=128',
    description: 'Trending design shots, glassmorphic dashboards, dark mode systems, and elegant typography.',
    isFavorite: true,
    isReadLater: false,
    isArchived: false,
    viewCount: 47,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-6',
    title: 'React 19 - What\'s New?',
    url: 'https://blog.logrocket.com/react-19',
    domain: 'blog.logrocket.com',
    contentType: 'development',
    categoryId: 'cat-front',
    tags: ['React', 'Frontend', 'Nextjs'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=logrocket.com&sz=128',
    description: 'Comprehensive breakdown of React Server Components, Actions, useOptimistic, and Asset Loading.',
    isFavorite: false,
    isReadLater: true,
    isArchived: false,
    viewCount: 38,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-7',
    title: 'Cinematic Travel Film (4K)',
    url: 'https://youtube.com/watch?v=cinematictravel',
    domain: 'youtube.com',
    contentType: 'video',
    categoryId: 'cat-movie',
    tags: ['Video', 'Cinematography', '4K'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128',
    description: 'Epic cinematography showcase captured across Switzerland alps and Iceland glaciers.',
    isFavorite: false,
    isReadLater: false,
    isArchived: false,
    viewCount: 22,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-8',
    title: 'ChatGPT - The AI Revolution',
    url: 'https://openai.com/blog/chatgpt',
    domain: 'openai.com',
    contentType: 'ai_tools',
    categoryId: 'cat-ai',
    tags: ['AI', 'OpenAI', 'LLM'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&auto=format&fit=crop&q=80',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128',
    description: 'Exploring the boundary of autonomous agents, reasoning models, multimodal vision, and productivity.',
    isFavorite: true,
    isReadLater: false,
    isArchived: false,
    viewCount: 65,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-1',
    title: 'Complete Three.js tutorial',
    description: 'Finish chapters on lighting, shaders and shadows.',
    priority: 'high',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '10:00 AM',
    categoryId: 'cat-3d',
    goalId: 'goal-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk-2',
    title: 'Design portfolio homepage',
    description: 'Draft Figma layouts and interactive hero sections.',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '2:00 PM',
    categoryId: 'cat-uiux',
    goalId: 'goal-3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk-3',
    title: 'Read React documentation',
    description: 'Review compiler optimizations and action hooks.',
    priority: 'low',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '5:00 PM',
    categoryId: 'cat-front',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk-4',
    title: 'Workout 30 minutes',
    description: 'HIIT session & stretching.',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '7:00 PM',
    categoryId: 'cat-biz',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk-5',
    title: 'Refactor metadata extraction pipeline',
    description: 'Ensure SSRF guardrail unit tests pass cleanly.',
    priority: 'high',
    status: 'completed',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '11:00 AM',
    categoryId: 'cat-back',
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Master Three.js',
    description: 'Learn Three.js and build an interactive 3D portfolio',
    targetDate: 'Aug 30, 2025',
    progress: 68,
    status: 'in_progress',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&auto=format&fit=crop&q=80',
    linkedResourceIds: ['res-3', 'res-1'],
    linkedTaskIds: ['tsk-1'],
    milestones: [
      { id: 'm-1', title: 'Learn Scene, Camera & Renderer setup', isCompleted: true },
      { id: 'm-2', title: 'Implement custom shaders & uniforms', isCompleted: true },
      { id: 'm-3', title: 'Import animated glTF models', isCompleted: true },
      { id: 'm-4', title: 'Deploy interactive portfolio scene', isCompleted: false },
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal-2',
    title: 'Learn Animation',
    description: 'Build 5 animated projects with GSAP and Framer Motion',
    targetDate: 'Sep 15, 2025',
    progress: 40,
    status: 'in_progress',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
    linkedResourceIds: ['res-2', 'res-4'],
    milestones: [
      { id: 'm-5', title: 'Master SVG path animations', isCompleted: true },
      { id: 'm-6', title: 'Build scroll-driven timeline transitions', isCompleted: true },
      { id: 'm-7', title: 'Create interactive physics-based cards', isCompleted: false },
    ],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal-3',
    title: 'Build Personal Website',
    description: 'Showcase my work and skills with a high-performance stack',
    targetDate: 'Oct 10, 2025',
    progress: 20,
    status: 'in_progress',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&auto=format&fit=crop&q=80',
    linkedResourceIds: ['res-5', 'res-6'],
    linkedTaskIds: ['tsk-2'],
    milestones: [
      { id: 'm-8', title: 'Design high-fidelity UI in Figma', isCompleted: true },
      { id: 'm-9', title: 'Build responsive components in Next.js', isCompleted: false },
      { id: 'm-10', title: 'Lighthouse 100 score optimization', isCompleted: false },
    ],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_ACCOUNTS = [
  {
    id: 'usr-sanket-1',
    fullName: 'Sanket Kothiya',
    email: 'sanket@gmail.com',
    password: 'password123',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    quote: 'Collect what inspires you, Build what you dream.',
    createdAt: new Date().toISOString(),
  },
];

// LocalStorage Keys
const STORAGE_KEYS = {
  RESOURCES: 'linkvault_resources_v1',
  TASKS: 'linkvault_tasks_v1',
  GOALS: 'linkvault_goals_v1',
  CATEGORIES: 'linkvault_categories_v1',
  USER: 'linkvault_user_v1',
  ACCOUNTS: 'linkvault_accounts_v1',
  SESSION: 'linkvault_session_v1',
};

class StorageManager {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- Resources ---
  getResources(): Resource[] {
    if (!this.isBrowser()) return INITIAL_RESOURCES;
    const data = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
      return INITIAL_RESOURCES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_RESOURCES;
    }
  }

  saveResources(resources: Resource[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  }

  addResource(resourceData: Partial<Resource>): Resource {
    const list = this.getResources();
    const newRes: Resource = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: resourceData.url || '',
      domain: resourceData.domain || '',
      title: resourceData.title || 'Untitled Resource',
      description: resourceData.description || '',
      thumbnailUrl: resourceData.thumbnailUrl || '',
      faviconUrl: resourceData.faviconUrl || '',
      contentType: resourceData.contentType || 'website',
      categoryId: resourceData.categoryId,
      tags: resourceData.tags || [],
      isFavorite: resourceData.isFavorite ?? false,
      isReadLater: resourceData.isReadLater ?? false,
      isArchived: resourceData.isArchived ?? false,
      personalNotes: resourceData.personalNotes || '',
      viewCount: 0,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newRes);
    this.saveResources(list);

    // Sync to Supabase in background
    if (this.isBrowser() && supabase) {
      Promise.resolve(
        supabase
          .from('resources')
          .insert([{
            id: newRes.id,
            url: newRes.url,
            domain: newRes.domain,
            title: newRes.title,
            description: newRes.description,
            thumbnail_url: newRes.thumbnailUrl,
            favicon_url: newRes.faviconUrl,
            content_type: newRes.contentType,
            category_id: newRes.categoryId || null,
            tags: newRes.tags,
            is_favorite: newRes.isFavorite,
            is_read_later: newRes.isReadLater,
            is_archived: newRes.isArchived,
            personal_notes: newRes.personalNotes,
            view_count: newRes.viewCount,
            created_at: newRes.createdAt,
          }])
      )
        .then((res) => {
          if (res?.error && !res.error.message.includes('schema cache')) {
            console.warn('[Supabase Sync] Resource insert notice:', res.error.message);
          }
        })
        .catch(() => {});
    }

    return newRes;
  }

  updateResource(id: string, updates: Partial<Resource>): Resource | null {
    const list = this.getResources();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveResources(list);

    // Sync to Supabase in background
    if (this.isBrowser() && supabase) {
      Promise.resolve(
        supabase
          .from('resources')
          .update({
            title: list[index].title,
            description: list[index].description,
            category_id: list[index].categoryId || null,
            tags: list[index].tags,
            is_favorite: list[index].isFavorite,
            is_read_later: list[index].isReadLater,
            is_archived: list[index].isArchived,
            personal_notes: list[index].personalNotes,
            view_count: list[index].viewCount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
      )
        .then((res) => {
          if (res?.error && !res.error.message.includes('schema cache')) {
            console.warn('[Supabase Sync] Resource update notice:', res.error.message);
          }
        })
        .catch(() => {});
    }

    return list[index];
  }

  deleteResource(id: string): boolean {
    const list = this.getResources();
    const filtered = list.filter((r) => r.id !== id);
    if (filtered.length === list.length) return false;
    this.saveResources(filtered);

    // Sync to Supabase in background
    if (this.isBrowser() && supabase) {
      Promise.resolve(
        supabase
          .from('resources')
          .delete()
          .eq('id', id)
      )
        .then((res) => {
          if (res?.error && !res.error.message.includes('schema cache')) {
            console.warn('[Supabase Sync] Resource delete notice:', res.error.message);
          }
        })
        .catch(() => {});
    }

    return true;
  }

  toggleFavorite(id: string): boolean {
    const list = this.getResources();
    const res = list.find((r) => r.id === id);
    if (!res) return false;
    res.isFavorite = !res.isFavorite;
    this.saveResources(list);
    return res.isFavorite;
  }

  toggleArchive(id: string): boolean {
    const list = this.getResources();
    const res = list.find((r) => r.id === id);
    if (!res) return false;
    res.isArchived = !res.isArchived;
    this.saveResources(list);
    return res.isArchived;
  }

  recordView(id: string): void {
    const list = this.getResources();
    const res = list.find((r) => r.id === id);
    if (res) {
      res.viewCount = (res.viewCount || 0) + 1;
      res.lastOpenedAt = new Date().toISOString();
      this.saveResources(list);
    }
  }

  // --- Tasks ---
  getTasks(): Task[] {
    if (!this.isBrowser()) return INITIAL_TASKS;
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_TASKS;
    }
  }

  saveTasks(tasks: Task[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  addTask(taskData: Partial<Task>): Task {
    const list = this.getTasks();
    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      dueTime: taskData.dueTime || '12:00 PM',
      categoryId: taskData.categoryId,
      goalId: taskData.goalId,
      subtasks: taskData.subtasks || [],
      createdAt: new Date().toISOString(),
    };
    list.unshift(newTask);
    this.saveTasks(list);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const list = this.getTasks();
    const index = list.findIndex((t) => t.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.saveTasks(list);
    return list[index];
  }

  toggleTask(id: string): Task | null {
    const list = this.getTasks();
    const task = list.find((t) => t.id === id);
    if (!task) return null;
    if (task.status === 'completed') {
      task.status = 'todo';
      task.completedAt = undefined;
    } else {
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
    }
    this.saveTasks(list);
    return task;
  }

  deleteTask(id: string): boolean {
    const list = this.getTasks();
    const filtered = list.filter((t) => t.id !== id);
    if (filtered.length === list.length) return false;
    this.saveTasks(filtered);
    return true;
  }

  // --- Goals ---
  getGoals(): Goal[] {
    if (!this.isBrowser()) return INITIAL_GOALS;
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
      return INITIAL_GOALS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_GOALS;
    }
  }

  saveGoals(goals: Goal[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  addGoal(goalData: Partial<Goal>): Goal {
    const list = this.getGoals();
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: goalData.title || 'New Goal',
      description: goalData.description || '',
      targetDate: goalData.targetDate || 'Dec 31, 2025',
      progress: goalData.progress ?? 0,
      status: goalData.status || 'in_progress',
      imageUrl: goalData.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
      milestones: goalData.milestones || [],
      linkedResourceIds: goalData.linkedResourceIds || [],
      linkedTaskIds: goalData.linkedTaskIds || [],
      createdAt: new Date().toISOString(),
    };
    list.unshift(newGoal);
    this.saveGoals(list);
    return newGoal;
  }

  updateGoal(id: string, updates: Partial<Goal>): Goal | null {
    const list = this.getGoals();
    const index = list.findIndex((g) => g.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.saveGoals(list);
    return list[index];
  }

  deleteGoal(id: string): boolean {
    const list = this.getGoals();
    const filtered = list.filter((g) => g.id !== id);
    if (filtered.length === list.length) return false;
    this.saveGoals(filtered);
    return true;
  }

  // --- Categories ---
  getCategories(): Category[] {
    if (!this.isBrowser()) return INITIAL_CATEGORIES;
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  saveCategories(categories: Category[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  addCategory(categoryData: Partial<Category>): Category {
    const list = this.getCategories();
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: categoryData.name || 'New Category',
      slug: (categoryData.name || 'category').toLowerCase().replace(/\s+/g, '-'),
      color: categoryData.color || '#6366F1',
      itemCount: 0,
      displayOrder: list.length + 1,
    };
    list.push(newCat);
    this.saveCategories(list);
    return newCat;
  }

  deleteCategory(id: string): boolean {
    const list = this.getCategories();
    const filtered = list.filter((c) => c.id !== id);
    if (filtered.length === list.length) return false;
    this.saveCategories(filtered);
    return true;
  }

  // --- User Profile & Authentication ---
  getAccounts(): any[] {
    if (!this.isBrowser()) return INITIAL_ACCOUNTS;
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ACCOUNTS;
    }
  }

  saveAccounts(accounts: any[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }

  getCurrentSession(): UserProfile | null {
    if (!this.isBrowser()) return null;
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!session || session === 'logged_out') {
      return null;
    }
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  }

  enterDemoSession(): UserProfile {
    const demoUser: UserProfile = {
      id: 'usr-demo-guest',
      fullName: 'Explorer Guest',
      email: 'guest@linkvault.app',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      quote: 'Collect what inspires you, Build what you dream.',
      theme: 'dark',
    };
    this.setCurrentSession(demoUser);
    return demoUser;
  }

  setCurrentSession(user: UserProfile | null): void {
    if (!this.isBrowser()) return;
    if (!user) {
      localStorage.setItem(STORAGE_KEYS.SESSION, 'logged_out');
    } else {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
      this.saveUser(user);
    }
  }

  signUp(fullName: string, email: string, password?: string): { success: boolean; user?: UserProfile; error?: string } {
    const accounts = this.getAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newAccount = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      password: password || 'password123',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      quote: 'Small steps every day lead to big dreams. Keep going! 🚀',
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    this.saveAccounts(accounts);

    const profile: UserProfile = {
      id: newAccount.id,
      email: newAccount.email,
      fullName: newAccount.fullName,
      avatarUrl: newAccount.avatarUrl,
      quote: newAccount.quote,
      theme: 'dark',
    };

    this.setCurrentSession(profile);
    return { success: true, user: profile };
  }

  signIn(email: string, password?: string): { success: boolean; user?: UserProfile; error?: string } {
    const accounts = this.getAccounts();
    const user = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'No account found with this email. Please check or sign up.' };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      quote: user.quote || 'Collect what inspires you, Build what you dream.',
      theme: 'dark',
    };

    this.setCurrentSession(profile);
    return { success: true, user: profile };
  }

  signOut(): void {
    this.setCurrentSession(null);
  }

  getUser(): UserProfile {
    if (!this.isBrowser()) return INITIAL_USER;
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_USER;
    }
  }

  saveUser(user: UserProfile): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }


  // --- Export and Import ---
  exportAllData(): string {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        user: this.getUser(),
        categories: this.getCategories(),
        resources: this.getResources(),
        tasks: this.getTasks(),
        goals: this.getGoals(),
      },
      null,
      2
    );
  }

  importData(jsonString: string): { success: boolean; count?: number; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.resources)) {
        this.saveResources(data.resources);
      }
      if (Array.isArray(data.tasks)) {
        this.saveTasks(data.tasks);
      }
      if (Array.isArray(data.goals)) {
        this.saveGoals(data.goals);
      }
      if (Array.isArray(data.categories)) {
        this.saveCategories(data.categories);
      }
      return { success: true, count: data.resources?.length || 0 };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // --- Supabase Cloud Sync ---
  async syncWithSupabase(): Promise<{ synced: boolean; count?: number; message?: string }> {
    if (!this.isBrowser() || !supabase) return { synced: false, message: 'Supabase not configured' };
    try {
      const { data: remoteResources, error } = await supabase.from('resources').select('*');
      if (error) return { synced: false, message: error.message };

      if (remoteResources && remoteResources.length > 0) {
        const localList = this.getResources();
        const map = new Map<string, Resource>();
        localList.forEach((r) => map.set(r.id, r));
        remoteResources.forEach((r: any) => {
          map.set(r.id, {
            id: r.id,
            url: r.url,
            domain: r.domain,
            title: r.title,
            description: r.description || '',
            thumbnailUrl: r.thumbnail_url || '',
            faviconUrl: r.favicon_url || '',
            contentType: r.content_type || 'website',
            categoryId: r.category_id || undefined,
            tags: Array.isArray(r.tags) ? r.tags : [],
            isFavorite: r.is_favorite ?? false,
            isReadLater: r.is_read_later ?? false,
            isArchived: r.is_archived ?? false,
            personalNotes: r.personal_notes || '',
            viewCount: r.view_count || 0,
            lastOpenedAt: r.last_opened_at,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          });
        });
        const merged = Array.from(map.values());
        this.saveResources(merged);
        return { synced: true, count: merged.length, message: 'Synced with Supabase' };
      }
      return { synced: true, count: 0, message: 'Supabase table is ready' };
    } catch (e: any) {
      return { synced: false, message: e.message };
    }
  }
}

export const storage = new StorageManager();
