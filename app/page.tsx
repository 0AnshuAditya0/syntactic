'use client';

import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero Section - Text Left, Button Right */}
      <section className="relative min-h-[90vh] flex items-center px-6 py-20 bg-white">
        
        {/* Main Content - Horizontal Layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Text Content */}
            <div className="text-left">
              {/* Small Tagline Above */}
              <p className="text-sm sm:text-base text-gray-500 mb-8 tracking-widest uppercase font-medium">
                Make Your Code
              </p>

              {/* Large Bold Typography */}
              <div className="mb-8">
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold leading-none mb-4">
                  <span className="text-[#1E1E2C]">PLAYFUL</span>
                </h1>
                
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold leading-none mb-4">
                  <span className="text-[#1E1E2C]">AND</span>
                </h1>

                <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold leading-none">
                  <span className="text-[#1E1E2C]">CREATIVE</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl mb-0 leading-relaxed">
                Welcome to a world where imagination knows no bounds. 
                Our code playground is where creativity and playfulness unite.
              </p>
            </div>

            {/* Right Side - CTA Button */}
            <div className="flex items-center justify-center lg:justify-end">
              <Link href="/playground">
                <button className="bg-[#F29F67] hover:bg-[#E08D55] text-[#1E1E2C] px-12 py-6 rounded-full text-lg font-semibold transition-all flex items-center gap-3 shadow-lg hover:shadow-xl">
                  <Code2 size={24} />
                  <span>Start Creating</span>
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section - Minimal & Clean */}
      <section className="relative py-32 px-6 bg-[#F5F5F7]">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-24">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#1E1E2C] mb-8">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple tools for creative developers
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                emoji: '📝',
                title: 'Write',
                description: 'Create interactive blog posts with live code examples',
                color: '#3B8FF3'
              },
              {
                emoji: '⚡',
                title: 'Execute',
                description: 'Run code in real-time across multiple languages',
                color: '#34B1AA'
              },
              {
                emoji: '🚀',
                title: 'Share',
                description: 'Publish and share your work with the community',
                color: '#E0B50F'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-10 rounded-3xl bg-white hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-[#F29F67]"
              >
                <div className="text-7xl mb-6">{feature.emoji}</div>
                <h3 className="text-3xl font-bold text-[#1E1E2C] mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div 
                  className="mt-6 h-1 w-16 mx-auto rounded-full" 
                  style={{ backgroundColor: feature.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Coding Environment Section */}
      <section className="relative py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F29F67]/10 rounded-full mb-8 border border-[#F29F67]/20">
                <Code2 size={16} className="text-[#F29F67]" />
                <span className="text-[#1E1E2C] text-sm font-medium">Live Coding Environment</span>
              </div>
              
              <h2 className="text-5xl sm:text-6xl font-bold text-[#1E1E2C] mb-6">
                Write. Run. Share.
              </h2>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Experience the power of live code execution right in your browser. 
                Support for JavaScript, Python, TypeScript, and more. No setup required.
              </p>

              <ul className="space-y-5 mb-10">
                {['Instant code execution', 'Syntax highlighting', 'Multi-language support', 'Share with a link'].map((item, index) => (
                  <li key={index} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 flex-shrink-0 bg-[#F29F67] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/playground">
                <button className="bg-[#1E1E2C] hover:bg-[#2A2A3C] text-white px-8 py-4 rounded-full text-lg font-medium transition-all flex items-center gap-3 shadow-lg hover:shadow-xl">
                  <span>Try Playground</span>
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>

            {/* Right Side - Code Example */}
            <div className="relative">
              <div className="relative shadow-2xl rounded-2xl overflow-hidden border-2 border-gray-200">
                {/* Terminal Header */}
                <div className="bg-[#1E1E2C] px-6 py-4 flex items-center gap-3 border-b border-gray-700">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-2">
                    <Code2 size={14} className="text-[#F29F67]" />
                    <span className="text-white text-sm font-medium">playground.js</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#F29F67] px-3 py-1.5 rounded-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white text-xs font-medium">Run</span>
                  </div>
                </div>

                {/* Code Content */}
                <div className="bg-[#F5F5F7] p-8 font-mono text-sm">
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="text-gray-400 w-8 select-none">1</span>
                      <span className="text-purple-600">function</span>
                      <span className="text-blue-600 ml-2">greet</span>
                      <span className="text-gray-700">(</span>
                      <span className="text-orange-600">name</span>
                      <span className="text-gray-700">)</span>
                      <span className="text-gray-700 ml-2">{'{'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 w-8 select-none">2</span>
                      <span className="text-pink-600 ml-4">return</span>
                      <span className="text-green-600 ml-2">`Hello, ${'{'}name{'}'}!`</span>
                      <span className="text-gray-700">;</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 w-8 select-none">3</span>
                      <span className="text-gray-700 ml-4">{'}'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 w-8 select-none">4</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 w-8 select-none">5</span>
                      <span className="text-gray-500 ml-4">{`// Execute`}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 w-8 select-none">6</span>
                      <span className="text-orange-600 ml-4">console</span>
                      <span className="text-gray-700">.</span>
                      <span className="text-blue-600">log</span>
                      <span className="text-gray-700">(</span>
                      <span className="text-blue-600">greet</span>
                      <span className="text-gray-700">(</span>
                      <span className="text-green-600">&quot;Developer&quot;</span>
                      <span className="text-gray-700">));</span>
                    </div>
                    
                    {/* Output Section */}
                    <div className="pt-6 mt-6 border-t border-gray-300">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-[#34B1AA] rounded-full" />
                        <span className="text-gray-600 text-xs font-medium">Output:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#34B1AA]">→</span>
                        <span className="text-[#34B1AA] font-medium">Hello, Developer!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Solid Color */}
      <section className="relative py-40 px-6 bg-[#1E1E2C]">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8">
              Ready to Create?
            </h2>
            <p className="text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers building amazing things
            </p>
            
            <Link href="/auth/signup">
              <button className="bg-[#F29F67] text-white px-16 py-7 rounded-full text-xl font-bold hover:bg-[#E08D55] transition-all shadow-2xl hover:shadow-3xl">
                Get Started Free
              </button>
            </Link>

            <div className="mt-12">
              <p className="font-cursive font-bold text-lg text-[#F29F67] opacity-80 hover:opacity-100 transition-opacity">dev &lt;Anshu&gt;</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
