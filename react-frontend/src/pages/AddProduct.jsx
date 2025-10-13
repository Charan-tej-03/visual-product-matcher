import { useState } from "react";
import Navbar from "../components/Navbar";
import { addProduct } from "../services/api";

export default function AddProduct() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name || !category || !price) {
      setMessage("Please fill all required fields");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await addProduct({ file, name, category, price, description });
      if (res.success) {
        setMessage("Product added successfully!");
        setFile(null);
        setPreview(null);
        setName("");
        setCategory("");
        setPrice("");
        setDescription("");
      } else {
        setMessage("Failed to add product");
      }
    } catch (err) {
      setMessage("Error: " + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
        <div className="w-full max-w-lg bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600"
            />

            {preview && (
              <div className="border rounded p-2 w-full flex justify-center">
                <img src={preview} alt="preview" className="max-h-48 object-contain" />
              </div>
            )}

            <input
              type="text"
              placeholder="Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Category*"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Price*"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded px-3 py-2"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-2 rounded disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>

            {message && <p className="text-center text-sm">{message}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
