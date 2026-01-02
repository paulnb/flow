import { useState } from 'react';
import { Plus, Loader2, AlertCircle, Search } from 'lucide-react';
import { MetricCard } from '../../components/ui/MetricCard';
import { TaskCard } from '../tasks/TaskCard';
import type { Task } from '../../types/task';

interface OverviewProps {
    tasks: Task[] | undefined;
    isLoading: boolean;
    error: unknown;
    onDeleteTask: (id: string) => void;
    onViewDetails: (task: Task) => void;
    onQuickAdd: () => void;
    onToggleStatus: (task: Task) => void; // NEW: Added this prop
}

export const Overview = ({
                             tasks,
                             isLoading,
                             error,
                             onDeleteTask,
                             onViewDetails,
                             onQuickAdd,
                             onToggleStatus // Destructure it here
                         }: OverviewProps) => {

    // 1. SEARCH STATE
    const [searchTerm, setSearchTerm] = useState('');

    const totalTasks = tasks?.length || 0;
    const highPriorityCount = tasks?.filter(t => t.priority === 'high').length || 0;
    // Calculate real completion rate if possible, otherwise keep hardcoded for now
    const completedCount = tasks?.filter(t => t.status === 'done').length || 0;
    const completionRate = totalTasks > 0 ? `${Math.round((completedCount / totalTasks) * 100)}%` : "0%";

    // 2. SEARCH LOGIC
    const filteredTasks = (tasks || []).filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="animate-slide-up space-y-8">
            {/* 1. METRICS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard label="Total Tasks" value={totalTasks.toString()} subtext="Active across all projects" trend="+12%" />
                <MetricCard label="Critical Items" value={highPriorityCount.toString()} subtext="High priority tasks requiring attention" />
                <MetricCard label="Efficiency" value={completionRate} subtext="Tasks completed on schedule" trend="+5%" />
            </div>

            {/* 2. RECENT ACTIVITY HEADER */}
            <header className="flex justify-between items-end pt-8">
                <div>
                    <h2 className="text-2xl font-black tracking-tight mb-1">Recent Activity</h2>
                    <p className="text-secondary text-sm">
                        {searchTerm
                            ? `Found ${filteredTasks.length} results for "${searchTerm}"`
                            : <>Showing your <span className="text-primary font-bold">top 3</span> most recent tasks.</>
                        }
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* SEARCH INPUT */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            // Updated styles for visibility in Dark Mode
                            className="pl-10 pr-4 py-2 bg-white dark:bg-black/20 border-2 border-secondary/10 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors w-64"
                        />
                    </div>

                    <button onClick={onQuickAdd} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform text-sm whitespace-nowrap">
                        <Plus size={18} /> Quick Add
                    </button>
                </div>
            </header>

            {/* 3. TASK GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {!!error && (
                    <div className="col-span-full p-6 border-2 border-red-500/20 bg-red-500/5 rounded-2xl flex items-center gap-4 text-red-500">
                        <AlertCircle size={24} />
                        <div>
                            <p className="font-bold">Unable to load activity</p>
                            <p className="text-sm opacity-80">Check your bridge connection.</p>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="col-span-full flex justify-center py-20 text-primary opacity-50">
                        <Loader2 className="animate-spin" size={48} />
                    </div>
                )}

                {!isLoading && !error && (
                    searchTerm ? (
                        // SEARCH RESULTS (Show all matches)
                        filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onDelete={onDeleteTask}
                                onViewDetails={onViewDetails}
                                onToggleStatus={onToggleStatus} // Passed down
                            />
                        ))
                    ) : (
                        // RECENT ACTIVITY (Show top 3)
                        (tasks || []).slice(0, 3).map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onDelete={onDeleteTask}
                                onViewDetails={onViewDetails}
                                onToggleStatus={onToggleStatus} // Passed down
                            />
                        ))
                    )
                )}

                {!isLoading && searchTerm && filteredTasks.length === 0 && (
                    <div className="col-span-full text-center py-10 text-secondary opacity-60">
                        No tasks match your search.
                    </div>
                )}
            </div>
        </section>
    );
};