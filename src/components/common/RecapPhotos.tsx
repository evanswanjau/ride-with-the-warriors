import hosted from '../../assets/gallery-hosted.json';
import { cldImgProps } from '../../utils/cloudinary';
import { PAST_EDITION } from '../../config/edition';

/**
 * Thumbnails from the archive gallery snapshot (the last finished ride).
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
                alt={`Ride With The Warriors ${PAST_EDITION.year} race day`}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[4/3] object-cover"
            />
        ))}
    </div>
);

export default RecapPhotos;
