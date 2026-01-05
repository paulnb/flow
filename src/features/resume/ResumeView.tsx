import { FileText, Download, Briefcase, GraduationCap, Code2, ExternalLink, User } from 'lucide-react';

export const ResumeView = () => {
    return (
        <section className="animate-slide-up max-w-5xl mx-auto">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-foreground">Paul Basco</h1>
                    <p className="text-primary font-bold text-xl">React UX Engineer</p>
                    <p className="text-secondary text-sm mt-1">469.471.1440 | paul.n.basco@gmail.com | coepi.co</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform text-sm"
                >
                    <Download size={18} /> Download PDF
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Professional Summary */}
                    <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <User size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">Professional Summary</h2>
                        </div>
                        <p className="text-secondary leading-relaxed text-sm">
                            Digital operations specialist transitioning to full stack engineering with a focus on React, UX Design, and automation. Combining 6+ years of user conversion data analysis with modern frontend development skills. As a Catholic husband and father, I am deeply aligned with Flocknote’s mission to build a more connected Church.
                        </p>
                    </div>

                    {/* Technical Skills */}
                    <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Code2 size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">Technical Skills</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-foreground mb-1">Frontend Core</h3>
                                <p className="text-secondary text-sm">React.js, Next.js 14 (App Router), TypeScript, JavaScript (ES6+), HTML5, CSS3.</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground mb-1">UX & Styling</h3>
                                <p className="text-secondary text-sm">Tailwind CSS, CSS-in-JS, Responsive Design, “Pixel-Perfect” Implementation, Email HTML Compatibility.</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground mb-1">Backend & Data</h3>
                                <p className="text-secondary text-sm">PostgreSQL, Node.js, REST APIs, n8n (workflow automation).</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground mb-1">Tools & Infrastructure</h3>
                                <p className="text-secondary text-sm">Git, Visual Studio Code, WebStorm, Antigravity, VPS Management (Contabo/Coolify), Webhooks.</p>
                            </div>
                        </div>
                    </div>

                    {/* Engineering Projects */}
                    <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Code2 size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">Engineering Projects</h2>
                        </div>

                        <div className="relative pl-8 border-l-2 border-primary/20 space-y-8">
                            {/* Independent */}
                            <div className="relative">
                                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-surface" />
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-foreground">INDEPENDENT <span className="font-normal text-secondary text-sm">| TX (Remote)</span></h3>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded text-secondary whitespace-nowrap mt-1 sm:mt-0">Nov 2024 - Present</span>
                                </div>
                                <h4 className="font-bold text-md text-primary mb-2">Full Stack Developer</h4>
                                <p className="text-secondary text-sm mb-4 italic">Leveraging an operational sabbatical to learn, build, and deploy web applications.</p>

                                <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-secondary">
                                    <li>
                                        <strong className="text-foreground">Coepi Agency (Next.js, TypeScript, Tailwind):</strong> Built a scalable agency site using Next.js App Router. Integrated n8n webhooks to capture leads and sync them instantly to a CRM, triggering conditional email sequences.
                                    </li>
                                    <li>
                                        <strong className="text-foreground">SCP Refrigeration (React/Vite):</strong> Developed a SPA with a focus on component modularity and mobile responsiveness. Achieved high Lighthouse performance scores via asset optimization.
                                    </li>
                                    <li>
                                        <strong className="text-foreground">Infrastructure:</strong> Self-host applications on a VPS managed via Coolify, handling Docker containers, reverse proxies, and database management (PostgreSQL).
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Briefcase size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">Experience</h2>
                        </div>

                        <div className="space-y-10 border-l-2 border-border/50 ml-3 pl-8 relative">

                            {/* Cox Automotive */}
                            <div className="relative">
                                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-surface" />
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-foreground">Cox Automotive Inc.</h3>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded text-secondary whitespace-nowrap mt-1 sm:mt-0">Jul 2021 - Nov 2024</span>
                                </div>
                                <p className="text-primary font-bold text-sm mb-2">Digital Advertising Strategist</p>
                                <p className="text-sm text-secondary mb-3 italic">Managed technical configuration and performance logic for 70+ dealership accounts.</p>
                                <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-secondary">
                                    <li><strong className="text-foreground">Technical Troubleshooting:</strong> Used logic-driven debugging to diagnose anomalies and resolve complex account issues.</li>
                                    <li><strong className="text-foreground">UX Optimization:</strong> Applied UX principles by A/B testing assets to improve click-through rates and user engagement.</li>
                                    <li><strong className="text-foreground">Data Analysis:</strong> Analyzed large datasets to provide actionable insights and maintain strict compliance for each OEM.</li>
                                </ul>
                            </div>

                            {/* TNT Dental */}
                            <div className="relative">
                                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-secondary/30 border-4 border-surface" />
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-foreground">TNT Dental</h3>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded text-secondary whitespace-nowrap mt-1 sm:mt-0">Jul 2018 - Jan 2021</span>
                                </div>
                                <p className="text-primary font-bold text-sm mb-2">Paid Search Account Manager</p>
                                <p className="text-sm text-secondary mb-3 italic">Optimized digital ecosystems and user acquisition flows for 75+ dental practices.</p>
                                <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-secondary">
                                    <li><strong className="text-foreground">User Intent Analysis:</strong> Analyzed user search behaviors to tailor campaign structures to match specific user intents.</li>
                                    <li><strong className="text-foreground">Technical Communication:</strong> Translated technical concepts into clear updates for non-technical business owners.</li>
                                </ul>
                            </div>

                            {/* Compass */}
                            <div className="relative">
                                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-secondary/30 border-4 border-surface" />
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-foreground">Compass Professional Health Services</h3>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded text-secondary whitespace-nowrap mt-1 sm:mt-0">Jun 2017 - May 2018</span>
                                </div>
                                <p className="text-primary font-bold text-sm mb-2">Associate Consultant</p>
                                <p className="text-sm text-secondary mb-3 italic">Served as central liaison between members, providers, and insurance networks for 40+ accounts.</p>
                                <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-secondary">
                                    <li><strong className="text-foreground">Problem Resolution:</strong> Provided high-touch member support, developing strong empathy and communication skills.</li>
                                </ul>
                            </div>

                            {/* TekSystems */}
                            <div className="relative">
                                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-secondary/30 border-4 border-surface" />
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-foreground">TekSystems (Simpli.fi)</h3>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded text-secondary whitespace-nowrap mt-1 sm:mt-0">Apr 2016 - Jun 2016</span>
                                </div>
                                <p className="text-primary font-bold text-sm mb-2">Account Coordinator</p>
                                <p className="text-sm text-secondary mb-3 italic">Executed programmatic campaign setups and HTML creative auditing for high-volume accounts.</p>
                                <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-secondary">
                                    <li><strong className="text-foreground">HTML & Creative Handling:</strong> Optimized HTML creatives, ensuring proper rendering on diverse devices and browsers.</li>
                                    <li><strong className="text-foreground">Legacy Compatibility:</strong> Resolved layout and compatibility issues for campaigns, gaining HTML constraints experience.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <GraduationCap size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">Education</h2>
                        </div>
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-foreground">Florida Institute of Technology</h3>
                                    <p className="text-sm text-secondary font-medium">Master of Business Administration in Internet Marketing</p>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded text-secondary">Dec 2014</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar (Right Column) */}
                <div className="space-y-6">
                    {/* Tech Stack Pills (Visual only, kept as requested for website flair) */}
                    <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Code2 className="text-primary" />
                            <h2 className="text-lg font-bold text-foreground">Tech Stack</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL', 'n8n', 'Docker', 'Vite'].map(skill => (
                                <span key={skill} className="px-3 py-1.5 bg-secondary/10 rounded-lg text-xs font-bold uppercase tracking-wider text-secondary border border-transparent hover:border-primary/30 hover:text-primary transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contact / Hire Me Card */}
                    <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-bold text-2xl mb-2">Hire Me</h3>
                            <p className="text-sm opacity-90 mb-6 leading-relaxed">I'm currently open to new opportunities in Full Stack Engineering and Automation.</p>
                            <a
                                href="mailto:paul.n.basco@gmail.com"
                                className="inline-flex items-center gap-2 bg-background text-primary px-6 py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-opacity"
                            >
                                Contact Me <ExternalLink size={14} />
                            </a>
                        </div>
                        <FileText className="absolute -bottom-4 -right-4 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" size={140} />
                    </div>
                </div>
            </div>
        </section >
    );
};