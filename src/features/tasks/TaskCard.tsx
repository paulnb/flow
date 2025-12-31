import { motion } from 'framer-motion';
import type { Task } from '../../types/task';
import { clsx } from 'clsx';
import { Trash2 } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    onDelete?: (id: string) => void;
    // NEW: We allow the parent to handle the "View Details" click
    onViewDetails?: (task: Task) => void;
}

export const TaskCard = ({ task, onDelete, onViewDetails }: TaskCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl overflow-hidden group flex flex-col justify-between h-full"
        >
            <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <span className={clsx(
                        "text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border",
                        task.priority === 'high' ? "border-red-500/50 text-red-400 bg-red-500/10" : "border-primary/50 text-primary/80 bg-primary/10"
                    )}>
                        {task.priority}
                    </span>

                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Stop the click from triggering "View Details" if we click delete
                                onDelete(task.id);
                            }}
                            className="text-secondary/40 hover:text-red-500 transition-colors p-1"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>

                <h3 className="text-lg font-semibold mb-1 leading-tight">{task.title}</h3>
                <p className="text-secondary text-sm line-clamp-2">{task.content}</p>
            </div>

            {/* NEW: The button now triggers the prop function */}
            <div className="relative z-10 mt-4 pt-4 border-t border-white/5 flex justify-end">
                <button
                    onClick={() => onViewDetails?.(task)}
                    className="text-xs font-medium text-primary hover:text-white transition-colors flex items-center gap-1"
                >
                    View Details →
                </button>
            </div>
        </motion.div>
    );
};