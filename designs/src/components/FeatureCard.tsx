import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative glass rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:shadow-deep transition-all duration-500 overflow-hidden border border-[#6366FF]/30 hover:border-[#00F5FF]/60 hover:-translate-y-2">
      {/* Animated Grid Pattern Overlay */}
      <div className="absolute inset-0 neon-grid opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      
      {/* Corner Accent - Top Right */}
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full border-r-2 border-t-2 border-[#00F5FF]/40 rotate-0 group-hover:rotate-12 transition-transform duration-500" />
        <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-[#00F5FF]/10" />
      </div>

      {/* Corner Accent - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16">
        <div className="absolute bottom-0 left-0 w-full h-full border-l-2 border-b-2 border-[#6366FF]/30 group-hover:border-[#6366FF]/60 transition-colors" />
      </div>
      
      <div className="relative z-10">
        {/* Icon Container */}
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-lg sm:rounded-xl overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-[#6366FF]/20 border border-[#6366FF]/40">
          <div className="relative w-full h-full flex items-center justify-center">
            <Icon size={24} className="text-[#00F5FF] sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-white transition-all">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#E5E7EB] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#6366FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Hover Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[#6366FF]/5" />
    </div>
  );
}
