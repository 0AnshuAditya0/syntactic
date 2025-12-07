import { Terminal, Play, CheckCircle2 } from 'lucide-react';

export function CodePreview() {
  const features = [
    'Instant code execution',
    'Syntax highlighting',
    'Multi-language support',
    'Share with a link'
  ];

  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-[#0F0F12]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center glass px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 border border-[#00F5FF]/30">
              <Play size={14} className="text-[#00F5FF] mr-2 sm:w-4 sm:h-4" />
              <span className="text-[#E5E7EB] text-xs sm:text-sm">Live Coding Environment</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 text-white">
              Write. Run. Share.
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#E5E7EB] mb-8 sm:mb-10 leading-relaxed">
              Experience the power of live code execution right in your browser. 
              Support for JavaScript, Python, TypeScript, and more. No setup required.
            </p>

            <ul className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
              {features.map((item, index) => (
                <li key={index} className="flex items-center gap-3 sm:gap-4 group">
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 bg-[#6366FF]/20 border border-[#6366FF]/40 rounded-lg flex items-center justify-center">
                    <CheckCircle2 size={18} className="text-[#00F5FF] sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[#E5E7EB] text-sm sm:text-base md:text-lg group-hover:text-white transition-colors">{item}</span>
                </li>
              ))}
            </ul>

            <button className="btn-solid px-6 sm:px-8 py-3 sm:py-4 text-white rounded-xl transition-all flex items-center gap-2 sm:gap-3 group">
              <span className="text-sm sm:text-base md:text-lg">Try Playground</span>
              <Terminal size={18} className="group-hover:rotate-12 transition-transform sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Right Side - Code Example */}
          <div className="relative order-1 lg:order-2">
            {/* Grid decoration */}
            <div className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-24 h-24 sm:w-40 sm:h-40 neon-grid border border-[#6366FF]/20 opacity-30" />
            <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-20 h-20 sm:w-32 sm:h-32 border-2 border-dashed border-[#00F5FF]/20 rounded-full" />
            
            <div className="relative shadow-deep rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#6366FF]/40">
              {/* Terminal Header */}
              <div className="glass px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 border-b border-[#6366FF]/30">
                <div className="flex gap-1.5 sm:gap-2.5">
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex-1 flex items-center justify-center gap-2">
                  <Terminal size={12} className="text-[#00F5FF] sm:w-[14px] sm:h-[14px]" />
                  <span className="text-[#E5E7EB] text-xs sm:text-sm">playground.js</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 glass-light px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#6366FF]/20">
                  <Play size={10} className="text-[#00FF88] sm:w-3 sm:h-3" />
                  <span className="text-xs text-[#E5E7EB]">Run</span>
                </div>
              </div>

              {/* Code Content */}
              <div className="bg-[#1A1B26] p-4 sm:p-6 md:p-8 font-mono text-xs sm:text-sm md:text-base overflow-x-auto">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex">
                    <span className="text-[#6366FF]/60 w-8 sm:w-12 select-none text-xs sm:text-sm">1</span>
                    <span className="text-[#C792EA] text-xs sm:text-sm">function</span>
                    <span className="text-[#82AAFF] ml-2 text-xs sm:text-sm">greet</span>
                    <span className="text-[#89DDFF] text-xs sm:text-sm">(</span>
                    <span className="text-[#FFCB6B] text-xs sm:text-sm">name</span>
                    <span className="text-[#89DDFF] text-xs sm:text-sm">)</span>
                    <span className="text-white ml-2 text-xs sm:text-sm">{'{'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#6366FF]/60 w-8 sm:w-12 select-none text-xs sm:text-sm">2</span>
                    <span className="text-[#F07178] ml-4 text-xs sm:text-sm">return</span>
                    <span className="text-[#89DDFF] ml-2 text-xs sm:text-sm">`</span>
                    <span className="text-[#C3E88D] text-xs sm:text-sm">Hello, </span>
                    <span className="text-[#89DDFF] text-xs sm:text-sm">${'{'}name{'}'}</span>
                    <span className="text-[#C3E88D] text-xs sm:text-sm">!</span>
                    <span className="text-[#89DDFF] text-xs sm:text-sm">`</span>
                    <span className="text-white text-xs sm:text-sm">;</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#6366FF]/60 w-8 sm:w-12 select-none text-xs sm:text-sm">3</span>
                    <span className="text-white ml-4 text-xs sm:text-sm">{'}'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#6366FF]/60 w-8 sm:w-12 select-none text-xs sm:text-sm">4</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#6366FF]/60 w-8 sm:w-12 select-none text-xs sm:text-sm">5</span>
                    <span className="text-[#676E95] ml-4 text-xs sm:text-sm">// Execute the function</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#6366FF]/60 w-8 sm:w-12 select-none text-xs sm:text-sm">6</span>
                    <span className="text-[#FFCB6B] ml-4 text-xs sm:text-sm">console</span>
                    <span className="text-[#89DDFF] text-xs sm:text-sm">.</span>
                    <span className="text-[#82AAFF] text-xs sm:text-sm">log</span>
                    <span className="text-[#89DDFF] text-xs sm:text-sm">(</span>
                    <span className="text-[#82AAFF] text-xs sm:text-sm">greet</span>
                    <span className="text-[#89DDFF] text-xs sm:text-sm">(</span>
                    <span className="text-[#C3E88D] text-xs sm:text-sm">"Developer"</span>
                    <span className="text-[#89DDFF] text-xs sm:text-sm">));</span>
                  </div>
                  
                  {/* Output Section */}
                  <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-[#6366FF]/20">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Terminal size={12} className="text-[#00FF88] sm:w-[14px] sm:h-[14px]" />
                      <span className="text-[#E5E7EB] text-xs">Output:</span>
                    </div>
                    <div className="flex">
                      <span className="text-[#00FF88] mr-2 text-xs sm:text-sm">→</span>
                      <span className="text-[#00FF88] text-xs sm:text-sm">Hello, Developer!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Background */}
              <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-20 bg-gradient-to-t from-[#6366FF]/10 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 neon-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#00F5FF]/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
