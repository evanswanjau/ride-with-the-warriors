/**
 * Highlight photos for the public site: homepage hero and collage, About page
 * and circuit cards. A mix of 2025 (bundled) and 2026 (Cloudinary) race-day
 * photos, from the client shortlist of November 2026.
 *
 * Swap a photo here and every page that shows it follows.
 */
import hosted from '../assets/gallery-hosted.json';

import hug2025 from '../assets/images/gallery/Ride-With-The-Warriors-2025/WhatsApp Image 2026-01-28 at 10.38.30.jpeg';
import parentAndKid2025 from '../assets/images/gallery/Ride-With-The-Warriors-2025/0J6A9936-17-min.jpeg';
import threeRiders2025 from '../assets/images/gallery/Ride-With-The-Warriors-2025/WhatsApp Image 2026-01-28 at 10.45.50.jpeg';
import roadRiders2025 from '../assets/images/gallery/Ride-With-The-Warriors-2025/0J6A9994-22-min.jpeg';
import kidsLineup2025 from '../assets/images/gallery/Ride-With-The-Warriors-2025/WhatsApp Image 2026-01-28 at 10.36.44.jpeg';
import kidsGroup2025 from '../assets/images/gallery/Ride-With-The-Warriors-2025/296A0113-31-min.jpeg';
import fistPump2025 from '../assets/images/gallery/Ride-With-The-Warriors-2025/WhatsApp Image 2026-01-28 at 10.38.51.jpeg';

export interface Highlight {
    year: 2025 | 2026;
    src: string;
    srcSet?: string;
    alt: string;
}

/**
 * Crops for the 2026 Cloudinary photos, as fractions of the original.
 * Every 2026 file has a thin white frame and the photographer's logo in the
 * top-left corner, so each crop trims the frame and keeps the logo out.
 */
const CROP_TILE = 'c_crop,x_0.15,y_0.02,w_0.84,h_0.96';
const CROP_HERO = 'c_crop,x_0.012,y_0.19,w_0.976,h_0.79';

const WIDTHS = [600, 1200, 1920];

/** Cloudinary delivery URL: crop first, then size and auto-format. */
export const cloudinaryHighlightUrl = (publicId: string, width: number, crop = CROP_TILE) =>
    `https://res.cloudinary.com/${hosted.cloudName}/image/upload/${crop}/f_auto,q_auto,c_limit,w_${width}/${publicId}`;

const hostedIds = new Set(hosted.photos.map(p => p.publicId));

const photo2026 = (n: number, alt: string, crop = CROP_TILE): Highlight => {
    const publicId = `rwtw/2026/race-day/rwtw-2026-${String(n).padStart(3, '0')}`;
    if (!hostedIds.has(publicId)) throw new Error(`Highlight ${publicId} is not in gallery-hosted.json`);
    return {
        year: 2026,
        src: cloudinaryHighlightUrl(publicId, 1200, crop),
        srcSet: WIDTHS.map(w => `${cloudinaryHighlightUrl(publicId, w, crop)} ${w}w`).join(', '),
        alt,
    };
};

const photo2025 = (src: string, alt: string): Highlight => ({ year: 2025, src, alt });

/** Homepage hero: the whole festival dancing in front of the main marquee. */
export const HERO_HIGHLIGHT = photo2026(17, 'Riders and families dancing in front of the main marquee at RWTW 2026', CROP_HERO);

/** Homepage "Our Mission" collage, in grid order (left column, then right). */
export const HOME_COLLAGE: Highlight[] = [
    photo2026(31, 'Three finishers posing with their RWTW 2026 medals'),
    photo2025(fistPump2025, 'Young rider punching the air at the RWTW 2025 finish'),
    photo2025(kidsGroup2025, 'Kids in helmets lining up for the RWTW 2025 family ride'),
    photo2026(18, 'Riders clapping and dancing in the crowd at RWTW 2026'),
];

/** About page images. */
export const ABOUT_HIGHLIGHTS = {
    story: photo2026(39, 'Medal-wearing riders in a conga line at RWTW 2026'),
    mosaic: [
        photo2025(hug2025, 'Riders hugging at the RWTW 2025 finish line'),
        photo2026(84, 'Finishers relaxing in the lounge with their RWTW 2026 medals'),
        photo2025(parentAndKid2025, 'Parent steadying a young rider at RWTW 2025'),
    ],
    history: photo2025(threeRiders2025, 'Three riders smiling at the RWTW 2025 start line'),
    fraternity: photo2026(116, 'KDF Airborne parachutists descending over RWTW 2026'),
};

export type CircuitId = 'blitz' | 'recon' | 'corporate' | 'family';

/** One photo per circuit, used on the Circuits page and in registration. */
export const CIRCUIT_HIGHLIGHTS: Record<CircuitId, Highlight> = {
    blitz: photo2025(roadRiders2025, 'Two road riders smiling beside their bikes at RWTW 2025'),
    recon: photo2026(63, 'Smiling rider with his road bike at RWTW 2026'),
    corporate: photo2026(28, 'Two finishers celebrating with their RWTW 2026 medals'),
    family: photo2025(kidsLineup2025, 'Kids lined up on their bikes at RWTW 2025'),
};

/** Props for an <img> showing a highlight. `data-year` lets tests check the year mix. */
export const highlightImgProps = (h: Highlight, sizes = '(min-width: 1024px) 50vw, 100vw') => ({
    src: h.src,
    srcSet: h.srcSet,
    sizes: h.srcSet ? sizes : undefined,
    alt: h.alt,
    'data-year': h.year,
});
