import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, deleteTask, updateTask } from './services/api';
import { GridBackground } from './components/ui/GridBackground';
import { LiveClock } from './components/ui/LiveClock';

// Feature Views
import { Overview } from './features/overview/Overview';
import { DonationsView } from './features/donations/DonationsView';
import { TeamView } from './features/team/TeamView';
import type { TeamMember } from './features/team/TeamView';
import { SettingsView } from './features/settings/SettingsView';
import { ResumeView } from './features/resume/ResumeView';
import { TasksView } from './features/tasks/TasksView';

import type { Task } from './types/task';
import {
    LayoutDashboard, CheckCircle2, Users, Settings,
    LogOut, Bell, AlertCircle, X,
    Wallet, Calendar, Trash2, FileText, Menu, Edit2
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    // --- HELPER: Close Everything ---
    const handleCloseModals = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
        setNewTask({ title: '', content: '', priority: 'medium' });
    };

    const createMutation = useMutation({
        mutationFn: createTask,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['tasks'] });
            handleCloseModals();
            showToast('Task added successfully');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['tasks'] });
            handleCloseModals();
            showToast('Task deleted');
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateTask,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['tasks'] });
            handleCloseModals();
            showToast('Task updated successfully');
        },
    });

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleSubmitTask = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedTask && isModalOpen) {
            updateMutation.mutate({
                id: selectedTask.id,
                ...newTask
            });
        } else {
            createMutation.mutate(newTask);
        }
    };

    const handleToggleStatus = (task: Task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        updateMutation.mutate({ id: task.id, status: newStatus });
    };

    // 1. CLICK CARD: Just open the preview, don't start editing yet
    const handleViewTask = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(false);
    };

    // 2. CLICK "EDIT" BUTTON: Switch from Preview to Edit Mode
    const handleSwitchToEdit = () => {
        if (!selectedTask) return;
        setNewTask({
            title: selectedTask.title,
            content: selectedTask.content,
            priority: selectedTask.priority
        });
        setIsModalOpen(true); // This opens the form on top/instead of the preview
    };

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

            {/* MOBILE OVERLAY */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`
                fixed lg:sticky top-0 h-screen z-50 w-64 
                border-r border-secondary/10 bg-surface/95 backdrop-blur-xl 
                flex flex-col transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-8 flex justify-between items-center">
                    <span className="text-2xl font-black tracking-tighter text-primary">FLOW.</span>
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
                    <div className="flex items-center gap-4 text-secondary/60">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-secondary hover:text-primary transition-colors">
                            <Menu size={24} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <div className="hidden sm:block"><LiveClock /></div>
                        <div className="h-6 w-px bg-secondary/10 hidden sm:block" />
                        <div className="flex bg-secondary/5 p-1 rounded-full border border-secondary/10 scale-90">
                            {(['light', 'dark', 'cardinal'] as const).map((t) => (
                                <button key={t} onClick={() => { setTheme(t); document.documentElement.setAttribute('data-theme', t); }}
                                        className={`px-3 lg:px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 ${
                                            theme === t ? 'bg-surface text-primary shadow-sm' : 'text-secondary'
                                        }`}>
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
                    {error && (
                        <div className="mb-8 p-6 border-2 border-red-500/20 bg-red-500/5 rounded-2xl flex items-center gap-4 text-red-500">
                            <AlertCircle size={24} />
                            <div><p className="font-bold">Bridge Connection Failed</p><p className="text-sm opacity-80">Is port 3001 active?</p></div>
                        </div>
                    )}

                    {activeView === 'Overview' && (
                        <Overview
                            tasks={tasks || []}
                            isLoading={isLoading}
                            error={error}
                            onDeleteTask={(id) => deleteMutation.mutate(id)}
                            onViewDetails={handleViewTask} // Pass the view handler
                            onQuickAdd={() => setIsModalOpen(true)}
                            onToggleStatus={handleToggleStatus}
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
                        <TasksView
                            tasks={tasks || []}
                            isLoading={isLoading}
                            error={error}
                            onDeleteTask={(id) => deleteMutation.mutate(id)}
                            onViewDetails={handleViewTask} // Pass the view handler
                            onQuickAdd={() => {
                                setNewTask({ title: '', content: '', priority: 'medium' });
                                setSelectedTask(null);
                                setIsModalOpen(true);
                            }}
                            onToggleStatus={handleToggleStatus}
                            // FIXED: No longer passing onEditTask here
                        />
                    )}
                </main>
            </div>

            {/* EDIT / CREATE MODAL */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6 backdrop-blur-sm bg-black/20"
                    onClick={handleCloseModals}
                >
                    <div
                        className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-secondary/10 p-8 animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black tracking-tight">{selectedTask ? 'Edit Task' : 'Create Task'}</h2>
                            <button onClick={handleCloseModals} className="text-secondary hover:text-text-main"><X /></button>
                        </div>
                        <form onSubmit={handleSubmitTask} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Title</label>
                                <input required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full bg-white dark:bg-black/50 border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-text-main" placeholder="Task name..." />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Priority</label>
                                <div className="flex gap-2">
                                    {(['low', 'medium', 'high'] as const).map((p) => (
                                        <button type="button" key={p} onClick={() => setNewTask({...newTask, priority: p})} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${newTask.priority === p ? 'bg-primary text-white border-primary' : 'border-secondary/20 text-secondary hover:border-primary/50'}`}>{p}</button>
                                    ))}
                                </div>
                            </div>
                            {/* NEW: Status Selector (Only show when editing) */}
                            {selectedTask && (
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Status</label>
                                    <div className="flex gap-2">
                                        {(['todo', 'in-progress', 'done'] as const).map((s) => (
                                            <button
                                                type="button"
                                                key={s}
                                                onClick={() => {
                                                    // Only update local state if we are in "Edit" mode logic
                                                    // For now, we can piggyback on a new state or just update the task object directly if you refactor
                                                    // Ideally, add 'status' to your newTask state definition
                                                    alert("Status selection coming in next polish step!");
                                                }}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                                                    s === 'done' ? 'border-green-500/50 text-green-600 bg-green-500/10' :
                                                        s === 'in-progress' ? 'border-blue-500/50 text-blue-600 bg-blue-500/10' :
                                                            'border-secondary/20 text-secondary'
                                                }`}
                                            >
                                                {s.replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Content</label>
                                <textarea required value={newTask.content} onChange={e => setNewTask({...newTask, content: e.target.value})} className="w-full bg-white dark:bg-black/50 border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors h-32 text-text-main" placeholder="Describe the work..." />
                            </div>
                            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-50">
                                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : selectedTask ? 'Save Changes' : 'Add to Pipeline'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* PREVIEW MODAL */}
            {selectedTask && !isModalOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-6 backdrop-blur-md bg-black/40"
                    onClick={handleCloseModals}
                >
                    <div
                        className="bg-surface w-full max-w-2xl rounded-3xl shadow-2xl border border-secondary/10 p-8 lg:p-10 animate-in fade-in zoom-in duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mb-4 ${selectedTask.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                    {selectedTask.priority === 'high' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                                    {selectedTask.priority} Priority
                                </div>
                                <h2 className="text-2xl lg:text-3xl font-black tracking-tight leading-tight">{selectedTask.title}</h2>
                            </div>
                            <div className="flex gap-2">
                                {/* NEW: EDIT BUTTON in Preview */}
                                <button onClick={handleSwitchToEdit} className="p-2 bg-secondary/5 rounded-full hover:bg-secondary/10 transition-colors text-primary" title="Edit Task">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={handleCloseModals} className="p-2 bg-secondary/5 rounded-full hover:bg-secondary/10 transition-colors text-secondary">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="prose prose-lg text-secondary mb-8"><p>{selectedTask.content}</p></div>
                        <div className="flex gap-4 pt-8 border-t border-secondary/10">
                            <div className="flex items-center gap-3 text-sm text-secondary"><Calendar size={16} /><span>Created: {new Date(selectedTask.createdAt || Date.now()).toLocaleDateString()}</span></div>
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