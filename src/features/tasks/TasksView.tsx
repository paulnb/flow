import { useState, useMemo } from 'react';
import { Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { TaskCard } from './TaskCard';
import type { Task } from '../../types/task';

interface TasksViewProps {
    tasks: Task[];
    isLoading: boolean;
    error: unknown;
    onDeleteTask: (id: string) => void;
    onViewDetails: (task: Task) => void;
    onQuickAdd: () => void;
    onToggleStatus: (task: Task) => void; // NEW: Handle "Complete"
    onEditTask: (task: Task) => void;     // NEW: Handle "Edit"
}

export const TasksView = ({
                              tasks = [],
                              isLoading,
                              onDeleteTask,
                              onViewDetails,
                              onQuickAdd,
                              onToggleStatus,
                              onEditTask
                          }: TasksViewProps) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

    // --- LOGIC: Filter & Sort ---
    const processedTasks = useMemo(() => {
        let result = [...tasks];

        // 1. Filter by Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(t =>
                t.title.toLowerCase().includes(lower) ||
                t.content.toLowerCase().includes(lower)
            );
        }

        // 2. Filter by Priority
        if (filterPriority !== 'all') {
            result = result.filter(t => t.priority === filterPriority);
        }

        // 3. Sort
        result.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            }
            if (sortBy === 'oldest') {
                return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            }
            if (sortBy === 'priority') {
                const map = { high: 3, medium: 2, low: 1 };
                return map[b.priority] - map[a.priority];
            }
            return 0;
        });

        return result;
    }, [tasks, searchTerm, filterPriority, sortBy]);

    return (
        <section className="animate-slide-up space-y-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">My Tasks</h1>
                    <p className="text-secondary text-sm">Manage and track your daily work.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary w-40 lg:w-48 transition-colors"
                        />
                    </div>

                    {/* Filter Priority */}
                    <div className="relative">
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value as any)}
                            className="appearance-none pl-3 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-secondary focus:outline-none focus:border-primary cursor-pointer"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="appearance-none pl-3 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-secondary focus:outline-none focus:border-primary cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="priority">Highest Priority</option>
                        </select>
                        <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                    </div>

                    <button onClick={onQuickAdd} className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        <Plus size={20} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading && <div className="col-span-full py-20 text-center opacity-50">Loading tasks...</div>}

                {!isLoading && processedTasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={onDeleteTask}
                        onViewDetails={onViewDetails}
                        onToggleStatus={onToggleStatus}
                        onEdit={onEditTask}
                    />
                ))}
            </div>
        </section>
    );
};