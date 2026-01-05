import { useState, useMemo } from 'react';
import {
    X, Plus, Calendar, ArrowUpRight,
    Search, Filter, CheckCircle2, DollarSign, CreditCard,
    Wallet, Users,
} from 'lucide-react';
import { DonationRow } from '../../components/ui/DonationRow';

// --- TYPES ---
interface Fund {
    id: number;
    fund: string;
    amount: number;
    count: number;
    // Added these for the Detail View
    description: string;
    lastGift: string;
}

interface Transaction {
    id: number;
    donor: string;
    amount: number;
    method: 'Check' | 'Cash' | 'Card';
    fundName: string;
}

interface Batch {
    id: number;
    date: string;
    amount: number;
    transactions: Transaction[];
}

// --- DEFAULT DATA ---
const DEFAULT_FUNDS: Fund[] = [
    {
        id: 1,
        fund: "General Fund",
        amount: 1745.00,
        count: 17,
        description: 'Unrestricted donations used for general operating expenses and daily maintenance.',
        lastGift: 'Jan 4, 2026'
    },
    {
        id: 2,
        fund: "Building Campaign",
        amount: 1115.00,
        count: 4,
        description: 'Capital campaign for the new community center annex construction.',
        lastGift: 'Dec 28, 2025'
    },
    {
        id: 3,
        fund: "Youth Retreat",
        amount: 330.00,
        count: 10,
        description: 'Subsidies for the upcoming Summer Youth Camp to ensure all kids can attend.',
        lastGift: 'Jan 2, 2026'
    },
    {
        id: 4,
        fund: "Disaster Relief",
        amount: 50.00,
        count: 2,
        description: 'Emergency funds for local flood victims.',
        lastGift: 'Nov 15, 2025'
    },
];

const DEFAULT_BATCHES: Batch[] = [
    {
        id: 1,
        date: 'Sep 12, 2024',
        amount: 1135.00,
        transactions: [
            { id: 101, donor: "Clampitt Household", amount: 80.00, method: 'Check', fundName: "General Fund" },
            { id: 102, donor: "Philbin Household", amount: 25.00, method: 'Cash', fundName: "Mission Trip" },
            { id: 103, donor: "Scott Family", amount: 1030.00, method: 'Check', fundName: "Building Campaign" },
        ]
    },
    {
        id: 2,
        date: 'Sep 10, 2024',
        amount: 750.00,
        transactions: [
            { id: 201, donor: "Beesley Household", amount: 500.00, method: 'Card', fundName: "General Fund" },
            { id: 202, donor: "Halpert Family", amount: 250.00, method: 'Check', fundName: "Youth Retreat" },
        ]
    }
];

