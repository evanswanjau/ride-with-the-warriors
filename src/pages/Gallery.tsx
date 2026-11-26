import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/gallery.css';
import { API_BASE_URL } from '../config';
// Snapshot of the Cloudinary-hosted albums, so the gallery works even when the
// API has no gallery endpoint. The API list (when available) replaces it.
import hostedManifest from '../assets/gallery-hosted.json';

/* ─── Data ────────────────────────────────────────────────────────────────── */
interface HostedPhoto { eventYear: number; album: string; publicId: string; caption: string | null; }

interface GalleryImage {
    url: string; thumb: string; thumbSrcSet: string; title: string;
    year: number; album: string; albumSlug: string;
}

/** Sized, auto-format Cloudinary delivery URL. */
const cloudinaryUrl = (cloud: string, publicId: string, width: number) =>
    `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,c_limit,w_${width}/${publicId}`;
/** Square thumbnail: edge-to-edge tiles, sized for 3 (phone), 4 (tablet) or 6 (desktop) per row. */
const squareUrl = (cloud: string, publicId: string, width: number) =>
    `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,c_fill,g_auto,ar_1:1,w_${width}/${publicId}`;

/** Thumbnail widths; the browser picks one from THUMB_SIZES (1, 2 or 3 columns). */
const THUMB_WIDTHS = [240, 400, 600];
const THUMB_SIZES = '(min-width: 1280px) 16vw, (min-width: 640px) 25vw, 33vw';
/** Photos per album in the "All" view, and per "load more" step inside one album. */
const PREVIEW_COUNT = 12;
const PAGE_SIZE = 120;

const albumSlug = (album: string) => album.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Albums in the order the day unfolded; anything new goes after, alphabetically. */
const ALBUM_ORDER = ['pre-race-registration', 'setup-vendors', 'race-day', 'circuit-races', 'podium-medals', 'prize-giving'];
const albumRank = (slug: string) => { const i = ALBUM_ORDER.indexOf(slug); return i === -1 ? ALBUM_ORDER.length : i; };

const toGalleryImages = (cloud: string, photos: HostedPhoto[]): GalleryImage[] => photos.map(p => ({
    url: cloudinaryUrl(cloud, p.publicId, 1600),
    thumb: squareUrl(cloud, p.publicId, 400),
    thumbSrcSet: THUMB_WIDTHS.map(w => `${squareUrl(cloud, p.publicId, w)} ${w}w`).join(', '),
    title: p.caption || p.album,
    year: p.eventYear,
    album: p.album,
    albumSlug: albumSlug(p.album),
}));

/* ─── Lightbox ────────────────────────────────────────────────────────────── */
interface LightboxProps {
    images: GalleryImage[];
    index: number | null;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}
const SWIPE_PX = 50;

const Lightbox = ({ images, index, onClose, onPrev, onNext }: LightboxProps) => {
    const touchStart = useRef<{ x: number; y: number } | null>(null);
    const open = index !== null;

    // Keyboard works wherever focus is while the lightbox is open.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') onPrev();
            else if (e.key === 'ArrowRight') onNext();
            else if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onPrev, onNext, onClose]);

    if (index === null || !images[index]) return null;
    const img = images[index];
    const next = images[(index + 1) % images.length];

    return (
        <div
            className="lightbox-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            data-testid="lightbox"
            onClick={onClose}
            onTouchStart={(e) => { const t = e.touches[0]; touchStart.current = { x: t.clientX, y: t.clientY }; }}
            onTouchEnd={(e) => {
                const s = touchStart.current; touchStart.current = null;
                if (!s) return;
                const t = e.changedTouches[0];
                const dx = t.clientX - s.x, dy = t.clientY - s.y;
                if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? onNext : onPrev)();
            }}
        >
            <button className="lightbox-close" aria-label="Close" onClick={onClose}>✕</button>
            <button className="lightbox-arrow lightbox-prev" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); onPrev(); }}>‹</button>
            <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
                <img src={img.url} alt={img.title} className="lightbox-img" data-testid="lightbox-img" />
                <div className="lightbox-caption">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="lightbox-title">{img.title}</span>
                        <span className="lightbox-index" style={{ color: 'var(--color-primary-light)', fontSize: '0.6rem' }}>RWTW {img.year} · {img.album}</span>
                    </div>
                    <span className="lightbox-index" data-testid="lightbox-counter">{index + 1} / {images.length}</span>
                </div>
            </div>
            <button className="lightbox-arrow lightbox-next" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); onNext(); }}>›</button>
            {/* Warm the next photo so swiping feels instant. */}
            <img src={next.url} alt="" aria-hidden="true" style={{ display: 'none' }} />
        </div>
    );
};

