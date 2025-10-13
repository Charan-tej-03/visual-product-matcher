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
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">
              ← Back
            </button>
            <h2 className="text-2xl font-semibold">Search Results</h2>
          </div>

          {queryPreview && (
            <div className="mb-6">
              <h3 className="text-sm text-gray-600 mb-2">Query image</h3>
              <div className="w-40 h-40 border rounded overflow-hidden">
                <img src={queryPreview} alt="query" className="w-full h-full object-contain" />
              </div>
            </div>
          )}

          {results.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
