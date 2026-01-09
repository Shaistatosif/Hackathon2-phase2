'use client';

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { StatsWidget } from '@/components/dashboard';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAuth, useRequireAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Plus } from 'lucide-react';
import type { Task, TaskCreateRequest, TaskFilterParams } from '@/types';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const { user, logout } = useAuth();
  const {
    tasks,
    total,
    isLoading: tasksLoading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<TaskFilterParams>({});

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks(currentFilters);
    }
  }, [isAuthenticated, fetchTasks, currentFilters]);

  const handleFilterChange = useCallback((filters: TaskFilterParams) => {
    setCurrentFilters(filters);
  }, []);

  const handleCreateTask = async (data: TaskCreateRequest) => {
    await createTask(data);
    setShowForm(false);
  };

  const handleUpdateTask = async (data: TaskCreateRequest) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTaskId) {
      await deleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1C1C1C]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-[#A1A1A1]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C]">
      <Header user={user} onLogout={logout} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6 lg:ml-64">
          {/* Page Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-[#A1A1A1]">
                Manage your tasks efficiently
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#FFA500] px-5 py-2.5 font-medium text-[#1C1C1C] transition-all hover:bg-[#FF8C00] hover:shadow-lg hover:shadow-orange-500/20"
            >
              <Plus className="w-5 h-5" />
              <span>New Task</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="mb-6">
            <StatsWidget tasks={tasks} />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <TaskFilters
              onFilterChange={handleFilterChange}
              initialFilters={currentFilters}
            />
          </div>

          {/* Results count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {tasks.length} of {total} tasks
            </p>
          </div>

          {/* Task Form Modal */}
          {(showForm || editingTask) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
              <div className="relative w-full max-w-lg rounded-xl border border-[#3A3A3A] bg-[#2A2A2A] p-6 shadow-2xl">
                <h2 className="mb-4 text-xl font-semibold text-white">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <TaskForm
                  task={editingTask || undefined}
                  onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                  isLoading={tasksLoading}
                />
              </div>
            </div>
          )}

          {/* Task List */}
          <TaskList
            tasks={tasks}
            isLoading={tasksLoading}
            onComplete={completeTask}
            onEdit={(task) => setEditingTask(task)}
            onDelete={(id) => setDeleteTaskId(id)}
          />

          {/* Empty State */}
          {!tasksLoading && tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-[#2A2A2A] rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-400 max-w-md mb-6">
                {total === 0
                  ? "You haven't created any tasks yet. Click 'New Task' to get started!"
                  : 'No tasks match your current filters. Try adjusting your search criteria.'}
              </p>
              {total === 0 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black font-medium rounded-lg hover:bg-orange-400 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create your first task
                </button>
              )}
            </div>
          )}

          {/* Delete Confirmation */}
          <ConfirmDialog
            isOpen={!!deleteTaskId}
            title="Delete Task"
            message="Are you sure you want to delete this task? This action cannot be undone."
            confirmLabel="Delete"
            variant="danger"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTaskId(null)}
          />
        </main>
      </div>
    </div>
  );
}
