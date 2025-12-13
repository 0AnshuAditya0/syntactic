'use client';

import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter/newsletter-form';

import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="relative bg-[#F5F5F7] border-t-2 border-[#F29F67]/20 overflow-hidden">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-[#F29F67]">
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-white text-sm sm:text-base font-bold">S</span>
                </div>
              </div>
              <span className="text-[#1E1E2C] text-base sm:text-lg font-bold">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-gray-700">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href={siteConfig.links.github} 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-700 hover:text-[#F29F67] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link 
                href={siteConfig.links.twitter} 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-700 hover:text-[#F29F67] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              {/* Added accessibility labels and external link security attributes */}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-[#1E1E2C]">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link href="/blog" className="hover:text-[#F29F67] transition-colors">Blog</Link></li>
              <li><Link href="/playground" className="hover:text-[#F29F67] transition-colors">Playground</Link></li>
              <li><Link href="/explore" className="hover:text-[#F29F67] transition-colors">Explore</Link></li>
              <li><Link href="/search" className="hover:text-[#F29F67] transition-colors">Search</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-[#1E1E2C]">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link href="#" className="hover:text-[#F29F67] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#F29F67] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#F29F67] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterForm />
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t-2 border-[#F29F67]/20 flex flex-col items-center gap-2 text-sm text-gray-700">
          <p>© {new Date().getFullYear()} Syntactic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
