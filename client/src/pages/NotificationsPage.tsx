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

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'friend_request',
      title: 'Sarah wants to connect',
      description: 'You have 3 mutual interests',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5ff?auto=format&fit=crop&w=150&h=150',
      isRead: false
    },
    {
      id: '2',
      type: 'event_invite',
      title: 'Alex invited you to Board Game Night',
      description: 'Tomorrow at 7:00 PM • Mission District',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150',
      isRead: false
    },
    {
      id: '3',
      type: 'sponsored_ad',
      title: '☕️ Abhay wants to study at Roastery Coffee',
      description: 'Great spot for focused work sessions. Join him?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      avatar: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&h=150',
      isRead: true
    },
    {
      id: '4',
      type: 'accepted',
      title: 'You\'re in! Coffee Chat accepted',
      description: 'Emma accepted your request to join',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150',
      isRead: true
    },
    {
      id: '5',
      type: 'sponsored_ad',
      title: '🍰 Riya just went to Mocha Mojo!',
      description: 'Wanna join her next time? Perfect spot for coffee lovers',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      avatar: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&h=150',
      isRead: true
    },
    {
      id: '6',
      type: 'story_tag',
      title: 'Mike tagged you in their activity story',
      description: 'Check out the memories from yesterday\'s hike!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150',
      isRead: true
    },
    {
      id: '7',
      type: 'sponsored_ad',
      title: '🎨 Creativity Explored - New Art Workshop',
      description: 'Join local artists for a fun painting session this weekend',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
      avatar: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?auto=format&fit=crop&w=150&h=150',
      isRead: true
    },
    {
      id: '8',
      type: 'sponsored_ad',
      title: '✨ Discover Golden Gate Park',
      description: 'Perfect for your next outdoor activity. Book a picnic spot today!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true
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

  const handleNotificationAction = (notificationId: string, action: string) => {
    // Show feedback for the action
    console.log(`${action} action for notification ${notificationId}`);
    
    // Here you would typically make an API call to handle the action
    // For now, we'll just show a visual feedback
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      switch (action) {
        case 'accept_friend':
          alert(`Accepted friend request from ${notification.title.split(' ')[0]}`);
          break;
        case 'decline_friend':
          alert(`Declined friend request from ${notification.title.split(' ')[0]}`);
          break;
        case 'join_event':
          alert(`Joined event: ${notification.title}`);
          break;
        case 'maybe_later':
          alert(`Marked as maybe for: ${notification.title}`);
          break;
        case 'check_out':
          alert(`Checking out: ${notification.title}`);
          break;
        case 'add_wishlist':
          alert(`Added to wishlist: ${notification.title}`);
          break;
      }
    }
  };

  const getActionButton = (notification: Notification) => {
    switch (notification.type) {
      case 'friend_request':
        return (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => handleNotificationAction(notification.id, 'accept_friend')}
              className="px-3 py-1 bg-unalon-accent-400 text-white text-xs rounded-full hover:bg-unalon-accent-500 transition-colors"
            >
              Accept
            </button>
            <button 
              onClick={() => handleNotificationAction(notification.id, 'decline_friend')}
              className="px-3 py-1 bg-unalon-200 text-unalon-700 text-xs rounded-full hover:bg-unalon-300 transition-colors"
            >
              Decline
            </button>
          </div>
        );
      case 'event_invite':
        return (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => handleNotificationAction(notification.id, 'join_event')}
              className="px-3 py-1 bg-unalon-accent-400 text-white text-xs rounded-full hover:bg-unalon-accent-500 transition-colors"
            >
              Join Event
            </button>
            <button 
              onClick={() => handleNotificationAction(notification.id, 'maybe_later')}
              className="px-3 py-1 bg-unalon-200 text-unalon-700 text-xs rounded-full hover:bg-unalon-300 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        );
      case 'sponsored_ad':
        return (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => handleNotificationAction(notification.id, 'check_out')}
              className="px-3 py-1 bg-white border border-unalon-300 text-unalon-700 text-xs rounded-full hover:bg-unalon-100 transition-colors"
            >
              Check it out
            </button>
            <button 
              onClick={() => handleNotificationAction(notification.id, 'add_wishlist')}
              className="px-3 py-1 bg-white border border-unalon-300 text-unalon-700 text-xs rounded-full hover:bg-unalon-100 transition-colors"
            >
              Add to wishlist
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 overflow-y-auto bg-unalon-100">
      <h1 className="text-xl font-bold text-unalon-900 mb-6">Notifications</h1>
      
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`bg-white rounded-xl p-4 border border-unalon-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${
              !notification.isRead ? 'border-unalon-accent-200 bg-unalon-accent-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-unalon-100 overflow-hidden flex items-center justify-center">
                {notification.avatar ? (
                  <img 
                    src={notification.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
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
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-unalon-900 mb-1">
                      {notification.title}
                      {!notification.isRead && (
                        <span className="inline-block w-2 h-2 bg-unalon-accent-400 rounded-full ml-2"></span>
                      )}
                      {notification.type === 'sponsored_ad' && (
                        <span className="inline-block text-xs text-unalon-500 italic ml-2">✨ Sponsored</span>
                      )}
                    </p>
                    <p className="text-xs text-unalon-600 mb-2">
                      {notification.description}
                    </p>
                  </div>
                  <span className="text-xs text-unalon-500">
                    {formatTime(notification.timestamp)}
                  </span>
                </div>
                
                {getActionButton(notification)}
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons text-4xl text-unalon-400 mb-4">notifications_none</span>
            <p className="text-unalon-700 text-lg">No notifications yet</p>
            <p className="text-unalon-500 text-sm mt-1">When you get notifications, they'll appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}