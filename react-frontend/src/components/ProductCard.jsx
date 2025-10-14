export default function ProductCard({ product }) {
    const apiBase = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";
    const imageUrl = `${apiBase}${product.image_url}`; // backend returns image_url like "/images/xxx"
  
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300">
        <div className="h-48 bg-gray-50 flex items-center justify-center mb-3 overflow-hidden rounded">
          <img src={imageUrl} alt={product.name} className="object-contain max-h-full" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold">₹{product.price ?? "0.00"}</span>
          <span className="text-sm text-gray-600">{(product.score * 100).toFixed(1)}% match</span>
        </div>
      </div>
    );
  }
  