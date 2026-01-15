import Link from 'next/link';
import { Code2, Rocket, BookOpen, Zap, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-midnight-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative">
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl"></div>

        <div className="text-center max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full text-sm font-medium mb-8 border border-amber-800/30">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-amber-400">AI-Powered Learning Platform</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
              Master Programming
            </span>
            <br />
            <span className="text-gray-100">with Interactive Lessons</span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Write code in your browser, get instant feedback, and learn from AI-powered tutoring.
            Start your coding journey in the most <span className="text-amber-500 font-semibold">futuristic way</span>!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/courses"
              className="btn-primary group"
            >
              <span>Start Learning</span>
              <Rocket className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/lessons/python/01-introduction"
              className="btn-secondary"
            >
              Try Demo Lesson
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="glass-strong rounded-2xl p-8 hover:shadow-glow-amber-lg transition-all duration-500 group">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Code2 className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-amber-400 mb-4 text-center">
              Monaco Editor
            </h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Professional code editor with syntax highlighting and IntelliSense
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-strong rounded-2xl p-8 hover:shadow-glow-amber-lg transition-all duration-500 group">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Rocket className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-amber-400 mb-4 text-center">
              Instant Execution
            </h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Run code in secure Docker containers with real-time output
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-strong rounded-2xl p-8 hover:shadow-glow-amber-lg transition-all duration-500 group">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-amber-400 mb-4 text-center">
              Structured Path
            </h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Follow curated lessons with progress tracking and achievements
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="animated-border max-w-5xl mx-auto">
          <div className="glass-strong rounded-2xl p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Ready to Code?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of developers mastering programming skills with our AI-powered platform
            </p>
            <Link
              href="/courses"
              className="btn-primary text-lg px-10 py-4 inline-block"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
