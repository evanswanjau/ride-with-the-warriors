// Import all local images from assets/images
import img1 from '../assets/images/0J6A9936-17-min.jpeg';
import img2 from '../assets/images/0J6A9951-18-min.jpeg';
import img3 from '../assets/images/0J6A9965-19-min.jpeg';
import img4 from '../assets/images/0J6A9984-21-min.jpeg';
import img5 from '../assets/images/0J6A9994-22-min.jpeg';
import img6 from '../assets/images/296A0066-27-min.jpeg';
import img7 from '../assets/images/296A0069-28-min.jpeg';
import img8 from '../assets/images/296A0071-29-min.jpeg';
import img9 from '../assets/images/296A0075-30-min.jpeg';
import img10 from '../assets/images/296A0113-31-min.jpeg';
import img11 from '../assets/images/296A0118-32-min.jpeg';
import img12 from '../assets/images/296A0184-33-min.jpeg';
import img13 from '../assets/images/296A0186-34-min.jpeg';
import img14 from '../assets/images/296A0190-35-min.jpeg';
import img15 from '../assets/images/296A0192-36-min.jpeg';
import img16 from '../assets/images/296A0202-37-min.jpeg';
import img17 from '../assets/images/296A0205-38-min.jpeg';
import img18 from '../assets/images/296A0209-39-min.jpeg';
import img19 from '../assets/images/296A0219-40-min.jpeg';
import img20 from '../assets/images/296A0224-41-min.jpeg';

const Gallery = () => {
    const images = [
        { url: img1, title: 'Mountain Trail Rush' },
        { url: img2, title: 'Sunset Peak Ride' },
        { url: img3, title: 'Valley Sprint' },
        { url: img4, title: 'Team Formation' },
        { url: img5, title: 'The Great Ascent' },
        { url: img6, title: 'Coastal Breeze' },
        { url: img7, title: 'Morning Mist Ride' },
        { url: img8, title: 'Peak Performance' },
        { url: img9, title: 'Trail Blazers' },
        { url: img10, title: 'Endurance Test' },
        { url: img11, title: 'Nature Sprint' },
        { url: img12, title: 'Group Harmony' },
        { url: img13, title: 'Summit Reach' },
        { url: img14, title: 'Wild Ride' },
        { url: img15, title: 'Speed of Light' },
        { url: img16, title: 'Rhythm of the Ride' },
        { url: img17, title: 'Horizon Call' },
        { url: img18, title: 'Spirit of Warrior' },
        { url: img19, title: 'Boundless Energy' },
        { url: img20, title: 'Final Push' }
    ];

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
