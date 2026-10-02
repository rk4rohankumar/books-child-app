import { useState } from "react";
import { motion } from "framer-motion";

const COVER_WIDTH = 128;
const COVER_HEIGHT = 192;

const PlaceholderCover = ({ title }) => (
  <svg
    role="img"
    aria-label={`No cover available for ${title}`}
    viewBox={`0 0 ${COVER_WIDTH} ${COVER_HEIGHT}`}
    className="h-full w-full"
  >
    <rect width={COVER_WIDTH} height={COVER_HEIGHT} fill="#1e3a8a" />
    <rect x="22" y="40" width="84" height="112" rx="4" fill="#3b82f6" />
    <rect x="30" y="40" width="8" height="112" fill="#1d4ed8" />
    <path d="M48 70h44M48 86h44M48 102h32" stroke="#dbeafe" strokeWidth="4" strokeLinecap="round" />
    <text
      x="64"
      y="176"
      textAnchor="middle"
      fontFamily="system-ui, sans-serif"
      fontSize="11"
      fontWeight="600"
      fill="#eff6ff"
    >
      No cover
    </text>
  </svg>
);

const BookCard = ({ book }) => {
  const { title, authors, description, thumbnail, infoLink } = book;
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(thumbnail) && !imgFailed;

  return (
    <motion.article
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full h-56 bg-blue-950 flex items-center justify-center overflow-hidden">
        {showImage ? (
          <img
            src={thumbnail}
            alt={`Cover of ${title}`}
            width={COVER_WIDTH}
            height={COVER_HEIGHT}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="h-full w-auto object-contain"
          />
        ) : (
          <PlaceholderCover title={title} />
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-700 text-sm">{authors}</p>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3 flex-1">
          {description}
        </p>
        {infoLink && (
          <a
            href={infoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 text-sm hover:underline mt-3 inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            View Details
            <span className="sr-only"> for {title} (opens in a new tab)</span>
          </a>
        )}
      </div>
    </motion.article>
  );
};

export default BookCard;
