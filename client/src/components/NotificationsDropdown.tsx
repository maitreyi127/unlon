import { useState } from 'react';

interface Notification {
  id: string;
  type: 'friend_request' | 'event_invite' | 'accepted' | 'story_tag' | 'sponsored_ad';
  title: string;
  description: string;
  timestamp: Date;
  avatar?: string;
  isRead: boolean;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'accepted',
      title: 'Request accepted!',
      description: 'Tomorrow at 7:00 PM • Mission District',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150',
      isRead: false
    },
    {
      id: '2',
      type: 'sponsored_ad',
      title: '☕ Abhay wants to study at Roastery Coffee',
      description: 'Great spot for focused work sessions. Join him?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      avatar: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&h=150',
      isRead: true
    },
    {
      id: '3',
      type: 'friend_request',
      title: 'Sarah wants to connect',
      description: 'You have 3 mutual interests',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5ff?auto=format&fit=crop&w=150&h=150',
      isRead: false
    },
    {
      id: '4',
      type: 'event_invite',
      title: 'Alex invited you to Board Game Night',
      description: 'Tomorrow at 7:00 PM • Mission District',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150',
      isRead: false
    },
    {
      id: '5',
      type: 'sponsored_ad',
      title: '🎨 Art Workshop at Creative Studio',
      description: 'Learn painting techniques with local artists',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      avatar: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=150&h=150',
      isRead: true
    },
    {
      id: '6',
      type: 'story_tag',
      title: 'Mike tagged you in a story',
      description: 'Check out the new coffee spot we found!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7),
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150',
      isRead: false
    },
    {
      id: '7',
      type: 'sponsored_ad',
      title: '🏃‍♂️ Running Group at Golden Gate Park',
      description: 'Join our morning jogging sessions',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=150&h=150',
      isRead: true
    },
    {
      id: '8',
      type: 'event_invite',
      title: 'Emma invited you to Book Club',
      description: 'This Saturday at 2:00 PM • Library Cafe',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9),
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150',
      isRead: false
    },
    {
      id: '9',
      type: 'friend_request',
      title: 'David wants to connect',
      description: 'You have 5 mutual interests',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150',
      isRead: false
    },
    {
      id: '10',
      type: 'sponsored_ad',
      title: '🍕 Pizza Night at Luigi\'s',
      description: 'Authentic Italian pizza and great company',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11),
      avatar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=150&h=150',
      isRead: true
    },
    {
      id: '11',
      type: 'accepted',
      title: 'Event joined successfully!',
      description: 'You\'re now part of the Music Jam Session',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=150&h=150',
      isRead: false
    },
    {
      id: '12',
      type: 'story_tag',
      title: 'Lisa tagged you in a story',
      description: 'Amazing sunset at Baker Beach!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 13),
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150',
      isRead: false
    }
  ]);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request': return 'person_add';
      case 'event_invite': return 'event';
      case 'accepted': return 'check_circle';
      case 'story_tag': return 'photo_camera';
      case 'sponsored_ad': return 'local_offer';
      default: return 'notifications';
    }
  };

  const handleAction = (notificationId: string, action: 'accept' | 'decline') => {
    if (action === 'accept') {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, type: 'accepted' as const, title: 'Request accepted!' }
            : n
        )
      );
    } else {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Dropdown */}
      <div className="absolute top-12 right-4 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-unalon-200 z-50 overflow-hidden transform transition-all duration-300 ease-out scale-100 opacity-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-unalon-200 bg-gradient-to-r from-unalon-50 to-white">
          <h3 className="font-semibold text-unalon-900">Notifications</h3>
          <button 
            onClick={onClose}
            className="text-unalon-500 hover:text-unalon-700 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <span className="material-icons text-lg">close</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-unalon-200 scrollbar-track-transparent">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <span className="material-icons text-4xl text-unalon-300 mb-2">notifications_none</span>
              <p className="text-unalon-600 text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-unalon-100">
              {notifications.map((notification, index) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-unalon-50 transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                    !notification.isRead ? 'bg-unalon-accent-50/50' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-unalon-100 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                      {notification.avatar ? (
                        <img 
                          src={notification.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${notification.avatar ? 'hidden' : ''}`}>
                        <span className="material-icons text-unalon-600 text-sm">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-unalon-900 mb-1">
                            {notification.title}
                            {!notification.isRead && (
                              <span className="inline-block w-2 h-2 bg-unalon-accent-400 rounded-full ml-2 animate-pulse"></span>
                            )}
                            {notification.type === 'sponsored_ad' && (
                              <span className="inline-block text-xs text-unalon-500 italic ml-2">✨ Sponsored</span>
                            )}
                          </p>
                          <p className="text-xs text-unalon-600 mb-2">
                            {notification.description}
                          </p>
                        </div>
                        <span className="text-xs text-unalon-500 ml-2">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      {notification.type === 'friend_request' && (
                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={() => handleAction(notification.id, 'accept')}
                            className="px-3 py-1 bg-unalon-accent-400 text-white text-xs rounded-full hover:bg-unalon-accent-500 transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleAction(notification.id, 'decline')}
                            className="px-3 py-1 bg-unalon-200 text-unalon-700 text-xs rounded-full hover:bg-unalon-300 transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      
                      {notification.type === 'event_invite' && (
                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={() => handleAction(notification.id, 'accept')}
                            className="px-3 py-1 bg-unalon-accent-400 text-white text-xs rounded-full hover:bg-unalon-accent-500 transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            Join Event
                          </button>
                          <button 
                            onClick={() => handleAction(notification.id, 'decline')}
                            className="px-3 py-1 bg-unalon-200 text-unalon-700 text-xs rounded-full hover:bg-unalon-300 transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            Maybe Later
                          </button>
                        </div>
                      )}

                      {notification.type === 'sponsored_ad' && (
                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={() => handleAction(notification.id, 'accept')}
                            className="px-3 py-1 bg-unalon-accent-400 text-white text-xs rounded-full hover:bg-unalon-accent-500 transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            Check it out
                          </button>
                          <button 
                            onClick={() => handleAction(notification.id, 'decline')}
                            className="px-3 py-1 bg-unalon-200 text-unalon-700 text-xs rounded-full hover:bg-unalon-300 transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            Add to wishlist
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 