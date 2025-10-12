import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchImage } from "../services/api";
import Navbar from "../components";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    setLoading(true);
    try {
      const results = await searchImage(file);
      // pass results via state to Results page
      navigate("/results", { state: { results } });
    } catch (err) {
      console.error(err);
      alert("Error searching image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-12">
        <h2 className="text-2xl font-semibold mb-6">Upload an Image to Find Similar Products</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full
                       file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
    </>
  );
}
