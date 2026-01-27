
interface ErrorBannerProps {
    errors: string[];
}

const ErrorBanner = ({ errors }: ErrorBannerProps) => {
    if (errors.length === 0) return null;

    // Filter out duplicates
    const uniqueErrors = Array.from(new Set(errors));

    return (
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <span className="material-symbols-outlined text-red-500 text-2xl">error</span>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-bold text-red-800 dark:text-red-400 uppercase tracking-wider">
                            Please correct the following errors:
                        </h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                            <ul className="list-disc list-inside space-y-1">
                                {uniqueErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorBanner;
