/**
 * Highlight photos for the public site: homepage hero and collage, About page
 * and circuit cards. A mix of 2025 and 2026 (both on Cloudinary) race-day
 * photos, from the client shortlist of November 2026.
 *
 * Swap a photo here and every page that shows it follows.
 */
import hosted from '../assets/gallery-hosted.json';
import { galleryImage } from '../utils/cloudinary';

export interface Highlight {
    year: 2025 | 2026;
    src: string;
    srcSet?: string;
    alt: string;
    width?: number;
    height?: number;
}

/**
 * Crops for the 2026 Cloudinary photos, as fractions of the original.
 * Every 2026 file has a thin white frame and the photographer's logo in the
 * top-left corner, so each crop trims the frame and keeps the logo out.
 */
const CROP_TILE = 'c_crop,x_0.15,y_0.02,w_0.84,h_0.96';
const CROP_HERO = 'c_crop,x_0.012,y_0.19,w_0.976,h_0.79';

/** Fractions of width/height kept by each crop, to give <img> its intrinsic size. */
const CROP_SIZE: Record<string, [number, number]> = { [CROP_TILE]: [0.84, 0.96], [CROP_HERO]: [0.976, 0.79] };

const WIDTHS = [600, 1200, 1920];

/** Cloudinary delivery URL: crop first, then size and auto-format. */
export const cloudinaryHighlightUrl = (publicId: string, width: number, crop = CROP_TILE) =>
    `https://res.cloudinary.com/${hosted.cloudName}/image/upload/${crop}/f_auto,q_auto,c_limit,w_${width}/${publicId}`;

const photo2026 = (n: number, alt: string, crop = CROP_TILE): Highlight => {
    const publicId = `rwtw/2026/race-day/rwtw-2026-${String(n).padStart(3, '0')}`;
    const img = galleryImage(publicId);
    const [fw, fh] = CROP_SIZE[crop];
    return {
        year: 2026,
        src: cloudinaryHighlightUrl(publicId, 1200, crop),
        srcSet: WIDTHS.map(w => `${cloudinaryHighlightUrl(publicId, w, crop)} ${w}w`).join(', '),
        alt,
        width: Math.round(img.width * fw),
        height: Math.round(img.height * fh),
    };
};

const ALBUM_2025 = 'rwtw/2025/ride-with-the-warriors-2025/';

const photo2025 = (file: string, alt: string): Highlight => {
    const img = galleryImage(ALBUM_2025 + file);
    return {
        year: 2025,
        src: cloudinaryHighlightUrl(img.publicId, 1200, 'c_limit'),
        srcSet: WIDTHS.map(w => `${cloudinaryHighlightUrl(img.publicId, w, 'c_limit')} ${w}w`).join(', '),
        alt,
        width: img.width,
        height: img.height,
    };
};

/** Homepage hero: the whole festival dancing in front of the main marquee. */
export const HERO_HIGHLIGHT = photo2026(17, 'Riders and families dancing in front of the main marquee at RWTW 2026', CROP_HERO);

/** Homepage "Our Mission" collage, in grid order (left column, then right). */
export const HOME_COLLAGE: Highlight[] = [
    photo2026(31, 'Three finishers posing with their RWTW 2026 medals'),
    photo2025('whatsapp-image-2026-01-28-at-10-38-51', 'Young rider punching the air at the RWTW 2025 finish'),
    photo2025('296a0113-31-min', 'Kids in helmets lining up for the RWTW 2025 family ride'),
    photo2026(18, 'Riders clapping and dancing in the crowd at RWTW 2026'),
];

/** About page images. */
export const ABOUT_HIGHLIGHTS = {
    story: photo2026(39, 'Medal-wearing riders in a conga line at RWTW 2026'),
    mosaic: [
        photo2025('whatsapp-image-2026-01-28-at-10-38-30', 'Riders hugging at the RWTW 2025 finish line'),
        photo2026(84, 'Finishers relaxing in the lounge with their RWTW 2026 medals'),
        photo2025('0j6a9936-17-min', 'Parent steadying a young rider at RWTW 2025'),
    ],
    history: photo2025('whatsapp-image-2026-01-28-at-10-45-50', 'Three riders smiling at the RWTW 2025 start line'),
    fraternity: photo2026(116, 'KDF Airborne parachutists descending over RWTW 2026'),
};

export type CircuitId = 'blitz' | 'recon' | 'corporate' | 'family';

/** One photo per circuit, used on the Circuits page and in registration. */
export const CIRCUIT_HIGHLIGHTS: Record<CircuitId, Highlight> = {
    blitz: photo2025('0j6a9994-22-min', 'Two road riders smiling beside their bikes at RWTW 2025'),
    recon: photo2026(63, 'Smiling rider with his road bike at RWTW 2026'),
    corporate: photo2026(28, 'Two finishers celebrating with their RWTW 2026 medals'),
    family: photo2025('whatsapp-image-2026-01-28-at-10-36-44', 'Kids lined up on their bikes at RWTW 2025'),
};

/** Props for an <img> showing a highlight. `data-year` lets tests check the year mix. */
export const highlightImgProps = (h: Highlight, sizes = '(min-width: 1024px) 50vw, 100vw') => ({
    src: h.src,
    srcSet: h.srcSet,
    sizes: h.srcSet ? sizes : undefined,
    alt: h.alt,
    width: h.width,
    height: h.height,
    'data-year': h.year,
});
