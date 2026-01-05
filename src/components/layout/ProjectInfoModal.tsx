"use client";
import { useState } from "react";

export default function ProjectInfoModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* THE TRIGGER BUTTON - Place this in your Sidebar */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 mt-4 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 transition-colors w-full"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>About this Project</span>
            </button>

            {/* THE MODAL */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-white/10 relative">

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Technical Context</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            This dashboard is a live portfolio piece demonstrating React & UX engineering capabilities.
                        </p>

                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Front End</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">Next.js 14, React, Tailwind CSS, Recharts</div>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Back End</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">Supabase (PostgreSQL), Edge Functions</div>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Automation</div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">n8n (Self-Hosted) for data pipelines</div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                            <p className="text-xs text-gray-500 italic">
                                Built by [Your Name] for Coepi.co
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}