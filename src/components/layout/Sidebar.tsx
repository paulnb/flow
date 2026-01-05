import { LayoutDashboard, CheckCircle2, Settings, Users, LogOut } from 'lucide-react';
import ProjectInfoModal from "./ProjectInfoModal";
export const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: CheckCircle2, label: 'My Tasks' },
        { icon: Users, label: 'Team' },
        { icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className="w-64 border-r border-secondary/10 bg-surface flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <span className="text-2xl font-black tracking-tighter text-primary">FLOW.</span>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-secondary/5 hover:text-text-main'
                            }`}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </button>
                ))}
            </nav>
            <ProjectInfoModal />
            <div className="p-4 border-t border-secondary/10">
                <button className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};