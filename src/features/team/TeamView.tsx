import { useState } from 'react';
import { UserPlus, Pencil, Trash2, X, Shield } from 'lucide-react';

export type TeamMember = {
    id: number;
    name: string;
    role: string;
    status: 'online' | 'offline' | 'busy';
    avatar: string; // This will now hold the Base64 image string too
};

interface TeamViewProps {
    team: TeamMember[];
    onUpdateTeam: (newTeam: TeamMember[]) => void;
    onShowToast: (msg: string) => void;
}

export const TeamView = ({ team, onUpdateTeam, onShowToast }: TeamViewProps) => {
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [teamForm, setTeamForm] = useState({ name: '', role: '' });
    const [editingMemberId, setEditingMemberId] = useState<number | null>(null);

    const openInviteModal = () => {
        setEditingMemberId(null);
        setTeamForm({ name: '', role: '' });
        setIsTeamModalOpen(true);
    };

    const openEditMember = (member: TeamMember) => {
        setEditingMemberId(member.id);
        setTeamForm({ name: member.name, role: member.role });
        setIsTeamModalOpen(true);
    };

    const handleTeamSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMemberId) {
            onUpdateTeam(team.map(m => m.id === editingMemberId ? { ...m, ...teamForm } : m));
            onShowToast('Member updated');
        } else {
            const newId = Date.now();
            const initials = teamForm.name.slice(0, 2).toUpperCase();
            onUpdateTeam([...team, { id: newId, name: teamForm.name, role: teamForm.role, status: 'offline', avatar: initials }]);
            onShowToast('Invitation sent');
        }
        setIsTeamModalOpen(false);
    };

    const removeMember = (id: number) => {
        onUpdateTeam(team.filter(t => t.id !== id));
        onShowToast('Member removed');
    };

    return (
        <section className="animate-slide-up">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Team Members</h1>
                    <p className="text-secondary">Manage access and roles for your project.</p>
                </div>
                <button onClick={openInviteModal} className="flex items-center gap-2 bg-surface border border-secondary/20 text-text-main px-5 py-2.5 rounded-xl font-bold hover:bg-secondary/5 transition-colors text-sm">
                    <UserPlus size={18} /> Invite Member
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                    <div key={member.id} className="bg-surface p-6 rounded-3xl border border-secondary/10 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group">
                        {/* Avatar Logic: Check if it's a URL/Base64 or just initials */}
                        {member.avatar.length > 5 ? (
                            <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-secondary/10" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-lg">{member.avatar}</div>
                        )}

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg leading-none mb-1 flex items-center gap-2">
                                    {member.name}
                                    {member.id === 1 && <Shield size={12} className="text-primary" />}
                                </h3>

                                {/* LOCK LOGIC: Only show buttons if NOT the owner (ID 1) */}
                                {member.id !== 1 && (
                                    <div className="flex gap-1">
                                        <button onClick={() => openEditMember(member)} className="text-secondary/40 hover:text-primary transition-colors p-1"><Pencil size={14} /></button>
                                        <button onClick={() => removeMember(member.id)} className="text-secondary/40 hover:text-red-500 transition-colors p-1"><Trash2 size={14} /></button>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-secondary font-medium uppercase tracking-wider mb-2">{member.role}</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500' : member.status === 'busy' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                                <span className="text-[10px] text-secondary font-bold uppercase">{member.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {isTeamModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/20">
                    <div className="bg-surface w-full max-w-sm rounded-3xl shadow-2xl border border-secondary/10 p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black tracking-tight">{editingMemberId ? 'Edit Member' : 'Invite Member'}</h2>
                            <button onClick={() => setIsTeamModalOpen(false)} className="text-secondary hover:text-text-main"><X /></button>
                        </div>
                        <form onSubmit={handleTeamSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Full Name</label>
                                <input required value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} className="w-full bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Role</label>
                                <input required value={teamForm.role} onChange={e => setTeamForm({...teamForm, role: e.target.value})} className="w-full bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                                {editingMemberId ? 'Update Member' : 'Send Invite'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};