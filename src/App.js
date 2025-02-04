import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import 'tailwindcss/tailwind.css';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.div
        className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity }}
      ></motion.div>
      <p className="text-lg font-semibold text-gray-700 mt-4">Fetching books...</p>
    </div>
  );
};

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("https://www.googleapis.com/books/v1/volumes?q=art&maxResults=21");
        setBooks(response.data.items || []);
      } catch (err) {
        setError("Failed to fetch book data.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">📚 Books Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => {
          const volumeInfo = book.volumeInfo;
          return (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x200?text=No+Cover"}
                alt={volumeInfo.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{volumeInfo.title || "Untitled"}</h2>
                <p className="text-gray-600 text-sm">{volumeInfo.authors?.join(", ") || "Unknown Author"}</p>
                <p className="text-gray-500 text-sm mt-2 line-clamp-3">{volumeInfo.description || "No description available."}</p>
                <a
                  href={volumeInfo.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm hover:underline mt-2 block"
                >
                  View Details
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BooksPage;
