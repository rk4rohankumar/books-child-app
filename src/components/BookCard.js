import { useState } from "react";
import { motion } from "framer-motion";

const FallbackCover = ({ title }) => (
  <div className="w-full h-56 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 p-4">
    <span className="text-white text-xl font-bold text-center line-clamp-4">
      {title || "Untitled"}
    </span>
  </div>
);

const BookCard = ({ book }) => {
  const volumeInfo = book?.volumeInfo;
  const title = volumeInfo?.title ?? "Untitled";
  const authors = volumeInfo?.authors?.join(", ") ?? "Unknown";
  const description = volumeInfo?.description ?? "No description available.";
  const thumbnail = volumeInfo?.imageLinks?.thumbnail;
  const infoLink = volumeInfo?.infoLink;

  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.article
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {thumbnail && !imgFailed ? (
        <img
          src={thumbnail}
          alt={`Cover of ${title}`}
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
          className="w-full h-56 object-cover"
        />
      ) : (
        <FallbackCover title={title} />
      )}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600 text-sm">{authors}</p>
        <p className="text-gray-500 text-sm mt-2 line-clamp-3 flex-1">
          {description}
        </p>
        {infoLink && (
          <a
            href={infoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm hover:underline mt-3 inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            View Details
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </motion.article>
  );
};

export default BookCard;
