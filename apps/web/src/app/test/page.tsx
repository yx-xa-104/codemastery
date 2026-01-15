export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">
          Tailwind CSS Works! 
        </h1>
        <p className="text-gray-700">
          If you see colors and styling, Tailwind is working correctly.
        </p>
        <div className="mt-6 flex gap-4">
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
            Purple Button
          </button>
          <button className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg">
            Pink Button
          </button>
        </div>
      </div>
    </div>
  );
}
