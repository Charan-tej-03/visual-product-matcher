import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [k, setK] = useState(5);
  const [minSim, setMinSim] = useState(0.5);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setImageUrl(""); // Clear URL if file is selected
      setPreview(URL.createObjectURL(f));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url) {
      setFile(null); // Clear file if URL is entered
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl && !file) {
      alert("Please provide an image or a valid URL");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (file) formData.append("image", file);
      if (imageUrl) formData.append("image_url", imageUrl);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/search?k=${k}&min_score=${minSim}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      navigate("/results", { state: { results: data, queryPreview: preview } });
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearInputs = () => {
    setFile(null);
    setImageUrl("");
    setPreview(null);
    setK(5);
    setMinSim(0.5);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
            Find Similar Products
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Upload an image or paste a URL to search visually similar products.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Image Input Section */}
            <div className="space-y-6">
              {/* Upload */}
              <div className="flex flex-col items-center gap-2">
                <label className="font-medium text-gray-700 text-sm self-start">
                  Upload an image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={!!imageUrl}
                  className={`block w-full text-sm text-gray-600 
                    file:mr-4 file:py-2 file:px-4 
                    file:rounded-lg file:border-0 
                    file:text-sm file:font-medium 
                    file:bg-blue-100 file:text-blue-700 
                    hover:file:bg-blue-200 transition
                    ${imageUrl ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </div>

              {/* Divider */}
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="absolute left-1/2 transform -translate-x-1/2 bg-white px-3 text-gray-500 text-sm">
                  or
                </span>
              </div>

              {/* URL Input */}
              <div className="flex flex-col items-center gap-2">
                <label className="font-medium text-gray-700 text-sm self-start">
                  Paste image URL:
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  disabled={!!file}
                  className={`w-full border border-gray-300 rounded-lg p-2 text-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-400
                    ${file ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <div className="border rounded-lg p-2 w-full flex items-center justify-center bg-gray-50">
                <img
                  src={preview}
                  alt="preview"
                  className="max-h-64 object-contain rounded-md"
                />
              </div>
            )}

            {/* Parameters */}
            <div className="bg-gray-50 border rounded-lg p-4 flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Number of Similar Products:{" "}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={k}
                  onChange={(e) => setK(Number(e.target.value))}
                  className="mt-1 w-24 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Minimum Similarity:{" "}
                  <span className="font-semibold text-blue-600">
                    {(minSim * 100).toFixed(0)}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={minSim}
                  onChange={(e) => setMinSim(parseFloat(e.target.value))}
                  className="w-full mt-2 accent-blue-600"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={clearInputs}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-60"
              >
                {loading ? "Searching..." : "Search Similar Products"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
