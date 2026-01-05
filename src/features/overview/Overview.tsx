import { useState } from 'react';
import {
    LayoutDashboard, CheckCircle2, AlertCircle, TrendingUp,
    Search, Plus, DollarSign
} from 'lucide-react';
import { TaskCard } from '../tasks/TaskCard';
import type { Task } from '../../types/task';

interface OverviewProps {
    tasks: Task[];
    isLoading: boolean;
    error: unknown;
    onDeleteTask: (id: string) => void;
    onViewDetails: (task: Task) => void;
    onQuickAdd: () => void;
    onToggleStatus: (task: Task) => void;
}

export const Overview = ({
    tasks,
    isLoading,
    onDeleteTask,
    onViewDetails,
    onQuickAdd,
    onToggleStatus
}: OverviewProps) => {

    const [searchTerm, setSearchTerm] = useState('');

    // METRICS
    const totalTasks = tasks.length;
    const highPriorityCount = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;

    // DONATIONS MOCK DATA (To match your Donations View)
    const totalRaised = 3240;
    const goalAmount = 5000;
    const percentRaised = Math.round((totalRaised / goalAmount) * 100);

    // FILTER LOGIC
    const recentTasks = tasks
        .filter(t =>
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 3); // Just show top 3

    return (
        <section className="animate-slide-up space-y-8">
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* CARD 1: TOTAL TASKS */}
                <div className="bg-surface p-6 rounded-3xl border border-secondary/10 shadow-sm relative overflow-hidden group hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Total Tasks</span>
                        <div className="bg-green-500/10 text-green-600 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> +12%
                        </div>
                    </div>
                    <div className="text-4xl font-black text-primary mb-1">{totalTasks}</div>
                    <p className="text-secondary text-xs font-medium">Active across all projects</p>
                </div>

                {/* CARD 2: CRITICAL ITEMS */}
                <div className="bg-surface p-6 rounded-3xl border border-secondary/10 shadow-sm relative overflow-hidden group hover:border-red-500/20 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Critical Items</span>
                    </div>
                    <div className="text-4xl font-black text-primary mb-1">{highPriorityCount}</div>
                    <p className="text-secondary text-xs font-medium">High priority tasks requiring attention</p>
                    {/* Decorative Background Icon */}
                    <AlertCircle className="absolute -bottom-4 -right-4 text-red-500/5 rotate-12" size={100} />
                </div>

                {/* CARD 3: DONATIONS GOAL (Replaced Efficiency) */}
                <div className="bg-surface p-6 rounded-3xl border border-secondary/10 shadow-sm relative overflow-hidden group hover:border-green-500/20 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Fundraising Goal</span>
                        <div className="bg-green-500/10 text-green-600 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> On Track
                        </div>
                    </div>
                    <div className="text-4xl font-black text-primary mb-1">{percentRaised}%</div>

                    {/* Progress Bar Visual */}
                    <div className="w-full bg-secondary/10 h-1.5 rounded-full mt-2 mb-2 overflow-hidden">
                        <div
                            className="bg-green-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${percentRaised}%` }}
                        />
                    </div>
                    <p className="text-secondary text-xs font-medium">
                        <span className="font-bold text-text-main">${totalRaised.toLocaleString()}</span> raised of ${goalAmount.toLocaleString()}
                    </p>
                    <DollarSign className="absolute -bottom-4 -right-4 text-green-500/5 rotate-12" size={100} />
                </div>
            </div>

            {/* RECENT ACTIVITY SECTION */}
            <div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
                        <p className="text-secondary text-sm">Showing your <span className="font-bold text-primary">top 3</span> most recent tasks.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* SEARCH: High Contrast Style Fix */}
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-9 pr-4 py-2.5 bg-transparent border-2 border-secondary/20 rounded-xl text-sm font-bold text-secondary focus:outline-none focus:border-primary transition-colors placeholder:text-secondary/50"
                            />
                        </div>

                        <button
                            onClick={onQuickAdd}
                            className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus size={18} /> Quick Add
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recentTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={onDeleteTask}
                            onViewDetails={onViewDetails}
                            onToggleStatus={onToggleStatus}
                        />
                    ))}

                    {recentTasks.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-secondary/10 rounded-3xl text-secondary">
                            <p>No tasks found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};