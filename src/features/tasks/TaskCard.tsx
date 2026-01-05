import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import type { Task } from '../../types/task';

interface TaskCardProps {
    task: Task;
    onDelete?: (id: string) => void;
    onViewDetails?: (task: Task) => void;
    onToggleStatus?: (task: Task) => void;
}

export const TaskCard = ({ task, onDelete, onViewDetails, onToggleStatus }: TaskCardProps) => {

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const isDone = task.status === 'done';

    return (
        <motion.div
            layout
            onClick={() => onViewDetails?.(task)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isDone ? 0.6 : 1, scale: 1 }}
            className={clsx(
                "relative p-5 rounded-2xl border backdrop-blur-md shadow-sm overflow-hidden group flex flex-col justify-between h-full transition-all cursor-pointer hover:shadow-md hover:border-primary/30",
                isDone ? "border-green-500/20 bg-green-500/5" : "border-white/10 bg-white/5"
            )}
        >
            <div className="relative z-10 pointer-events-none">
                <div className="flex justify-between items-start mb-3 pointer-events-auto">
                    {/* STATUS TOGGLE: Swapped Icon Logic */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleStatus?.(task); }}
                        className={clsx("transition-all duration-300 p-1 -ml-1 rounded-full",
                            isDone
                                ? "text-green-500 bg-white/20 hover:bg-white/40"
                                : "text-secondary/40 hover:text-primary hover:bg-white/10"
                        )}
                    >
                        {isDone ? (
                            // FILLED GREEN CHECK when done
                            <CheckCircle2 size={24} className="fill-green-500 text-white" />
                        ) : (
                            // EMPTY CIRCLE when todo
                            <Circle size={24} />
                        )}
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete?.(task.id); }}
                        className="text-secondary/40 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* TITLE & CONTENT */}
                <div className="mb-4">
                    <h3 className={clsx("text-lg font-bold mb-1 leading-tight", isDone && "line-through text-secondary")}>
                        {task.title}
                    </h3>
                    <p className="text-secondary text-sm line-clamp-2">{task.content}</p>
                </div>
            </div>

            {/* FOOTER */}
            <div className="relative z-10 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-secondary/60 font-medium">
                <div className="flex gap-2">
                    <span className={clsx(
                        "uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border",
                        task.priority === 'high' ? "border-red-500/30 text-red-400 bg-red-500/5" :
                            task.priority === 'medium' ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/5" :
                                "border-blue-500/30 text-blue-400 bg-blue-500/5"
                    )}>
                        {task.priority}
                    </span>

                    {/* VISUAL STATUS BADGE */}
                    {task.status === 'in-progress' && (
                        <span className="uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border border-blue-500/30 text-blue-400 bg-blue-500/5">
                            In Progress
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{formatDate(task.createdAt)}</span>
                </div>
            </div>
        </motion.div>
    );
};