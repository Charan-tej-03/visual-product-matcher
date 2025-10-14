import { useNavigate, useLocation } from "react-router-dom";
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-sm w-full sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600 mr-2"><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/><path d="M10 10a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5z"/><path d="M10 13a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5z"/></svg>
            <span className="font-bold text-xl text-gray-800">Visual Product Matcher</span>
          </div>
          <div className="flex items-center space-x-4">
             <button onClick={()=>navigate('/')}
             className={`px-3 py-2 rounded-md text-sm font-medium transition 
              ${
                isActive("/")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              >
                Search
             </button>
             <button onClick={()=>navigate('/add-product')}
             className={`px-3 py-2 rounded-md text-sm font-medium transition 
              ${
                isActive("/add-product")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              >
                Add Product
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}