export const DonationsView = () => {
    // 1. STATE
    const [funds] = useState<Fund[]>(DEFAULT_FUNDS);
    const [batches] = useState<Batch[]>(DEFAULT_BATCHES);

    // Changed from editingFund to selectedFund for the Detail View
    const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [isAllBatchesOpen, setIsAllBatchesOpen] = useState(false);
    const [isRecordingGift, setIsRecordingGift] = useState(false);

    // 2. MATH
    const totalAmount = useMemo(() => funds.reduce((acc, curr) => acc + curr.amount, 0), [funds]);
    const totalCount = useMemo(() => funds.reduce((acc, curr) => acc + curr.count, 0), [funds]);

    const fmt = (num: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

    return (
        <section className="animate-slide-up relative">
            <header className="flex justify-between items-end mb-8">
                <h1 className="text-4xl font-black tracking-tight">Giving Summary</h1>
                <button
                    onClick={() => setIsRecordingGift(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-600/20 hover:scale-105 transition-transform text-sm flex items-center gap-2"
                >
                    <Plus size={18} /> Record Gifts
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* YTD CARD */}
                    <div className="bg-surface p-8 rounded-3xl border border-secondary/10 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-2">Year to Date</h3>
                                <div className="text-6xl font-black text-primary tracking-tighter mb-4">{fmt(totalAmount)}</div>
                                <p className="text-secondary text-lg">
                                    <span className="font-bold text-text-main">25 households</span> gave <span className="font-bold text-text-main">{totalCount} gifts</span>.
                                </p>
                            </div>
                            <div className="hidden sm:block h-24 w-24 rounded-full border-[6px] border-primary/20 border-t-primary border-r-green-500 transform rotate-45" />
                        </div>
                    </div>

                    {/* FUND LIST */}
                    <div className="bg-surface rounded-3xl border border-secondary/10 shadow-sm divide-y divide-secondary/5 overflow-hidden">
                        {funds.map((item) => (
                            <div
                                key={item.id}
                                // UPDATED: removed the <a> tag overlay
                                // UPDATED: Click now opens the Detail Modal
                                onClick={() => setSelectedFund(item)}
                                className="group relative cursor-pointer hover:bg-secondary/5 transition-colors"
                            >
                                <DonationRow fund={item.fund} amount={fmt(item.amount)} count={item.count} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* BATCHES SIDEBAR (Unchanged) */}
                <div className="bg-surface p-6 rounded-3xl border border-secondary/10 shadow-sm h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Batches</h3>
                        <div className="flex gap-2">
                            <button className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-secondary/5"><Filter size={16} /></button>
                            <button className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-secondary/5"><Search size={16} /></button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {batches.slice(0, 3).map((batch) => (
                            <div
                                key={batch.id}
                                onClick={() => setSelectedBatch(batch)}
                                className="flex justify-between items-center text-sm p-3 rounded-lg hover:bg-secondary/5 transition-colors cursor-pointer group border border-transparent hover:border-secondary/10"
                            >
                                <span className="text-secondary font-medium flex items-center gap-2">
                                    <Calendar size={14} className="opacity-50" />
                                    {batch.date}
                                </span>
                                <span className="font-bold text-primary flex items-center gap-1">
                                    {fmt(batch.amount)}
                                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100" />
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsAllBatchesOpen(true)}
                        className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-secondary/20 text-secondary font-bold text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={14} /> View All Batches
                    </button>
                </div>
            </div>

            {/* --- MODAL 1: FUND DETAILS (NEW) --- */}
            {selectedFund && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-in fade-in duration-200"
                    onClick={() => setSelectedFund(null)}
                >
                    <div
                        className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-secondary/10 p-8 animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                                    <Wallet size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">{selectedFund.fund}</h2>
                                    <p className="text-secondary text-sm font-bold">Fund Details</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedFund(null)}
                                className="p-2 bg-secondary/5 rounded-full hover:bg-secondary/10 text-secondary transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Balance Card */}
                            <div className="p-6 bg-secondary/5 rounded-2xl text-center border border-secondary/10">
                                <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-1">Current Balance</p>
                                <p className="text-4xl font-black text-primary">
                                    {fmt(selectedFund.amount)}
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Description</h3>
                                <p className="text-secondary leading-relaxed bg-white dark:bg-black/20 p-4 rounded-xl border border-secondary/10 text-sm">
                                    {selectedFund.description}
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-secondary/10 rounded-xl flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase">
                                        <Users size={14} /> Total Gifts
                                    </div>
                                    <span className="text-xl font-bold">{selectedFund.count}</span>
                                </div>
                                <div className="p-4 border border-secondary/10 rounded-xl flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase">
                                        <Calendar size={14} /> Last Gift
                                    </div>
                                    <span className="text-xl font-bold">{selectedFund.lastGift}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: BATCH DETAILS (Unchanged) --- */}
            {selectedBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/20" onClick={() => setSelectedBatch(null)}>
                    <div className="bg-surface w-full max-w-2xl rounded-3xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-3xl font-black tracking-tight">{fmt(selectedBatch.amount)}</h2>
                            <button onClick={() => setSelectedBatch(null)} className="p-2 bg-white rounded-full border border-secondary/10"><X size={20} /></button>
                        </div>
                        <div className="space-y-3">
                            {selectedBatch.transactions.map((t) => (
                                <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-secondary/10">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-xs text-secondary">
                                            {t.method === 'Check' ? <CheckCircle2 size={10} /> : t.method === 'Card' ? <CreditCard size={10} /> : <DollarSign size={10} />}
                                            {t.donor}
                                        </div>
                                    </div>
                                    <div className="font-bold text-primary">{fmt(t.amount)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 3: RECORD GIFT (Unchanged) --- */}
            {isRecordingGift && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/20" onClick={() => setIsRecordingGift(false)}>
                    <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-black mb-4">Record New Gift</h2>
                        <p className="text-secondary mb-6 text-sm">This is where you'll add the donor information and amount.</p>
                        <button onClick={() => setIsRecordingGift(false)} className="w-full bg-primary text-white py-3 rounded-xl font-bold">Close</button>
                    </div>
                </div>
            )}

            {/* --- MODAL 4: ALL BATCHES (Unchanged) --- */}
            {isAllBatchesOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/20" onClick={() => setIsAllBatchesOpen(false)}>
                    <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black tracking-tight">Batch History</h2>
                            <button onClick={() => setIsAllBatchesOpen(false)}><X /></button>
                        </div>
                        <div className="space-y-2">
                            {batches.map((batch) => (
                                <div key={batch.id} className="flex justify-between p-4 rounded-xl border border-secondary/10">
                                    <span className="font-bold">{batch.date}</span>
                                    <span className="text-primary font-bold">{fmt(batch.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};