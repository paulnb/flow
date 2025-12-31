import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, deleteTask } from './services/api';
import { GridBackground } from './components/ui/GridBackground';
import { LiveClock } from './components/ui/LiveClock';

// Feature Views
import { Overview } from './features/overview/Overview';
import { DonationsView } from './features/donations/DonationsView';
import { TeamView } from './features/team/TeamView';
import type { TeamMember } from './features/team/TeamView';
import { SettingsView } from './features/settings/SettingsView';
import { ResumeView } from './features/resume/ResumeView';
import { TaskCard } from './features/tasks/TaskCard';

import type { Task } from './types/task';
import {
    LayoutDashboard, CheckCircle2, Users, Settings,
    LogOut, Bell, Search, AlertCircle, Plus, X, Loader2,
    Wallet, Calendar, Trash2, FileText, Menu // Added 'Menu' icon
} from 'lucide-react';

type Theme = 'light' | 'dark' | 'cardinal';
type View = 'Overview' | 'Donations' | 'My Tasks' | 'Team' | 'Settings' | 'Resume';

type NewTaskState = {
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
};

const DEFAULT_PROFILE = { name: 'Paul Basco', email: 'paul@coepi.co', title: 'Lead Engineer', avatar: '' };
const DEFAULT_TEAM: TeamMember[] = [
    { id: 1, name: 'Paul Basco', role: 'Owner', status: 'online', avatar: 'PB' },
    { id: 2, name: 'Sarah Connor', role: 'Product Manager', status: 'busy', avatar: 'SC' },
    { id: 3, name: 'John Smith', role: 'Frontend Dev', status: 'offline', avatar: 'JS' },
];

