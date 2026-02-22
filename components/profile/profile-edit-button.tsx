'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import Link from 'next/link';

interface ProfileEditButtonProps {
  profileId: string;
  username: string;
}

export function ProfileEditButton({ profileId, username }: ProfileEditButtonProps) {
  const { user, tempUser } = useAuth();
  
  const isOwnProfile = user?.id === profileId || tempUser?.username === username;

  if (!isOwnProfile) return null;

  return (
    <Link href="/settings">
      <Button variant="outline" className="rounded-full px-6 border-[#F29F67] text-[#F29F67] hover:bg-[#F29F67] hover:text-white transition-all duration-200">
        <Edit className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>
    </Link>
  );
}
