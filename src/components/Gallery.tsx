// Dynamically import all images from assets/images
const imageModules = import.meta.glob('../assets/images/*.{jpeg,jpg,png,svg,webp}', { eager: true });

const Gallery = () => {
    // Transform glob result into the format used by the component
    const images = Object.entries(imageModules).map(([path, module]) => {
        // Extract filename for the title
        const filename = path.split('/').pop() || '';
        // Clean up filename for title (remove extension and replace dashes/underscores with spaces)
        const title = filename
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ")
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return {
            url: (module as any).default,
            title: title
        };
    });

    // Sort images to keep them consistent (optional, but good for UI)
    images.sort((a, b) => a.title.localeCompare(b.title));

    return (
        <div className="min-h-screen py-12">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-4">Event Gallery</h1>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
                    Relive the most intense moments from previous Ride With The Warriors events. From epic climbs to muddy sprints.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-full h-full">
                {images.map((img, idx) => (
                    <div key={idx} className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 transition-all duration-700">
                        <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
