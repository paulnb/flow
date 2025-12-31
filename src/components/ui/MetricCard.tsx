import { TrendingUp } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string;
    subtext: string;
    trend?: string;
}

export const MetricCard = ({ label, value, subtext, trend }: MetricCardProps) => (
    <div className="bg-surface p-6 rounded-3xl border border-secondary/10 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{label}</span>
            {trend && (
                <span className="bg-green-500/10 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp size={10} /> {trend}
                </span>
            )}
        </div>
        <div className="text-3xl font-black tracking-tight text-primary mb-1">{value}</div>
        <div className="text-xs text-secondary/70">{subtext}</div>
    </div>
);