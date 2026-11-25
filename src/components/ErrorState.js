import useCountdown from "../hooks/useCountdown";

const ErrorState = ({ message, onRetry, retryAfter }) => {
  const secondsLeft = useCountdown(retryAfter);
  const blocked = secondsLeft > 0;

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <p className="text-lg font-semibold text-red-700 mb-4">
        {message || "Something went wrong."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={blocked}
          aria-disabled={blocked}
          className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-[var(--mfe-accent-ink,#065f46)] focus:outline-none focus:ring-2 focus:ring-[color:var(--mfe-accent,#047857)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {blocked ? `Retry in ${secondsLeft}s` : "Retry"}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
