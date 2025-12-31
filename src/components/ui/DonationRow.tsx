import { DollarSign, ArrowUpRight } from 'lucide-react';

interface DonationRowProps {
    fund: string;
    amount: string;
    count: number;
}

export const DonationRow = ({ fund, amount, count }: DonationRowProps) => (
    <div className="flex items-center justify-between p-4 hover:bg-secondary/5 rounded-xl transition-colors group cursor-pointer">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <DollarSign size={18} strokeWidth={2.5} />
            </div>
            <div>
                <p className="font-bold text-sm">{fund}</p>
                <p className="text-[10px] text-secondary uppercase tracking-wider">{count} Gifts</p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-black text-primary">{amount}</p>
            <p className="text-xs text-secondary flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                View <ArrowUpRight size={10} />
            </p>
        </div>
    </div>
);