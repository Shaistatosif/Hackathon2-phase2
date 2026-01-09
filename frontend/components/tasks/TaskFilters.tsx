'use client';

import { useState, useCallback } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import type { TaskStatus, TaskPriority, TaskFilterParams } from '@/types';

interface TaskFiltersProps {
  onFilterChange: (filters: TaskFilterParams) => void;
  initialFilters?: TaskFilterParams;
}

const STATUS_OPTIONS: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS: { value: TaskPriority | ''; label: string }[] = [
  { value: '', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export function TaskFilters({ onFilterChange, initialFilters }: TaskFiltersProps) {
  const [filters, setFilters] = useState<TaskFilterParams>({
    status: initialFilters?.status,
    priority: initialFilters?.priority,
    search: initialFilters?.search || '',
    sortBy: initialFilters?.sortBy || 'created_at',
    sortOrder: initialFilters?.sortOrder || 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleChange = useCallback(
    (key: keyof TaskFilterParams, value: string | undefined) => {
      const newFilters = {
        ...filters,
        [key]: value || undefined,
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange('search', e.target.value);
    },
    [handleChange]
  );

  const clearFilters = useCallback(() => {
    const clearedFilters: TaskFilterParams = {
      status: undefined,
      priority: undefined,
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  }, [onFilterChange]);

  const hasActiveFilters =
    filters.status || filters.priority || filters.search;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg
                       text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors
                      ${
                        showFilters || hasActiveFilters
                          ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                          : 'bg-[#2A2A2A] border-[#3A3A3A] text-gray-300 hover:border-gray-500'
                      }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
              {[filters.status, filters.priority, filters.search].filter(Boolean).length}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Expandable Filter Options */}
      {showFilters && (
        <div className="p-4 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#3A3A3A] rounded-lg
                           text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Priority</label>
              <select
                value={filters.priority || ''}
                onChange={(e) => handleChange('priority', e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#3A3A3A] rounded-lg
                           text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Sort By</label>
              <select
                value={filters.sortBy || 'created_at'}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#3A3A3A] rounded-lg
                           text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Order</label>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) => handleChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1C] border border-[#3A3A3A] rounded-lg
                           text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