/* ─── Gallery ─────────────────────────────────────────────────────────────── */
const Gallery = () => {
    const [params, setParams] = useSearchParams();
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [hostedImages, setHostedImages] = useState<GalleryImage[]>(
        () => toGalleryImages(hostedManifest.cloudName, hostedManifest.photos),
    );

    // Photos hosted on Cloudinary. Prefer the live API list when the server
    // provides one; otherwise keep the bundled snapshot.
    useEffect(() => {
        let cancelled = false;
        fetch(`${API_BASE_URL}/gallery`)
            .then(r => (r.ok ? r.json() : null))
            .then((data: { cloudName: string | null; photos: HostedPhoto[] } | null) => {
                if (cancelled || !data?.cloudName || !data.photos?.length) return;
                setHostedImages(toGalleryImages(data.cloudName, data.photos));
            })
            .catch(() => { /* no gallery API: keep the bundled snapshot */ });
        return () => { cancelled = true; };
    }, []);

    // Years newest first; the URL (?year=&album=) picks the view, so pages can deep-link.
    const years = useMemo(() => Array.from(new Set(hostedImages.map(i => i.year))).sort((a, b) => b - a), [hostedImages]);
    const requestedYear = Number(params.get('year'));
    const year = years.includes(requestedYear) ? requestedYear : (years[0] ?? 0);

    const yearImages = useMemo(() => hostedImages.filter(i => i.year === year), [hostedImages, year]);
    const albums = useMemo(() => {
        const bySlug = new Map<string, { slug: string; name: string; count: number; cover: GalleryImage }>();
        for (const img of yearImages) {
            const a = bySlug.get(img.albumSlug);
            if (a) a.count++;
            else bySlug.set(img.albumSlug, { slug: img.albumSlug, name: img.album, count: 1, cover: img }); // first = best shot
        }
        return Array.from(bySlug.values()).sort((a, b) => albumRank(a.slug) - albumRank(b.slug) || a.name.localeCompare(b.name));
    }, [yearImages]);

    const requestedAlbum = params.get('album') ?? '';
    const album = albums.some(a => a.slug === requestedAlbum) ? requestedAlbum : '';
    // "All" shows each album as its own section (a short preview + "See all"); one album shows a long, paged grid.
    const [shown, setShown] = useState({ key: '', count: PAGE_SIZE });
    const viewKey = `${year}|${album}`;
    const pageCount = shown.key === viewKey ? shown.count : PAGE_SIZE;
    const sections = useMemo(() => {
        if (album) {
            const a = albums.find(x => x.slug === album)!;
            return [{ ...a, images: yearImages.filter(i => i.albumSlug === album).slice(0, pageCount), total: a.count }];
        }
        return albums.map(a => ({ ...a, images: yearImages.filter(i => i.albumSlug === a.slug).slice(0, PREVIEW_COUNT), total: a.count }));
    }, [albums, album, yearImages, pageCount]);
    const filteredImages = useMemo(() => sections.flatMap(s => s.images), [sections]);
    const albumTotal = album ? (albums.find(a => a.slug === album)?.count ?? 0) : 0;

    const select = (nextYear: number, nextAlbum: string) => {
        const p = new URLSearchParams();
        p.set('year', String(nextYear));
        if (nextAlbum) p.set('album', nextAlbum);
        setParams(p, { replace: true });
        setLightboxIndex(null);
    };

    const count = filteredImages.length;
    const closeLightbox = () => setLightboxIndex(null);
    const prevImage = () => setLightboxIndex(i => (i !== null && count ? (i - 1 + count) % count : 0));
    const nextImage = () => setLightboxIndex(i => (i !== null && count ? (i + 1) % count : 0));

    return (
        <>
            <div className="page gallery-page">
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

                    {/* ── Year tabs ───────────────────────────────────────── */}
                    {years.length > 1 && (
                        <div className="gallery-categories gallery-years" role="tablist" aria-label="Event year">
                            {years.map(y => (
                                <button
                                    key={y}
                                    role="tab"
                                    aria-selected={y === year}
                                    data-testid={`year-${y}`}
                                    className={`category-tab ${y === year ? 'active' : ''}`}
                                    onClick={() => select(y, '')}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ── Album chips ─────────────────────────────────────── */}
                    {albums.length > 1 && (
                        <div className="gallery-categories gallery-albums" aria-label="Albums">
                            <button
                                className={`category-tab ${album === '' ? 'active' : ''}`}
                                aria-pressed={album === ''}
                                data-testid="album-all"
                                onClick={() => select(year, '')}
                            >
                                All<span className="category-tab-count">({yearImages.length})</span>
                            </button>
                            {albums.map(a => (
                                <button
                                    key={a.slug}
                                    className={`category-tab album-chip ${album === a.slug ? 'active' : ''}`}
                                    aria-pressed={album === a.slug}
                                    data-testid={`album-${a.slug}`}
                                    onClick={() => select(year, a.slug)}
                                >
                                    <img className="album-chip-cover" src={a.cover.thumb.replace('w_400', 'w_96')} alt="" loading="lazy" decoding="async" />
                                    {a.name}
                                    <span className="category-tab-count">({a.count})</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Grid ───────────────────────────────────────────────── */}
                {filteredImages.length > 0 ? (
                    <div data-testid="gallery-grid">
                        {sections.map(sec => {
                            const offset = sections.slice(0, sections.indexOf(sec)).reduce((n, x) => n + x.images.length, 0);
                            return (
                                <section key={sec.slug} className="gallery-section" data-testid={`section-${sec.slug}`}>
                                    {!album && (
                                        <div className="gallery-section-head">
                                            <h2 className="gallery-section-title">{sec.name}</h2>
                                            <span className="gallery-section-count">({sec.total})</span>
                                            {sec.total > sec.images.length && (
                                                <button className="gallery-see-all" data-testid={`see-all-${sec.slug}`} onClick={() => select(year, sec.slug)}>
                                                    See all
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <div className="gallery-grid">
                                        {sec.images.map((img, idx) => (
                                            <div
                                                key={img.url}
                                                className="gallery-item"
                                                onClick={() => setLightboxIndex(offset + idx)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && setLightboxIndex(offset + idx)}
                                                aria-label={`Open ${img.title}`}
                                            >
                                                <img src={img.thumb} srcSet={img.thumbSrcSet} sizes={THUMB_SIZES} alt={img.title} loading="lazy" decoding="async" data-testid="gallery-thumb" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                        {album && albumTotal > pageCount && (
                            <div className="gallery-more-row">
                                <button className="gallery-more" data-testid="load-more" onClick={() => setShown({ key: viewKey, count: pageCount + PAGE_SIZE })}>
                                    Load more ({albumTotal - pageCount} left)
                                </button>
                            </div>
                        )}
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
                images={filteredImages}
                index={lightboxIndex}
                onClose={closeLightbox}
                onPrev={prevImage}
                onNext={nextImage}
            />
        </>
    );
};

export default Gallery;
