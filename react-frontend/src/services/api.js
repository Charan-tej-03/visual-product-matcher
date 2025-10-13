import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

export async function searchImage(file, k = 5, min_score = 0.25) {
  const form = new FormData();
  form.append("image", file);
  const resp = await axios.post(`${API_BASE}/search?k=${k}&min_score=${min_score}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return resp.data;
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