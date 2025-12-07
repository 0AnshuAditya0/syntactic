import { Search, User, PenSquare, Menu } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-[#6366FF]/20 shadow-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6 md:gap-12">
            <a href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-[#6366FF]">
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-white text-sm sm:text-base">S</span>
                </div>
              </div>
              <span className="text-white text-base sm:text-lg hidden sm:block">
                Syntactic
              </span>
            </a>

            {/* Menu Items */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <a 
                href="#blog" 
                className="text-[#E5E7EB] text-sm hover:text-white transition-all relative group"
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00F5FF] group-hover:w-full transition-all duration-300" />
              </a>
              <a 
                href="#playground" 
                className="text-[#E5E7EB] text-sm hover:text-white transition-all relative group"
              >
                Playground
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00F5FF] group-hover:w-full transition-all duration-300" />
              </a>
              <a 
                href="#explore" 
                className="text-[#E5E7EB] text-sm hover:text-white transition-all relative group"
              >
                Explore
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00F5FF] group-hover:w-full transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-3 glass-light rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 w-40 lg:w-64 border border-[#6366FF]/10 focus-within:border-[#6366FF]/50 transition-all">
              <Search size={16} className="text-[#E5E7EB]/50 sm:w-[18px] sm:h-[18px]" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-white text-sm placeholder:text-[#E5E7EB]/50 w-full"
              />
            </div>

            {/* Write Button */}
            <button className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 glass-light hover:glass rounded-lg transition-all hover:shadow-elevated group border border-[#6366FF]/20 hover:border-[#6366FF]/50">
              <PenSquare size={16} className="text-[#00F5FF] sm:w-[18px] sm:h-[18px]" />
              <span className="text-white text-sm">Write</span>
            </button>

            {/* User Profile */}
            <button className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden hover:shadow-elevated transition-all group bg-[#6366FF]">
              <div className="relative w-full h-full flex items-center justify-center">
                <User size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
              </div>
              <div className="absolute inset-0 border-2 border-[#00F5FF]/0 group-hover:border-[#00F5FF]/60 rounded-full transition-all" />
            </button>

            {/* Mobile Menu */}
            <button className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center glass-light rounded-lg border border-[#6366FF]/20 hover:border-[#6366FF]/50 transition-all">
              <Menu size={18} className="text-white sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
