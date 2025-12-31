import { useState, useMemo } from 'react';
import {
    TrendingUp, X, Save, Plus, Calendar, ArrowUpRight,
    Link, Search, Filter, CheckCircle2, DollarSign, CreditCard
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
    transactions: Transaction[]; // Nested data for the "Drill Down" view
}

// --- DEFAULT DATA ---
const DEFAULT_FUNDS: Fund[] = [
    { id: 1, fund: "General Fund", amount: 1745.00, count: 17 },
    { id: 2, fund: "Building Campaign", amount: 1115.00, count: 4 },
    { id: 3, fund: "Youth Retreat", amount: 330.00, count: 10 },
    { id: 4, fund: "Disaster Relief", amount: 50.00, count: 2 },
];

// Complex data to simulate the "Batch Detail" view from your screenshot
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
    },
    {
        id: 3,
        date: 'Sep 2, 2024',
        amount: 1115.00,
        transactions: [
            { id: 301, donor: "Schrute Farms", amount: 1115.00, method: 'Check', fundName: "Building Campaign" },
        ]
    },
];

export const DonationsView = () => {
    // 1. STATE
    const [funds, setFunds] = useState<Fund[]>(DEFAULT_FUNDS);
    const [batches] = useState<Batch[]>(DEFAULT_BATCHES);

    // Modals
    const [editingFund, setEditingFund] = useState<Fund | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null); // For Detail View
    const [isAllBatchesOpen, setIsAllBatchesOpen] = useState(false); // For "View All" List

    // 2. DYNAMIC MATH
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
            {/* HEADER WITH ACTION BUTTON (Matches Image 1) */}
            <header className="flex justify-between items-end mb-8">
                <h1 className="text-4xl font-black tracking-tight">Giving Summary</h1>
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-600/20 hover:scale-105 transition-transform text-sm flex items-center gap-2">
                    <Plus size={18} /> Record Gifts
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Summary & Funds */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface p-8 rounded-3xl border border-secondary/10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <TrendingUp size={120} className="text-primary" />
                        </div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-2">Year to Date</h3>
                                <div className="text-6xl font-black text-primary tracking-tighter mb-4">{fmt(totalAmount)}</div>
                                <p className="text-secondary text-lg">
                                    <span className="font-bold text-text-main">25 households</span> gave <span className="font-bold text-text-main">{totalCount} gifts</span>.
                                </p>
                            </div>
                            {/* Visual "Designations" Chart Placeholder from Image 2 */}
                            <div className="hidden sm:block h-24 w-24 rounded-full border-[6px] border-primary/20 border-t-primary border-r-green-500 transform rotate-45" />
                        </div>
                        <div className="mt-8 h-2 w-full bg-secondary/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[65%] rounded-full" />
                        </div>
                    </div>

                    <div className="bg-surface rounded-3xl border border-secondary/10 shadow-sm divide-y divide-secondary/5 overflow-hidden">
                        {funds.map((item) => (
                            <div key={item.id} className="group relative cursor-pointer hover:bg-secondary/5 transition-colors">
                                {/* "Public Page" Button Overlay (Matches Image 1) */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            alert(`Opening public page for ${item.fund}`);
                                        }}
                                    >
                                        <Link size={10} /> Public Page
                                    </button>
                                </div>

                                <div onClick={() => setEditingFund(item)}>
                                    <div className="pointer-events-none">
                                        <DonationRow fund={item.fund} amount={fmt(item.amount)} count={item.count} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Batches Sidebar */}
                <div className="bg-surface p-6 rounded-3xl border border-secondary/10 shadow-sm h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Batches</h3>
                        <div className="flex gap-2">
                            <button className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-secondary/5 transition-colors">
                                <Filter size={16} />
                            </button>
                            <button className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-secondary/5 transition-colors">
                                <Search size={16} />
                            </button>
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
                                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
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
                    <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-secondary/10 p-8 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black tracking-tight">Edit Fund</h2>
                            <button onClick={() => setEditingFund(null)} className="text-secondary hover:text-text-main"><X /></button>
                        </div>
                        <form onSubmit={handleSaveFund} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Fund Name</label>
                                <input required value={editingFund.fund} onChange={e => setEditingFund({ ...editingFund, fund: e.target.value })} className="w-full bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Total Amount ($)</label>
                                    <input type="number" required value={editingFund.amount} onChange={e => setEditingFund({ ...editingFund, amount: parseFloat(e.target.value) || 0 })} className="w-full bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors font-mono" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Gift Count</label>
                                    <input type="number" required value={editingFund.count} onChange={e => setEditingFund({ ...editingFund, count: parseInt(e.target.value) || 0 })} className="w-full bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors font-mono" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4"><Save size={16} /> Save Changes</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: BATCH DETAILS (Matches Image 2) --- */}
            {selectedBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/20" onClick={() => setSelectedBatch(null)}>
                    <div className="bg-surface w-full max-w-2xl rounded-3xl shadow-2xl border border-secondary/10 p-0 overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-8 border-b border-secondary/10 flex justify-between items-start bg-secondary/5">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Batch #{selectedBatch.id}</span>
                                    <span className="text-secondary text-sm font-medium">{selectedBatch.date}</span>
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">{fmt(selectedBatch.amount)}</h2>
                            </div>
                            <button onClick={() => setSelectedBatch(null)} className="p-2 bg-white rounded-full hover:bg-secondary/10 transition-colors text-secondary border border-secondary/10 shadow-sm"><X size={20} /></button>
                        </div>

                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Transactions</h3>
                            <div className="space-y-3">
                                {selectedBatch.transactions.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-secondary/10 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-colors font-bold">
                                                {t.donor.slice(0, 1)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-text-main">{t.donor}</p>
                                                <div className="flex items-center gap-2 text-xs text-secondary">
                                                    <span className="flex items-center gap-1">
                                                        {t.method === 'Check' ? <CheckCircle2 size={10} /> : t.method === 'Card' ? <CreditCard size={10} /> : <DollarSign size={10} />}
                                                        {t.method}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{t.fundName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-bold text-primary font-mono">{fmt(t.amount)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-secondary/5 border-t border-secondary/10 flex justify-end">
                            <button className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider">Print Receipt</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 3: VIEW ALL BATCHES --- */}
            {isAllBatchesOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/20" onClick={() => setIsAllBatchesOpen(false)}>
                    <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-secondary/10 p-8 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black tracking-tight">Batch History</h2>
                            <button onClick={() => setIsAllBatchesOpen(false)} className="text-secondary hover:text-text-main"><X /></button>
                        </div>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                            {batches.map((batch) => (
                                <div
                                    key={batch.id}
                                    onClick={() => {
                                        setIsAllBatchesOpen(false);
                                        setSelectedBatch(batch);
                                    }}
                                    className="flex justify-between items-center p-4 rounded-xl border border-secondary/10 hover:bg-secondary/5 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 text-primary w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs">
                                            #{batch.id}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{batch.date}</p>
                                            <p className="text-xs text-secondary">{batch.transactions.length} Gifts</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-primary">{fmt(batch.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};