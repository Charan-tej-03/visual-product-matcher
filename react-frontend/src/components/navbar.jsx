import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-semibold text-lg">Visual Product Matcher</Link>
        <div className="flex gap-4 text-sm text-gray-700">
          <Link to="/">Search</Link>
          <Link to="/add-product">Add Product</Link>
        </div>
      </div>
    </nav>
  );
}
