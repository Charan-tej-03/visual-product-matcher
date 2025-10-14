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
      setMessage("⚠️ Please fill all required fields");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await addProduct({ file, name, category, price, description });
      if (res.success) {
        setMessage("✅ Product added successfully!");
        setFile(null);
        setPreview(null);
        setName("");
        setCategory("");
        setPrice("");
        setDescription("");
      } else {
        setMessage("❌ Failed to add product");
      }
    } catch (err) {
      setMessage("⚠️ " + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 flex justify-center">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Add New Product
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2 file:px-4 
                  file:rounded-full file:border-0 
                  file:text-sm file:font-semibold 
                  file:bg-blue-50 file:text-blue-700 
                  hover:file:bg-blue-100 cursor-pointer"
              />

              {preview && (
                <div className="mt-4 flex justify-center">
                  <div className="w-40 h-40 border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-gray-50 hover:shadow-md transition">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Text Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg px-3 py-2 w-full outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Electronics, Apparel"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg px-3 py-2 w-full outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg px-3 py-2 w-full outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Write a short product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg px-3 py-2 w-full outline-none min-h-[100px] resize-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 py-3 text-white rounded-lg font-medium transition 
                ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>

            {/* Message */}
            {message && (
              <p
                className={`text-center text-sm mt-2 font-medium ${
                  message.includes("success")
                    ? "text-green-600"
                    : message.includes("Failed")
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
