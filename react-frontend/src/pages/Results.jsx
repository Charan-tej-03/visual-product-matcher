import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
        {results.length === 0 ? (
          <p>No results. Try uploading another image.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map((item) => (
              <div key={item.id} className="border rounded-lg p-2 shadow hover:shadow-lg transition">
                <img
                  src={`http://127.0.0.1:5000/static/images/${item.image_filename}`}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="mt-2 font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">{(item.score * 100).toFixed(1)}% match</p>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    </>
  );
}
