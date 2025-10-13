export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="font-semibold text-lg">Visual Product Matcher</div>
        <div className="text-sm text-gray-600">Flask + PostgreSQL + React</div>
      </div>
    </nav>
  );
}
