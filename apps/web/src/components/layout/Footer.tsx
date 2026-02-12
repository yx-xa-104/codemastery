import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#010816] border-t border-indigo-900/30 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <span className="text-2xl font-bold tracking-tighter text-white">
              Code<span className="text-primary">Mastery</span>
            </span>
            <p className="text-gray-400 text-sm mt-2">
              © 2024 CodeMastery Inc. Nền tảng học lập trình hàng đầu Việt Nam.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">
              Điều khoản
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">
              Bảo mật
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
