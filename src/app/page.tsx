'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { StatCards } from '@/components/dashboard/StatCards';
import { RecentlyAddedGrid } from '@/components/dashboard/RecentlyAddedGrid';
import { RecentlyViewedCarousel } from '@/components/dashboard/RecentlyViewedCarousel';
import { QuickAddWidget } from '@/components/dashboard/QuickAddWidget';
import { TodayTasksWidget } from '@/components/dashboard/TodayTasksWidget';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { MiniCalendarWidget } from '@/components/dashboard/MiniCalendarWidget';

// Views
import { AllResourcesView } from '@/components/views/AllResourcesView';
import { TasksView } from '@/components/views/TasksView';
import { GoalsView } from '@/components/views/GoalsView';
import { SettingsView } from '@/components/views/SettingsView';

// Modals
import { AddResourceModal } from '@/components/modals/AddResourceModal';
import { ResourceDetailModal } from '@/components/modals/ResourceDetailModal';
import { TaskModal } from '@/components/modals/TaskModal';
import { GoalModal } from '@/components/modals/GoalModal';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { SearchCommandDialog } from '@/components/modals/SearchCommandDialog';
import { ImportExportModal } from '@/components/modals/ImportExportModal';
import { AuthModal } from '@/components/auth/AuthModal';

// Storage & Types
import { storage } from '@/lib/storage';
import {
  ActiveTab,
  Resource,
  Task,
  Goal,
  Category,
  UserProfile,
} from '@/types';

