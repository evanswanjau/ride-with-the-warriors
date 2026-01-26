import { useNavigate } from 'react-router-dom';

const Gallery = () => {
    const navigate = useNavigate();

    const images = [
        { url: 'https://images.unsplash.com/photo-1541625602330-2277a1cd13a1?q=80&w=1000', title: 'Mountain Trail Rush' },
        { url: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=1000', title: 'Sunset Peak Ride' },
        { url: 'https://images.unsplash.com/photo-1532298229144-0ee0c33a1032?q=80&w=1000', title: 'Valley Sprint' },
        { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000', title: 'Team Formation' },
        { url: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?q=80&w=1000', title: 'The Great Ascent' },
        { url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1000', title: 'Coastal Breeze' }
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-4">Event Gallery</h1>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
                    Relive the most intense moments from previous Ride With The Warriors events. From epic climbs to muddy sprints.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {images.map((img, idx) => (
                    <div key={idx} className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-neutral-100 dark:bg-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                            <h3 className="text-white text-2xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{img.title}</h3>
                            <p className="text-white/60 text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">Ride With The Warriors 2024</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <button
                    onClick={() => navigate('/register/step/1')}
                    className="px-10 py-5 bg-primary text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all active:scale-95"
                >
                    Register for Next Event
                </button>
            </div>
        </div>
    );
};

export default Gallery;