function App() {
    const queryClient = useQueryClient();
    const [theme, setTheme] = useState<Theme>('light');
    const [activeView, setActiveView] = useState<View>('Overview');

    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // NEW: Mobile Sidebar State
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [newTask, setNewTask] = useState<NewTaskState>({ title: '', content: '', priority: 'medium' });

    // --- PERSISTENCE ---
    const [userProfile, setUserProfile] = useState(() => {
        const saved = localStorage.getItem('flow_profile');
        return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    });

    const [team, setTeam] = useState<TeamMember[]>(() => {
        const saved = localStorage.getItem('flow_team');
        return saved ? JSON.parse(saved) : DEFAULT_TEAM;
    });

    useEffect(() => { localStorage.setItem('flow_profile', JSON.stringify(userProfile)); }, [userProfile]);
    useEffect(() => { localStorage.setItem('flow_team', JSON.stringify(team)); }, [team]);

    const handleUpdateProfile = (newProfile: typeof userProfile) => {
        setUserProfile(newProfile);
        setTeam(prevTeam => prevTeam.map(member =>
            member.id === 1 ? { ...member, name: newProfile.name, avatar: newProfile.avatar || 'PB' } : member
        ));
        showToast('Profile and Team updated');
    };

    const { data: tasks, isLoading, error } = useQuery({ queryKey: ['tasks'], queryFn: fetchTasks });

    const createMutation = useMutation({
        mutationFn: createTask,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setIsModalOpen(false);
            setNewTask({ title: '', content: '', priority: 'medium' });
            showToast('Task added successfully');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['tasks'] });
            if (selectedTask) setSelectedTask(null);
            showToast('Task deleted');
        },
    });

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(newTask);
    };

    // Helper to close sidebar when clicking a menu item on mobile
    const handleNavClick = (view: View) => {
        setActiveView(view);
        setIsSidebarOpen(false);
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview' as View },
        { icon: Wallet, label: 'Donations' as View },
        { icon: CheckCircle2, label: 'My Tasks' as View },
        { icon: Users, label: 'Team' as View },
        { icon: FileText, label: 'Resume' as View },
        { icon: Settings, label: 'Settings' as View },
    ];

    return (
        <div data-theme={theme} className="flex min-h-screen font-sans transition-colors duration-500 bg-background text-text-main">
            <GridBackground />

            {/* TOAST */}
            {toastMessage && (
                <div className="fixed bottom-8 right-8 z-[100] bg-surface border border-primary/20 shadow-2xl px-6 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-bold text-sm text-primary">{toastMessage}</span>
                </div>
            )}

            {/* MOBILE OVERLAY (Closes menu when clicking outside) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR (Responsive classes added) */}
            <aside className={`
                fixed lg:sticky top-0 h-screen z-50 w-64 
                border-r border-secondary/10 bg-surface/95 backdrop-blur-xl 
                flex flex-col transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-8 flex justify-between items-center">
                    <span className="text-2xl font-black tracking-tighter text-primary">FLOW.</span>
                    {/* Close button for mobile */}
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-secondary hover:text-primary">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map((item) => (
                        <button key={item.label} onClick={() => handleNavClick(item.label)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                    activeView === item.label ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-secondary hover:bg-primary/5'
                                }`}>
                            <item.icon size={18} strokeWidth={2.5} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-6 border-t border-secondary/10">
                    <button className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-red-500 transition-colors font-bold text-sm">
                        <LogOut size={18} strokeWidth={2.5} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 border-b border-secondary/10 backdrop-blur-md px-4 lg:px-8 flex justify-between items-center sticky top-0 z-40 bg-background/30">

                    {/* LEFT SIDE: Hamburger & Search */}
                    <div className="flex items-center gap-4 text-secondary/60">
                        {/* Hamburger Button (Mobile Only) */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-secondary hover:text-primary transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="hidden md:flex items-center gap-2">
                            <Search size={18} />
                            <span className="text-sm font-medium">Search {activeView}...</span>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Controls */}
                    <div className="flex items-center gap-3 lg:gap-6">
                        {/* Hidden on small mobile */}
                        <div className="hidden sm:block">
                            <LiveClock />
                        </div>

                        <div className="h-6 w-px bg-secondary/10 hidden sm:block" />

                        {/* Theme Switcher - Compact on Mobile */}
                        <div className="flex bg-secondary/5 p-1 rounded-full border border-secondary/10 scale-90">
                            {(['light', 'dark', 'cardinal'] as const).map((t) => (
                                <button key={t} onClick={() => { setTheme(t); document.documentElement.setAttribute('data-theme', t); }}
                                        className={`px-3 lg:px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 ${
                                            theme === t ? 'bg-surface text-primary shadow-sm' : 'text-secondary'
                                        }`}>
                                    {/* Show first letter on mobile, full name on desktop */}
                                    <span className="lg:hidden">{t[0].toUpperCase()}</span>
                                    <span className="hidden lg:inline">{t.toUpperCase()}</span>
                                </button>
                            ))}
                        </div>

                        <button className="relative text-secondary hover:text-primary transition-colors"><Bell size={20} strokeWidth={2.5} /><span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" /></button>

                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/20 border-2 border-primary overflow-hidden">
                            {userProfile.avatar && userProfile.avatar.length > 5 ? (
                                <img src={userProfile.avatar} alt="Me" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-primary text-xs">
                                    {userProfile.name.slice(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-10 max-w-7xl w-full mx-auto">
                    {/* Error Banner */}
                    {error && (
                        <div className="mb-8 p-6 border-2 border-red-500/20 bg-red-500/5 rounded-2xl flex items-center gap-4 text-red-500">
                            <AlertCircle size={24} />
                            <div><p className="font-bold">Bridge Connection Failed</p><p className="text-sm opacity-80">Is port 3001 active?</p></div>
                        </div>
                    )}

                    {/* View Router */}
                    {activeView === 'Overview' && (
                        <Overview
                            tasks={tasks}
                            isLoading={isLoading}
                            error={error}
                            onDeleteTask={(id) => deleteMutation.mutate(id)}
                            onViewDetails={(t) => setSelectedTask(t)}
                            onQuickAdd={() => setIsModalOpen(true)}
                        />
                    )}

                    {activeView === 'Donations' && <DonationsView />}

                    {activeView === 'Team' && <TeamView team={team} onUpdateTeam={setTeam} onShowToast={showToast} />}

                    {activeView === 'Settings' && (
                        <SettingsView
                            key={userProfile.name}
                            userProfile={userProfile}
                            onUpdateProfile={handleUpdateProfile}
                            onShowToast={showToast}
                        />
                    )}

                    {activeView === 'Resume' && <ResumeView />}

                    {activeView === 'My Tasks' && (
                        <section className="animate-slide-up">
                            <header className="flex justify-between items-end mb-8">
                                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">My Tasks</h1>
                                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform text-sm">
                                    <Plus size={18} /> New Task
                                </button>
                            </header>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {isLoading && <div className="col-span-full flex justify-center py-20 text-primary opacity-50"><Loader2 className="animate-spin" size={48} /></div>}
                                {Array.isArray(tasks) && tasks.map((task) => (
                                    <TaskCard key={task.id} task={task} onDelete={(id) => deleteMutation.mutate(id)} onViewDetails={(t) => setSelectedTask(t)} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>

            {/* MODALS */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6 backdrop-blur-sm bg-black/20">
                    <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-secondary/10 p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black tracking-tight">Create Task</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-text-main"><X /></button>
                        </div>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Title</label>
                                <input required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Task name..." />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Priority</label>
                                <div className="flex gap-2">
                                    {(['low', 'medium', 'high'] as const).map((p) => (
                                        <button type="button" key={p} onClick={() => setNewTask({...newTask, priority: p})} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${newTask.priority === p ? 'bg-primary text-white border-primary' : 'border-secondary/20 text-secondary hover:border-primary/50'}`}>{p}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Content</label>
                                <textarea required value={newTask.content} onChange={e => setNewTask({...newTask, content: e.target.value})} className="w-full bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors h-32" placeholder="Describe the work..." />
                            </div>
                            <button type="submit" disabled={createMutation.isPending} className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-50">{createMutation.isPending ? 'Syncing...' : 'Add to Pipeline'}</button>
                        </form>
                    </div>
                </div>
            )}

            {selectedTask && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-6 backdrop-blur-md bg-black/40" onClick={() => setSelectedTask(null)}>
                    <div className="bg-surface w-full max-w-2xl rounded-3xl shadow-2xl border border-secondary/10 p-8 lg:p-10 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mb-4 ${selectedTask.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                    {selectedTask.priority === 'high' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                                    {selectedTask.priority} Priority
                                </div>
                                <h2 className="text-2xl lg:text-3xl font-black tracking-tight leading-tight">{selectedTask.title}</h2>
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="p-2 bg-secondary/5 rounded-full hover:bg-secondary/10 transition-colors text-secondary"><X size={20} /></button>
                        </div>
                        <div className="prose prose-lg text-secondary mb-8"><p>{selectedTask.content}</p></div>
                        <div className="flex gap-4 pt-8 border-t border-secondary/10">
                            <div className="flex items-center gap-3 text-sm text-secondary"><Calendar size={16} /><span>Created: {new Date().toLocaleDateString()}</span></div>
                            <div className="flex-1" />
                            <button onClick={() => deleteMutation.mutate(selectedTask.id)} className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-colors font-bold text-sm"><Trash2 size={16} /> Delete Task</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;