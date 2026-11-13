import hosted from '../../assets/gallery-hosted.json';
import { cldImgProps } from '../../utils/cloudinary';

/**
 * Thumbnails from the 2026 gallery snapshot.
 * TODO(COD-147): swap for approved picks
 */
const RecapPhotos = ({ count }: { count: number }) => (
    <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        data-testid="recap-photos"
    >
        {hosted.photos.slice(0, count).map((p) => (
            <img
                key={p.publicId}
                {...cldImgProps({ publicId: p.publicId, width: p.width, height: p.height }, 480)}
                sizes="(min-width: 1024px) 25vw, 50vw"
                alt="Ride With The Warriors 2026 race day"
                loading="lazy"
                decoding="async"
                className="w-full aspect-[4/3] object-cover"
            />
        ))}
    </div>
);

export default RecapPhotos;
