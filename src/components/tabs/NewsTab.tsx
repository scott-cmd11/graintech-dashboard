import { NewsFeed } from '../index';

export function NewsTab() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 display-font">
                    Industry Updates
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                    Stay informed with the latest news, regulations, and technological breakthroughs in the Global Grain Inspection industry.
                </p>
            </div>

            <NewsFeed />
        </div>
    );
}
