import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2 text-secondary text-xs font-mono bg-secondary/5 px-3 py-1 rounded-lg border border-secondary/10">
            <Clock size={12} />
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    );
};