import { FileText, Monitor, RefreshCw } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export function Features() {
  const features = [
    {
      icon: FileText,
      title: 'Interactive Blog',
      description: 'Write rich, interactive blog posts using MDX. Embed live code examples, interactive demos, and rich media directly in your content with real-time rendering.',
    },
    {
      icon: Monitor,
      title: 'Code Playground',
      description: 'Execute code in multiple languages directly in the browser. Test, experiment, and share your code snippets with instant feedback and syntax highlighting.',
    },
    {
      icon: RefreshCw,
      title: 'Cross-Device Sync',
      description: 'Seamlessly sync your work across all devices. Start coding on desktop, continue on mobile, and never lose your progress with automatic cloud backup.',
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-[#0F0F12] to-[#1A1B26]">
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#6366FF]" />
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center glass px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 border border-[#6366FF]/30">
            <span className="text-[#00F5FF] text-xs sm:text-sm">
              Platform Features
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 text-white px-4">
            Everything you need to code and create
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#E5E7EB] max-w-3xl mx-auto leading-relaxed px-4">
            A complete platform designed for developers who want to share knowledge and build interactive coding experiences.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* Decorative Grid Elements */}
        <div className="absolute top-32 left-10 w-16 h-16 sm:w-24 sm:h-24 border border-[#6366FF]/20 rounded-lg rotate-45 opacity-50" />
        <div className="absolute bottom-32 right-10 w-20 h-20 sm:w-32 sm:h-32 border-2 border-dashed border-[#00F5FF]/20 opacity-30" />
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 neon-grid opacity-20 pointer-events-none" />
      
      {/* Radial Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-[#6366FF]/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
