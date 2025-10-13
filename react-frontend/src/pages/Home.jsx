import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchImage } from "../services/api";
import Navbar from "../components/Navbar";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    setLoading(true);
    try {
      const results = await searchImage(file, 12, 0.0);
      // navigate to results page and pass results via state
      navigate("/results", { state: { results, queryPreview: preview } });
    } catch (err) {
      console.error(err);
      alert("Search failed: " + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold mb-4">Upload an image to find similar products</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500"
            />

            {preview && (
              <div className="border rounded p-2 w-full flex items-center justify-center">
                <img src={preview} alt="preview" className="max-h-64 object-contain" />
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
              >
                {loading ? "Searching..." : "Search Similar Products"}
              </button>

              <button
                type="button"
                onClick={() => { setFile(null); setPreview(null); }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
