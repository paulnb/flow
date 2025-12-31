import { FileText, Download, Briefcase, GraduationCap, Code2, ExternalLink } from 'lucide-react';

export const ResumeView = () => {
    return (
        <section className="animate-slide-up max-w-5xl">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Resume</h1>
                    <p className="text-secondary text-lg">Lead Engineer & Full Stack Developer</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform text-sm"
                >
                    <Download size={18} /> Download PDF
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Experience */}
                    <div className="bg-surface p-8 rounded-3xl border border-secondary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Briefcase size={24} />
                            </div>
                            <h2 className="text-xl font-bold">Experience</h2>
                        </div>

                        <div className="space-y-10">
                            {/* Job 1 */}
                            <div className="relative pl-8 border-l-2 border-primary/20">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-surface" />
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">Founder & Lead Engineer</h3>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-secondary/5 px-2 py-1 rounded text-secondary">2024 - Present</span>
                                </div>
                                <p className="text-sm text-secondary font-bold mb-3">Coepi Agency</p>
                                <p className="text-secondary leading-relaxed text-sm">
                                    Built high-performance web applications using React, Node.js, and Postgres. Specialized in workflow automation and dashboard interfaces for clients in the HVAC and non-profit sectors.
                                </p>
                            </div>

                            {/* Job 2 */}
                            <div className="relative pl-8 border-l-2 border-secondary/10">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-secondary/20 border-4 border-surface" />
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">Senior Automation Specialist</h3>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-secondary/5 px-2 py-1 rounded text-secondary">2021 - 2024</span>
                                </div>
                                <p className="text-sm text-secondary font-bold mb-3">TechFlow Solutions</p>
                                <p className="text-secondary leading-relaxed text-sm">
                                    Designed and deployed custom n8n workflows to automate CRM data entry, reducing manual labor by 40% for enterprise clients.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-surface p-8 rounded-3xl border border-secondary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <GraduationCap size={24} />
                            </div>
                            <h2 className="text-xl font-bold">Education</h2>
                        </div>
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">B.S. Computer Science</h3>
                                    <p className="text-sm text-secondary font-medium">University of Texas</p>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider bg-secondary/5 px-2 py-1 rounded text-secondary">2020</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="space-y-6">
                    {/* Tech Stack */}
                    <div className="bg-surface p-6 rounded-3xl border border-secondary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Code2 className="text-primary" />
                            <h2 className="text-lg font-bold">Tech Stack</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind', 'TanStack Query', 'n8n', 'Docker', 'Figma'].map(skill => (
                                <span key={skill} className="px-3 py-1.5 bg-secondary/5 rounded-lg text-xs font-bold uppercase tracking-wider text-secondary border border-secondary/10 hover:border-primary/30 hover:text-primary transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-8 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-bold text-2xl mb-2">Hire Me</h3>
                            <p className="text-sm opacity-90 mb-6 leading-relaxed">I'm currently open to new opportunities in Full Stack Engineering and Automation.</p>
                            <a
                                href="mailto:paul@coepi.co"
                                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-opacity"
                            >
                                Contact Me <ExternalLink size={14} />
                            </a>
                        </div>
                        <FileText className="absolute -bottom-4 -right-4 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" size={140} />
                    </div>
                </div>
            </div>
        </section>
    );
};