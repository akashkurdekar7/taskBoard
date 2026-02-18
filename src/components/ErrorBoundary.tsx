import { useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error: any = useRouteError();

  return (
    <div className="h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h1>
        <p className="text-gray-700 mb-4">
          An unexpected error has occurred.
        </p>
        <div className="bg-gray-100 p-4 rounded overflow-auto max-h-60 mb-6">
            <code className="text-sm text-gray-800">
              {error.statusText || error.message}
            </code>
        </div>
        <button
          onClick={() => window.location.href = "/"}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
