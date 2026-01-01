import { useState, useMemo } from 'react';
import {
    X, Save, Plus, Calendar, ArrowUpRight,
    Link as LinkIcon, Search, Filter, CheckCircle2, DollarSign, CreditCard
} from 'lucide-react';
import { DonationRow } from '../../components/ui/DonationRow';

// --- TYPES ---
interface Fund {
    id: number;
    fund: string;
    amount: number;
    count: number;
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
    { id: 1, fund: "General Fund", amount: 1745.00, count: 17 },
    { id: 2, fund: "Building Campaign", amount: 1115.00, count: 4 },
    { id: 3, fund: "Youth Retreat", amount: 330.00, count: 10 },
    { id: 4, fund: "Disaster Relief", amount: 50.00, count: 2 },
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
    const [funds, setFunds] = useState<Fund[]>(DEFAULT_FUNDS);
    const [batches] = useState<Batch[]>(DEFAULT_BATCHES);

    const [editingFund, setEditingFund] = useState<Fund | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [isAllBatchesOpen, setIsAllBatchesOpen] = useState(false);
    const [isRecordingGift, setIsRecordingGift] = useState(false);

    // 2. MATH
    const totalAmount = useMemo(() => funds.reduce((acc, curr) => acc + curr.amount, 0), [funds]);
    const totalCount = useMemo(() => funds.reduce((acc, curr) => acc + curr.count, 0), [funds]);

    const fmt = (num: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

    // 3. HANDLERS
    const handleSaveFund = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingFund) return;
        setFunds(prev => prev.map(f => f.id === editingFund.id ? editingFund : f));
        setEditingFund(null);
    };

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

                    <div className="bg-surface rounded-3xl border border-secondary/10 shadow-sm divide-y divide-secondary/5 overflow-hidden">
                        {funds.map((item) => (
                            <div key={item.id} className="group relative cursor-pointer hover:bg-secondary/5 transition-colors">
                                <a
                                    href={`https://flow.coepi.co/public/${item.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 bg-primary/5 flex items-center justify-center backdrop-blur-[1px] transition-all"
                                >
                                    <div className="bg-white px-4 py-2 rounded-xl shadow-xl text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 border border-primary/20">
                                        <LinkIcon size={14} /> Open Public Page
                                    </div>
                                </a>

                                <div onClick={() => setEditingFund(item)}>
                                    <DonationRow fund={item.fund} amount={fmt(item.amount)} count={item.count} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

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

            {/* --- MODAL 1: EDIT FUND --- */}
            {editingFund && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/20" onClick={() => setEditingFund(null)}>
                    <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-secondary/10 p-8" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black tracking-tight">Edit Fund</h2>
                            <button onClick={() => setEditingFund(null)} className="text-secondary"><X /></button>
                        </div>
                        <form onSubmit={handleSaveFund} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Fund Name</label>
                                <input required value={editingFund.fund} onChange={e => setEditingFund({ ...editingFund, fund: e.target.value })} className="w-full bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-3" />
                            </div>
                            <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4">
                                <Save size={16} /> Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: BATCH DETAILS --- */}
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

            {/* --- MODAL 3: RECORD GIFT PLACEHOLDER --- */}
            {isRecordingGift && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/20" onClick={() => setIsRecordingGift(false)}>
                    <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-black mb-4">Record New Gift</h2>
                        <p className="text-secondary mb-6 text-sm">This is where you'll add the donor information and amount.</p>
                        <button onClick={() => setIsRecordingGift(false)} className="w-full bg-primary text-white py-3 rounded-xl font-bold">Close</button>
                    </div>
                </div>
            )}

            {/* --- MODAL 4: ALL BATCHES --- */}
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