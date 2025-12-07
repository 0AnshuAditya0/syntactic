'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [user]);

  async function fetchNotifications() {
    if (!user) return;

    const { data } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:actor_id (
          username,
          avatar_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    setNotifications(data || []);
    setUnreadCount(data?.filter(n => !n.is_read).length || 0);
  }

  function subscribeToNotifications() {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  async function markAsRead() {
    if (!user || unreadCount === 0) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    setUnreadCount(0);
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  }

  function getNotificationText(type: string) {
    switch (type) {
      case 'like': return 'liked your post';
      case 'comment': return 'commented on your post';
      case 'reply': return 'replied to your comment';
      default: return 'interacted with you';
    }
  }

  function getNotificationLink(notification: any) {
    // Ideally we'd fetch the post slug, but for now we'll link to blog home or specific post if we had the slug
    // Since we only store resource_id (post_id), we might need to fetch the slug or just link to /blog
    // For now, let's assume we can navigate to the post by ID if we implement that route, or just /blog
    return `/blog`; 
  }

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) markAsRead();
    }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h4 className="font-semibold">Notifications</h4>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                  !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                    {notification.actor?.avatar_url ? (
                      <img src={notification.actor.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                        {notification.actor?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">{notification.actor?.username}</span>{' '}
                      {getNotificationText(notification.type)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
