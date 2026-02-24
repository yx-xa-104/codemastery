export function Hero() {
  const categories = [
    'Tất cả',
    'Lập trình Web',
    'Data Science',
    'AI & Machine Learning',
    'Mobile App',
    'DevOps',
  ];

  return (
    <div className="bg-gradient-to-b from-background-dark to-section-dark pb-10 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Khám Phá Tri Thức{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent-gold">
              Lập Trình
            </span>
          </h1>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
            Hơn 50+ khóa học miễn phí từ cơ bản đến nâng cao dành cho cộng đồng.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="relative group">
            <div className="flex items-center bg-code-dark rounded-full overflow-hidden p-1 pr-1 border border-indigo-500/30 focus-within:border-accent-gold/70 focus-within:ring-2 focus-within:ring-accent-gold/20 transition-all shadow-lg shadow-black/50">
              <span className="material-symbols-outlined text-gray-400 ml-4">search</span>
              <input
                className="flex-grow px-4 py-3 bg-transparent text-gray-200 focus:outline-none border-none focus:ring-0 placeholder-gray-500"
                placeholder="Tìm kiếm khóa học (Python, React, AI...)"
                type="text"
              />
              <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition-colors font-medium">
                Tìm kiếm
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, index) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                  index === 0
                    ? 'bg-accent-gold text-white shadow-glow border-transparent'
                    : 'bg-[#1e293b] text-gray-300 hover:text-white hover:bg-indigo-900/50 border-indigo-500/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