export default function Home() {
  // Application State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Entities & Authentication
  const [user, setUser] = useState<UserProfile | null>(() => storage.getCurrentSession());
  const [resources, setResources] = useState<Resource[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Modals
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isOmnibarOpen, setIsOmnibarOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Load from local storage on client mount
  const reloadData = () => {
    setUser(storage.getCurrentSession());
    setResources(storage.getResources());
    setTasks(storage.getTasks());
    setGoals(storage.getGoals());
    setCategories(storage.getCategories());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Theme Toggle
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  // Auth Handlers
  const handleSignOut = () => {
    storage.signOut();
    setUser(null);
    setAuthModalMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    reloadData();
  };

  // Resource Actions
  const handleSaveResource = (resData: Partial<Resource>) => {
    const created = storage.addResource(resData);
    setResources(storage.getResources());
    return created;
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    storage.toggleFavorite(id);
    setResources(storage.getResources());
  };

  const handleToggleArchive = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    storage.toggleArchive(id);
    setResources(storage.getResources());
  };

  const handleDeleteResource = (id: string) => {
    storage.deleteResource(id);
    setResources(storage.getResources());
  };

  const handleUpdateResource = (id: string, updates: Partial<Resource>) => {
    storage.updateResource(id, updates);
    setResources(storage.getResources());
  };

  const handleSelectResource = (res: Resource) => {
    storage.recordView(res.id);
    setResources(storage.getResources());
    setSelectedResource(res);
  };

  // Task Actions
  const handleToggleTask = (id: string) => {
    storage.toggleTask(id);
    setTasks(storage.getTasks());
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      storage.updateTask(taskData.id, taskData);
    } else {
      storage.addTask(taskData);
    }
    setTasks(storage.getTasks());
  };

  const handleDeleteTask = (id: string) => {
    storage.deleteTask(id);
    setTasks(storage.getTasks());
  };

  // Goal Actions
  const handleSaveGoal = (goalData: Partial<Goal>) => {
    if (goalData.id) {
      storage.updateGoal(goalData.id, goalData);
    } else {
      storage.addGoal(goalData);
    }
    setGoals(storage.getGoals());
  };

  const handleDeleteGoal = (id: string) => {
    storage.deleteGoal(id);
    setGoals(storage.getGoals());
  };

  const handleUpdateGoalProgress = (id: string, progress: number) => {
    storage.updateGoal(id, { progress });
    setGoals(storage.getGoals());
  };

  // Category Actions
  const handleSaveCategory = (catData: Partial<Category>) => {
    storage.addCategory(catData);
    setCategories(storage.getCategories());
  };

  // Active user profile fallback
  const displayUser = user || storage.getUser();

  return (
    <div className="h-screen w-screen bg-[#090D16] text-slate-100 flex flex-col font-sans transition-colors duration-200 overflow-hidden select-none">
      {/* Top Header Omnibar */}
      <Header
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenOmnibar={() => setIsOmnibarOpen(true)}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onOpenSettings={() => setActiveTab('settings')}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Layout Container (Exactly fills remaining viewport height) */}
      <div className="flex-1 flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left Sidebar (Pinned layout with scrollable categories) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          categories={categories}
          selectedCategorySlug={selectedCategorySlug}
          onSelectCategory={setSelectedCategorySlug}
          onOpenNewCategoryModal={() => setIsCategoryModalOpen(true)}
        />

        {/* Dynamic Center/Right Workspace Area (Independent smooth scroll) */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-7">
          {/* DASHBOARD VIEW (Matching image 2 precisely) */}
          {activeTab === 'dashboard' && !selectedCategorySlug && (
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Central Main Column */}
              <div className="flex-1 space-y-6 min-w-0">
                {/* 1. Hero Greeting Banner */}
                <HeroBanner user={displayUser} />

                {/* 2. Key Metric Stat Cards */}
                <StatCards
                  resources={resources}
                  tasks={tasks}
                  goals={goals}
                  onNavigate={setActiveTab}
                />

                {/* 3. Recently Added Resources Grid */}
                <RecentlyAddedGrid
                  resources={resources}
                  onSelectResource={handleSelectResource}
                  onToggleFavorite={handleToggleFavorite}
                  onViewAll={() => setActiveTab('all-resources')}
                />

                {/* 4. Recently Viewed Collections Carousel */}
                <RecentlyViewedCarousel
                  categories={categories}
                  onSelectCategory={(slug) => {
                    setSelectedCategorySlug(slug);
                    setActiveTab('all-resources');
                  }}
                  onOpenNewCategory={() => setIsCategoryModalOpen(true)}
                  onViewAll={() => setActiveTab('categories')}
                />
              </div>

              {/* Right Column Panel */}
              <div className="w-full xl:w-80 2xl:w-88 shrink-0 space-y-5">
                {/* Quick Add Resource */}
                <QuickAddWidget onSaveResource={handleSaveResource} />

                {/* Today's Tasks */}
                <TodayTasksWidget
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onOpenNewTaskModal={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                  onViewAll={() => setActiveTab('tasks')}
                />

                {/* Goals Widget */}
                <GoalsWidget
                  goals={goals}
                  onSelectGoal={(g) => {
                    setEditingGoal(g);
                    setIsGoalModalOpen(true);
                  }}
                  onViewAll={() => setActiveTab('goals')}
                />

                {/* Mini Calendar */}
                <MiniCalendarWidget
                  onSelectDate={(d) => {
                    setActiveTab('tasks');
                  }}
                />
              </div>
            </div>
          )}

          {/* ALL RESOURCES / CATEGORY / FAVORITES / READ LATER / ARCHIVE VIEWS */}
          {(activeTab === 'all-resources' ||
            activeTab === 'favorites' ||
            activeTab === 'read-later' ||
            activeTab === 'archive' ||
            activeTab === 'recently-viewed' ||
            selectedCategorySlug) && (
            <AllResourcesView
              resources={resources}
              categories={categories}
              selectedCategorySlug={selectedCategorySlug}
              onSelectCategory={setSelectedCategorySlug}
              onSelectResource={handleSelectResource}
              onToggleFavorite={handleToggleFavorite}
              onToggleArchive={handleToggleArchive}
              onOpenAddResource={() => setIsAddResourceOpen(true)}
              filterMode={
                activeTab === 'favorites'
                  ? 'favorites'
                  : activeTab === 'read-later'
                  ? 'read-later'
                  : activeTab === 'archive'
                  ? 'archive'
                  : activeTab === 'recently-viewed'
                  ? 'recently-viewed'
                  : 'all'
              }
            />
          )}

          {/* TASKS VIEW */}
          {activeTab === 'tasks' && !selectedCategorySlug && (
            <TasksView
              tasks={tasks}
              categories={categories}
              goals={goals}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onOpenTaskModal={(task) => {
                setEditingTask(task || null);
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {/* GOALS VIEW */}
          {activeTab === 'goals' && !selectedCategorySlug && (
            <GoalsView
              goals={goals}
              resources={resources}
              tasks={tasks}
              onOpenGoalModal={(g) => {
                setEditingGoal(g || null);
                setIsGoalModalOpen(true);
              }}
              onDeleteGoal={handleDeleteGoal}
              onUpdateGoalProgress={handleUpdateGoalProgress}
              onSelectResource={handleSelectResource}
            />
          )}

          {/* SETTINGS VIEW */}
          {activeTab === 'settings' && !selectedCategorySlug && (
            <SettingsView
              user={displayUser}
              onUpdateUser={setUser}
              onReloadData={reloadData}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      <AddResourceModal
        isOpen={isAddResourceOpen}
        onClose={() => setIsAddResourceOpen(false)}
        categories={categories}
        onSave={handleSaveResource}
      />

      <ResourceDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
        categories={categories}
        onToggleFavorite={handleToggleFavorite}
        onToggleArchive={handleToggleArchive}
        onDeleteResource={handleDeleteResource}
        onUpdateResource={handleUpdateResource}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        categories={categories}
        goals={goals}
        onSaveTask={handleSaveTask}
        initialTask={editingTask}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSaveGoal={handleSaveGoal}
        initialGoal={editingGoal}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSaveCategory={handleSaveCategory}
      />

      <SearchCommandDialog
        isOpen={isOmnibarOpen}
        onClose={() => setIsOmnibarOpen(false)}
        resources={resources}
        tasks={tasks}
        goals={goals}
        categories={categories}
        onSelectResource={handleSelectResource}
        onSelectGoal={(g) => {
          setEditingGoal(g);
          setIsGoalModalOpen(true);
        }}
        onSelectCategory={(slug) => {
          setSelectedCategorySlug(slug);
          setActiveTab('all-resources');
        }}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        resources={resources}
        onDataImported={reloadData}
      />
    </div>
  );
}
