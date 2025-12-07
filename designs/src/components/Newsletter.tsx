import { Mail, Send, Shield } from 'lucide-react';

export function Newsletter() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-[#0F0F12]">
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#6366FF]" />
      
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden shadow-deep bg-[#6366FF]">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 neon-grid opacity-20" />
          
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-[#00F5FF] rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 sm:w-80 sm:h-80 bg-[#A855F7] rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }} />
          
          {/* Decorative Elements */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-20 h-20 sm:w-32 sm:h-32 border-2 border-dashed border-white/20" />
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-16 h-16 sm:w-24 sm:h-24 border-2 border-white/20 rounded-full" />
          
          <div className="relative z-10 text-center">
            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-deep bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Mail size={28} className="text-white sm:w-9 sm:h-9" />
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-3 sm:mb-4">
              Stay in the loop
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Get the latest articles, tutorials, and coding tips delivered directly to your inbox. 
              Join thousands of developers already subscribed.
            </p>

            {/* Newsletter Form */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto mb-4 sm:mb-6">
              <div className="flex-1 relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="relative w-full px-4 sm:px-6 py-3 sm:py-5 rounded-lg sm:rounded-xl bg-white/95 backdrop-blur-sm text-[#1A1B26] text-sm sm:text-base placeholder:text-[#1A1B26]/50 outline-none focus:ring-2 focus:ring-white/50 shadow-lg transition-all"
                />
              </div>
              <button className="px-6 sm:px-8 py-3 sm:py-5 bg-[#1A1B26] text-white text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-[#0F0F12] transition-all flex items-center justify-center gap-2 sm:gap-3 group shadow-deep hover:shadow-elevated hover:-translate-y-0.5">
                <span>Subscribe</span>
                <Send size={16} className="group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Privacy Note */}
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/80">
              <Shield size={14} className="sm:w-4 sm:h-4" />
              <span>No spam. Unsubscribe anytime. Privacy protected.</span>
            </div>
          </div>

          {/* Noise Texture */}
          <div className="noise-texture absolute inset-0 pointer-events-none" />
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 neon-grid opacity-10 pointer-events-none" />
    </section>
  );
}
