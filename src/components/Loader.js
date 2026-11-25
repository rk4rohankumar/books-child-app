import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="w-16 h-16 border-4 border-t-blue-500 border-[color:var(--mfe-border,#e2e8f0)] rounded-full motion-safe:animate-spin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      />
      <p className="text-lg font-semibold text-[color:var(--mfe-muted,#475569)] mt-4">
        Fetching books...
      </p>
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default Loader;
