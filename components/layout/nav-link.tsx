'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLoading } from '@/components/providers/loading-provider';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function NavLink({ href, className, children, onClick }: NavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setLoading } = useLoading();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop native/Next link behavior
    
    // Don't load if already on page
    if (pathname === href) return;
    
    // Trigger loading
    setLoading(true);
    
    // Force wait 2 seconds
    await new Promise(r => setTimeout(r, 2000));
    
    // Navigate
    router.push(href);
    
    if (onClick) onClick();
  };

  return (
    <a 
      href={href} 
      onClick={handleClick} 
      className={cn("cursor-pointer", className)}
    >
      {children}
    </a>
  );
}
