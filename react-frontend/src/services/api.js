import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function searchImage(file, imageUrl, k = 5, min_score = 0.25) {
  const formData = new FormData();
  if (file) {
    formData.append("image", file);
  } else if (imageUrl && imageUrl.trim() !== "") {
    formData.append("image_url", imageUrl.trim());
  }

  const res = await fetch(`${import.meta.env.VITE_API_BASE}/search?k=${k}&min_score=${min_score}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Search failed");
  }

  return await res.json();
}

export async function listProducts() {
  const resp = await axios.get(`${API_BASE}/products`);
  return resp.data;
}

export async function addProduct({ file, name, category, price, description }) {
  const form = new FormData();
  form.append("image", file);
  form.append("name", name);
  form.append("category", category);
  form.append("price", price);
  if (description) form.append("description", description);

  const resp = await axios.post(`${API_BASE}/add-product`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return resp.data;
}