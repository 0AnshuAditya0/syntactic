export function Stats() {
  const stats = [
    { value: '50K+', label: 'Active Developers', color: '#6366FF' },
    { value: '100K+', label: 'Code Snippets', color: '#00F5FF' },
    { value: '25+', label: 'Languages', color: '#A855F7' },
    { value: '99.9%', label: 'Uptime SLA', color: '#00FF88' },
  ];

  return (
    <section className="relative py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-[#1A1B26] to-[#0F0F12]">
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#00F5FF]" />
      
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-2 sm:mb-3 px-4">
            Trusted by developers worldwide
          </h2>
          <p className="text-sm sm:text-base text-[#E5E7EB] px-4">Join thousands of developers building with Syntactic</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative text-center p-6 sm:p-8 md:p-10 glass rounded-xl sm:rounded-2xl hover:shadow-deep transition-all duration-500 group border border-[#6366FF]/30 hover:border-[#00F5FF]/50 overflow-hidden"
            >
              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16">
                <div className="absolute top-0 left-0 w-full h-full border-l-2 border-t-2 border-[#6366FF]/40 group-hover:border-[#00F5FF]/60 transition-colors duration-500" />
                <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 bg-[#6366FF]/10" />
              </div>
              <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16">
                <div className="absolute bottom-0 right-0 w-full h-full border-r-2 border-b-2 border-[#6366FF]/40 group-hover:border-[#00F5FF]/60 transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 bg-[#6366FF]/10" />
              </div>
              
              {/* Grid Pattern on Hover */}
              <div className="absolute inset-0 neon-grid opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              
              <div className="relative z-10">
                {/* Value */}
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-[#E5E7EB] text-xs sm:text-sm group-hover:text-white transition-colors">
                  {stat.label}
                </div>
              </div>

              {/* Bottom Border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: stat.color }} />

              {/* Hover Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" style={{ backgroundColor: stat.color }} />
            </div>
          ))}
        </div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 neon-grid opacity-10 pointer-events-none" />
      
      {/* Radial Backgrounds */}
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#6366FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#00F5FF]/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
