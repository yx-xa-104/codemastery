export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-purple-600">CodeMastery</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Learn programming interactively with AI-powered assistance
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/lessons/python/introduction"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Start Learning
            </a>
            <a
              href="/about"
              className="px-8 py-3 bg-white hover:bg-gray-50 text-purple-600 font-semibold rounded-lg border-2 border-purple-600 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Interactive Code Editor
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Write and execute code directly in your browser with our powerful Monaco editor
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              AI Tutor
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get instant help and explanations from our context-aware AI assistant
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Comprehensive Lessons
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Learn Python, JavaScript, Java, C++ and more with structured lessons
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
