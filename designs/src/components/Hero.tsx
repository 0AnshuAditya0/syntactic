import { ArrowRight, LogIn, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] flex items-center justify-center neon-grid animated-grid overflow-hidden vignette">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1B26]/50 via-transparent to-[#0F0F12]" />
      
      {/* Floating Geometric Shapes */}
      <div className="absolute top-20 right-[10%] w-24 h-24 sm:w-40 sm:h-40 border-2 border-[#6366FF] rounded-lg rotate-12 opacity-30 animate-float" />
      <div className="absolute bottom-32 left-[15%] w-20 h-20 sm:w-32 sm:h-32 border-2 border-dashed border-[#00F5FF]/40 opacity-40 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 left-[20%] w-16 h-16 sm:w-24 sm:h-24 border-2 border-[#A855F7] opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Radial Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-[#6366FF]/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass px-4 sm:px-6 py-2 sm:py-2.5 rounded-full mb-6 sm:mb-8 border border-[#6366FF]/30">
          <Sparkles size={14} className="text-[#00F5FF] sm:w-4 sm:h-4" />
          <span className="text-[#E5E7EB] text-xs sm:text-sm">Live Code Playground Platform</span>
        </div>

        {/* Main Headline */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-3 sm:mb-4 text-white">
            Syntactic
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-3 sm:mb-4">
          Where code meets creativity
        </p>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#E5E7EB] max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
          An interactive developer blog platform with live code playground capabilities. 
          Write, share, and execute code in real-time across multiple languages.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
          <button className="w-full sm:w-auto group btn-solid px-6 sm:px-10 py-3 sm:py-5 text-white rounded-xl transition-all flex items-center justify-center gap-2 sm:gap-3">
            <span className="text-base sm:text-lg">Get Started</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform sm:w-[22px] sm:h-[22px]" />
          </button>
          
          <button className="w-full sm:w-auto btn-outline px-6 sm:px-10 py-3 sm:py-5 text-white rounded-xl transition-all flex items-center justify-center gap-2 sm:gap-3">
            <LogIn size={18} className="sm:w-[22px] sm:h-[22px]" />
            <span className="text-base sm:text-lg">Sync Login</span>
          </button>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto px-4">
          {[
            { value: '50K+', label: 'Developers' },
            { value: '100K+', label: 'Snippets' },
            { value: '25+', label: 'Languages' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat, index) => (
            <div key={index} className="glass-light p-4 sm:p-6 rounded-xl border border-[#6366FF]/20 hover:border-[#6366FF]/50 transition-all group hover:shadow-elevated">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-1 text-[#00F5FF]">
                {stat.value}
              </div>
              <div className="text-[#E5E7EB] text-xs sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Noise Texture */}
      <div className="noise-texture absolute inset-0 pointer-events-none" />
    </section>
  );
}
