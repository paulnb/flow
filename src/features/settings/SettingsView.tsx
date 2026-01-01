import { useState, useRef } from 'react';
import { Users, Mail, Save, Activity, Wifi, Upload, Camera } from 'lucide-react';
import { fetchTasks } from '../../services/api';

interface UserProfile {
    name: string;
    email: string;
    title: string;
    avatar: string;
}

interface SettingsViewProps {
    userProfile: UserProfile;
    onUpdateProfile: (newProfile: UserProfile) => void;
    onShowToast: (msg: string) => void;
}

export const SettingsView = ({ userProfile, onUpdateProfile, onShowToast }: SettingsViewProps) => {
    // FIX: Initialize with "Persona" data to hide real identity
    const [localProfile, setLocalProfile] = useState({
        name: "Flow Admin",
        email: "demo@coepi.co",
        title: "Administrator",
        // Keep the avatar if one exists, otherwise null
        avatar: userProfile?.avatar || ""
    });

    const [systemLatency, setSystemLatency] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Remove the early return so the hook order stays consistent
    // if (!userProfile) return null;

    const runDiagnostics = async () => {
        const start = performance.now();
        try {
            await fetchTasks();
            setSystemLatency(Math.round(performance.now() - start));
            onShowToast('Diagnostics completed');
        } catch (e) {
            console.error(e);
            setSystemLatency(-1);
        }
    };

    const handleSave = () => {
        onUpdateProfile(localProfile);
        onShowToast('Profile updated successfully');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalProfile(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section className="animate-slide-up max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight mb-8">Settings</h1>

            <div className="bg-surface p-8 rounded-3xl border border-secondary/10 shadow-sm mb-8">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-secondary/10">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {localProfile.avatar && localProfile.avatar.length > 5 ? (
                            <img src={localProfile.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-xl" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center font-black text-3xl border-4 border-surface shadow-xl">
                                {localProfile.name ? localProfile.name.slice(0, 2).toUpperCase() : 'FA'}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold">Public Profile</h3>
                        <p className="text-secondary text-sm mb-3">This is how you appear to your team.</p>
                        <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold bg-secondary/10 hover:bg-secondary/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <Upload size={12} /> Upload New Photo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Display Name</label>
                        <div className="relative">
                            <input value={localProfile.name} onChange={e => setLocalProfile({...localProfile, name: e.target.value})} className="w-full bg-secondary/5 border border-secondary/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                            <div className="absolute left-3 top-3.5 text-secondary"><Users size={16} /></div>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Email Address</label>
                        <div className="relative">
                            <input value={localProfile.email} onChange={e => setLocalProfile({...localProfile, email: e.target.value})} className="w-full bg-secondary/5 border border-secondary/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                            <div className="absolute left-3 top-3.5 text-secondary"><Mail size={16} /></div>
                        </div>
                    </div>
                    <div className="col-span-full">
                        <button onClick={handleSave} className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-surface p-8 rounded-3xl border border-secondary/10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="text-primary" />
                    <h3 className="text-xl font-bold">System Health</h3>
                </div>
                <div className="bg-secondary/5 rounded-2xl p-6 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Bridge Status</p>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${systemLatency === null ? 'bg-gray-400' : systemLatency >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="font-bold text-lg">{systemLatency === null ? 'Unknown' : systemLatency >= 0 ? 'Operational' : 'Offline'}</span>
                        </div>
                    </div>
                    <button onClick={runDiagnostics} className="px-5 py-2 rounded-xl border border-secondary/20 font-bold text-sm hover:bg-white hover:text-primary transition-colors flex items-center gap-2"><Wifi size={16} /> Test Bridge Connection</button>
                </div>
            </div>
        </section>
    );
};