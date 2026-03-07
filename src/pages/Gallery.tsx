import { useState } from 'react';
import '../styles/gallery.css';

// Dynamically import all images from assets/images
const imageModules = import.meta.glob('../assets/images/*.{jpeg,jpg,png,svg,webp}', { eager: true });

/* ─── Lightbox ────────────────────────────────────────────────────────────── */
interface GalleryImage { url: string; title: string; }
interface LightboxProps {
    images: GalleryImage[];
    index: number | null;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}
const Lightbox = ({ images, index, onClose, onPrev, onNext }: LightboxProps) => {
    if (index === null) return null;
    const img = images[index];
    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <button className="lightbox-close" onClick={onClose}>✕</button>
            <button className="lightbox-arrow lightbox-prev" onClick={(e) => { e.stopPropagation(); onPrev(); }}>‹</button>
            <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
                <img src={img.url} alt={img.title} className="lightbox-img" />
                <div className="lightbox-caption">
                    <span className="lightbox-index">{index + 1} / {images.length}</span>
                    <span className="lightbox-title">{img.title}</span>
                </div>
            </div>
            <button className="lightbox-arrow lightbox-next" onClick={(e) => { e.stopPropagation(); onNext(); }}>›</button>
        </div>
    );
};

/* ─── Gallery ─────────────────────────────────────────────────────────────── */
const Gallery = () => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const images = Object.entries(imageModules).map(([path, module]) => {
        const filename = path.split('/').pop() || '';
        const title = filename
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        return { url: (module as any).default, title };
    });
    images.sort((a, b) => a.title.localeCompare(b.title));

    const openLightbox = (idx: number) => setLightboxIndex(idx);
    const closeLightbox = () => setLightboxIndex(null);
    const prevImage = () => setLightboxIndex((i) => i !== null ? (i - 1 + images.length) % images.length : 0);
    const nextImage = () => setLightboxIndex((i) => i !== null ? (i + 1) % images.length : 0);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (lightboxIndex === null) return;
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'Escape') closeLightbox();
    };

    return (
        <>


            <div
                className="page"
                style={{ padding: '100px 48px 80px' }}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
            >
                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="gallery-header">
                    <div className="page-label-row">
                        <div className="page-label-line" />
                        <span className="page-eyebrow">Visual Archive</span>
                    </div>
                    <h1 className="page-display page-title">
                        Event<span className="page-accent">Gallery.</span>
                    </h1>
                    <p className="page-subtitle">
                        Relive the most intense moments from previous Ride With The Warriors events —
                        from epic climbs to muddy sprints.
                    </p>
                    <div className="gallery-meta-row">
                        <div className="gallery-count">
                            <div className="gallery-count-dot" />
                            {images.length} Photos
                        </div>
                        <div className="gallery-meta-line" />
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gallery-text-3)' }}>
                            2025 Edition
                        </span>
                    </div>
                </div>

                {/* ── Grid ───────────────────────────────────────────────── */}
                {images.length > 0 ? (
                    <div className="gallery-grid">
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className="gallery-item"
                                onClick={() => openLightbox(idx)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
                                aria-label={`Open ${img.title}`}
                            >
                                <img src={img.url} alt={img.title} loading="lazy" />
                                <div className="gallery-item-overlay">
                                    <span className="gallery-item-title">{img.title}</span>
                                    <div className="gallery-item-expand">⤢</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="gallery-empty">
                        <div className="gallery-empty-label">No Images Yet</div>
                        <p className="gallery-empty-sub">Gallery photos will appear here once uploaded.</p>
                    </div>
                )}
            </div>

            {/* ── Lightbox ───────────────────────────────────────────────── */}
            <Lightbox
                images={images}
                index={lightboxIndex}
                onClose={closeLightbox}
                onPrev={prevImage}
                onNext={nextImage}
            />
        </>
    );
};

export default Gallery;