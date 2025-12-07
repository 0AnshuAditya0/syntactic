import { Github, Twitter, Linkedin, Youtube, Heart } from 'lucide-react';

export function Footer() {
  const platformLinks = [
    { label: 'Blog', href: '#blog' },
    { label: 'Playground', href: '#playground' },
    { label: 'Explore', href: '#explore' },
    { label: 'Documentation', href: '#docs' },
  ];

  const companyLinks = [
    { label: 'About', href: '#about' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '#contact' },
    { label: 'Brand', href: '#brand' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
    { label: 'Licenses', href: '#licenses' },
  ];

  const socialLinks = [
    { icon: Github, href: '#github', label: 'GitHub' },
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
    { icon: Youtube, href: '#youtube', label: 'YouTube' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#0F0F12] to-[#1A1B26] text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#6366FF]" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 neon-grid opacity-10 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden bg-[#6366FF]">
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-white text-base sm:text-lg">S</span>
                </div>
              </div>
              <span className="text-xl sm:text-2xl text-white">Syntactic</span>
            </div>
            <p className="text-[#E5E7EB] text-sm sm:text-base mb-6 sm:mb-8 max-w-sm leading-relaxed">
              An interactive developer blog platform with live code playground capabilities. 
              Empowering developers to share knowledge and build together.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden group bg-[#1E1F2E] border border-[#6366FF]/30 hover:border-[#00F5FF]/60 hover:bg-[#6366FF] transition-all"
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Icon size={18} className="text-white sm:w-5 sm:h-5" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-base sm:text-lg mb-4 sm:mb-6 text-white">Platform</h3>
            <ul className="space-y-3 sm:space-y-4">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#E5E7EB] text-sm sm:text-base hover:text-[#00F5FF] transition-colors relative group inline-block"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00F5FF] group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base sm:text-lg mb-4 sm:mb-6 text-white">Company</h3>
            <ul className="space-y-3 sm:space-y-4">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#E5E7EB] text-sm sm:text-base hover:text-[#00F5FF] transition-colors relative group inline-block"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00F5FF] group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-base sm:text-lg mb-4 sm:mb-6 text-white">Legal</h3>
            <ul className="space-y-3 sm:space-y-4">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#E5E7EB] text-sm sm:text-base hover:text-[#00F5FF] transition-colors relative group inline-block"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00F5FF] group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-6 sm:mb-8">
          <div className="h-px bg-[#6366FF]/30" />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          {/* Copyright */}
          <p className="text-[#E5E7EB]/70 text-xs sm:text-sm flex items-center gap-2">
            © {new Date().getFullYear()} Syntactic. Made with 
            <Heart size={12} className="text-[#FF5F56] fill-[#FF5F56] inline-block sm:w-[14px] sm:h-[14px]" /> 
            for developers.
          </p>

          {/* Additional Links */}
          <div className="flex gap-6 sm:gap-8 text-xs sm:text-sm">
            <a href="#status" className="text-[#E5E7EB]/70 hover:text-[#00F5FF] transition-colors">
              Status
            </a>
            <a href="#api" className="text-[#E5E7EB]/70 hover:text-[#00F5FF] transition-colors">
              API
            </a>
            <a href="#changelog" className="text-[#E5E7EB]/70 hover:text-[#00F5FF] transition-colors">
              Changelog
            </a>
          </div>
        </div>
      </div>

      {/* Radial Background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] bg-[#6366FF]/10 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
}
