import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];
  const queryPreview = location.state?.queryPreview || null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-3xl font-semibold text-gray-800 tracking-tight">
              Search Results
            </h2>
          </div>

          {/* Query Preview */}
          {queryPreview && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
                Query Image
              </h3>
              <div className="w-44 h-44 border border-gray-300 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                <img
                  src={queryPreview}
                  alt="query"
                  className="w-full h-full object-contain p-2"
                />
              </div>
            </div>
          )}

          {/* Results */}
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-5.2-5.2M10 18a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or uploading a different image.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-4">
                Found <span className="font-semibold">{results.length}</span>{" "}
                {results.length === 1 ? "product" : "products"} matching your search
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((p) => (
                  <div
                    key={p.id}
                    className="transform hover:scale-[1.02] transition"
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
