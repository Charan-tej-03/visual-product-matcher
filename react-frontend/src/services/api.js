import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000"; 

export const searchImage = async (file, k = 5, min_score = 0.25) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios.post(`${API_BASE_URL}/search?k=${k}&min_score=${min_score}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};
