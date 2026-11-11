/**
 * Sized Cloudinary delivery URLs for photos hosted outside the bundle.
 * Always `f_auto,q_auto` (WebP/AVIF where supported) and width-limited.
 */
import hosted from '../assets/gallery-hosted.json';
import site from '../assets/site-images.json';

export const CLOUD_NAME = hosted.cloudName;

export const cldUrl = (publicId: string, width: number, cloud = CLOUD_NAME) =>
    `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,c_limit,w_${width}/${publicId}`;

export const cldSrcSet = (publicId: string, widths: number[]) =>
    widths.map(w => `${cldUrl(publicId, w)} ${w}w`).join(', ');

export interface HostedImage { publicId: string; width: number; height: number }

const dims = new Map<string, { width: number; height: number }>(
    hosted.photos.map(p => [p.publicId, { width: p.width, height: p.height }]),
);

/** A photo from the hosted gallery snapshot. Throws if it is missing, so typos fail loudly. */
export const galleryImage = (publicId: string): HostedImage => {
    const d = dims.get(publicId);
    if (!d) throw new Error(`${publicId} is not in gallery-hosted.json`);
    return { publicId, ...d };
};

/** A site image (not part of the gallery): `family`, `going-green`, ... */
export const siteImage = (name: keyof typeof site.images): HostedImage => site.images[name];

/** img props: sized URL, srcSet and the intrinsic size, so the layout never shifts. */
export const cldImgProps = (img: HostedImage, width: number, widths: number[] = [width / 2, width, width * 2]) => ({
    src: cldUrl(img.publicId, width),
    srcSet: cldSrcSet(img.publicId, widths.map(Math.round)),
    width: img.width,
    height: img.height,
});
