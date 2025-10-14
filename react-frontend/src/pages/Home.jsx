import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchImage } from "../services/api";
import Navbar from "../components/Navbar";

export default function Home() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setImageUrl("");
      setPreview(URL.createObjectURL(f));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setFile(null);
    setPreview(url || null);
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
  
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/search?k=3`, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      console.log(data);
  
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
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold mb-4">
            Upload or paste image URL to find similar products
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Or paste image URL..."
                value={imageUrl}
                onChange={handleUrlChange}
                className="w-full border rounded p-2 text-sm"
              />
            </div>

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
                onClick={clearInputs}
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