import { Filter, X } from 'lucide-react';
import { TabNav } from '../index';
import { TabId } from '../../types';

interface SidebarProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    sidebarOpen: boolean;
    onSidebarToggle: () => void;
}

export function Sidebar({ activeTab, onTabChange, sidebarOpen, onSidebarToggle }: SidebarProps) {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} shrink-0 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 lg:flex flex-col hidden shadow-sm`}>
                <div className="p-6 space-y-6">
                    <TabNav activeTab={activeTab} onTabChange={onTabChange} />
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onSidebarToggle}
                />
                <aside
                    className={`absolute inset-y-0 left-0 w-80 bg-white dark:bg-gray-950 shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="p-6 space-y-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Menu</h2>
                            <button onClick={onSidebarToggle} className="p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2">
                            <TabNav
                                activeTab={activeTab}
                                onTabChange={(tab) => {
                                    onTabChange(tab);
                                    onSidebarToggle(); // Close on selection
                                }}
                            />
                        </div>
                    </div>
                </aside>
            </div>

            {/* Hamburger Menu Button */}
            <button
                onClick={onSidebarToggle}
                className={`lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-teal-600 text-white rounded-full shadow-2xl hover:bg-teal-700 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center gap-2 ${sidebarOpen ? 'scale-0' : 'scale-100'}`}
                aria-label="Open navigation menu"
            >
                <Filter className="w-6 h-6" />
                <span className="font-bold text-sm">Filters</span>
            </button>
        </>
    );
}
