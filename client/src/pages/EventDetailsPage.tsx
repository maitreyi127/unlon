import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Activity, User, Message } from '@shared/schema';
import { addRequestedActivity, isActivityRequested as checkActivityRequested } from '@/lib/requestedActivities';

interface ActivityWithHost extends Activity {
  host: User | null;
  participants?: User[];
}

export default function EventDetailsPage() {
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hasApplied, setHasApplied] = useState(false);
  const [messageText, setMessageText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get current user for discussion
  const { data: currentUser } = useQuery<{ user: User }>({ queryKey: ['/api/me'] });
  
  // Get event ID and data from URL
  const urlParts = window.location.pathname.split('/');
  const eventId = urlParts[urlParts.length - 1];
  const urlParams = new URLSearchParams(window.location.search);
  const eventDataParam = urlParams.get('data');

  // Try to get event data from URL first
  let eventFromUrl: ActivityWithHost | null = null;
  if (eventDataParam) {
    try {
      const parsedEvent = JSON.parse(decodeURIComponent(eventDataParam));
      // Convert datetime string back to Date object
      if (parsedEvent.datetime) {
        parsedEvent.datetime = new Date(parsedEvent.datetime);
      }
      if (parsedEvent.createdAt) {
        parsedEvent.createdAt = new Date(parsedEvent.createdAt);
      }
      if (parsedEvent.host?.createdAt) {
        parsedEvent.host.createdAt = new Date(parsedEvent.host.createdAt);
      }
      eventFromUrl = parsedEvent;
    } catch (error) {
      console.error('Failed to parse event data from URL:', error);
    }
  }

  // Generate sample event data based on event ID (fallback)
  const generateSampleEvent = (id: string): ActivityWithHost => {
    const eventTemplates = [
      {
        title: 'Board Game Night',
        description: 'Join us for a fun evening of strategy games and friendly competition! We\'ll have a variety of board games including Settlers of Catan, Ticket to Ride, and more. Perfect for game enthusiasts and newcomers alike.',
        location: 'Game Cafe Downtown',
        vibes: ['Fun', 'Social', 'Games'],
        hostName: 'Alex',
        hostInterests: ['board games', 'strategy', 'social'],
        hostQuote: 'Life is a game, play it well.',
        image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&h=400',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        title: 'Coffee & Code: JavaScript Workshop',
        description: 'A relaxed morning session where we\'ll dive deep into modern JavaScript concepts. Perfect for developers looking to sharpen their skills while enjoying great coffee. We\'ll cover ES6+, async/await, and practical examples.',
        location: '456 Coffee Ave, Downtown',
        vibes: ['Relaxed', 'Learning', 'Coffee'],
        hostName: 'Sarah',
        hostInterests: ['JavaScript', 'web development', 'coffee'],
        hostQuote: 'Code is like humor. When you have to explain it, it\'s bad.',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&h=400',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        title: 'Book Club: Science Fiction Night',
        description: 'Join fellow sci-fi enthusiasts for a lively discussion about the latest in science fiction literature. We\'ll be discussing "The Three-Body Problem" and exploring themes of first contact, physics, and human nature.',
        location: '789 Library Blvd, University District',
        vibes: ['Intellectual', 'Discussion', 'Books'],
        hostName: 'David',
        hostInterests: ['science fiction', 'reading', 'discussion'],
        hostQuote: 'A reader lives a thousand lives before he dies.',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&h=400',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        title: 'Acoustic Guitar Jam Session',
        description: 'Bring your guitar and join us for an evening of acoustic music! All skill levels welcome. We\'ll play covers, share original songs, and maybe even write something new together. Snacks and drinks provided.',
        location: '321 Music St, Arts District',
        vibes: ['Creative', 'Music', 'Casual'],
        hostName: 'Emma',
        hostInterests: ['music', 'guitar', 'acoustic'],
        hostQuote: 'Music is the universal language of mankind.',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&h=400',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        title: 'Poetry Reading Night',
        description: 'An intimate evening of poetry sharing and discussion. Bring your favorite poems or your own work to share. We\'ll explore different styles, themes, and techniques in a supportive environment.',
        location: '654 Poetry Lane, Cultural Quarter',
        vibes: ['Intimate', 'Creative', 'Poetry'],
        hostName: 'Alex',
        hostInterests: ['poetry', 'writing', 'literature'],
        hostQuote: 'Poetry is when an emotion has found its thought and the thought has found words.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=400',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    ];

    // Ensure we have a valid numeric ID, fallback to 1 if not
    const numericId = parseInt(id) || 1;
    const templateIndex = Math.abs(numericId) % eventTemplates.length;
    const template = eventTemplates[templateIndex];
    // Set event time to tomorrow at 6:35pm for Board Game Night
    let eventTime;
    if (template.title === 'Board Game Night') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 35, 0, 0); // 6:35 PM
      eventTime = tomorrow;
    } else {
      eventTime = new Date(Date.now() + (numericId * 24 * 60 * 60 * 1000) + (numericId * 60 * 60 * 1000));
    }

    return {
      id,
      title: template.title,
      description: template.description,
      datetime: eventTime,
      location: template.location,
      maxParticipants: 20 + (numericId % 10),
      currentParticipants: 8 + (numericId % 12),
      vibes: template.vibes,
      image: template.image,
      createdAt: new Date(),
      duration: '120',
      hostId: id,
      participantIds: Array.from({ length: 5 + (numericId % 5) }, (_, i) => `user${i + 1}`),
      host: {
        id,
        name: template.hostName,
        username: `${template.hostName.toLowerCase()}_${id}`,
        email: `${template.hostName.toLowerCase()}@example.com`,
        age: 25 + (numericId % 15),
        location: template.location.split(',')[0],
        avatar: template.avatar,
        unalonScore: 85 + (numericId % 15),
        interests: template.hostInterests,
        favoriteQuote: template.hostQuote,
        createdAt: new Date()
      },
      userRequested: false
    };
  };

  // Try to fetch from API first, fallback to sample data
  const { data: apiEvent, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/activities/${eventId}`);
      return await response.json() as ActivityWithHost;
    },
    enabled: !!eventId && !eventFromUrl, // Skip API call if we have URL data
    retry: false
  });

  // Priority: URL data > API data > generated sample data
  const event = eventFromUrl || apiEvent || (eventId ? generateSampleEvent(eventId) : null);

  // Check if user has already requested to join this activity
  useEffect(() => {
    if (event) {
      setHasApplied(event.userRequested || checkActivityRequested(event.id));
    }
  }, [event?.userRequested, event?.id]);

  // Request to join mutation
  const requestToJoinMutation = useMutation({
    mutationFn: async (activityId: string) => {
      const response = await apiRequest('POST', `/api/activities/${activityId}/request`);
      return await response.json();
    },
    onSuccess: (data, activityId) => {
      // Mark as applied in localStorage and local state
      addRequestedActivity(activityId);
      setHasApplied(true);
      // Invalidate activities cache to refresh request status
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast({ title: "Request sent!", description: "The host will review your request." });
    },
    onError: (error: any, activityId) => {
      const errorMessage = error.message || "Could not send request";
      
      // If already participating, still mark as "applied" in UI
      if (errorMessage.toLowerCase().includes("already participating") || 
          errorMessage.toLowerCase().includes("already")) {
        addRequestedActivity(activityId);
        setHasApplied(true);
        toast({ title: "Already joined!", description: "You're already part of this activity." });
      } else {
        toast({ 
          title: "Request failed", 
          description: errorMessage,
          variant: "destructive" 
        });
      }
    },
  });

  // Query to fetch discussion messages
  const { data: discussionMessages = [], refetch: refetchMessages } = useQuery<Message[]>({
    queryKey: ['discussion', eventId, event?.hostId],
    queryFn: async () => {
      if (!event?.hostId) return [];
      const response = await apiRequest('GET', `/api/messages/${event.hostId}`);
      return await response.json() as Message[];
    },
    enabled: !!event?.hostId
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/messages', {
        receiverId: event?.hostId,
        content: message
      });
      return await response.json();
    },
    onSuccess: () => {
      setMessageText('');
      // Refetch messages to show the new message
      refetchMessages();
      toast({ title: "Message sent!", description: "Your comment has been added to the discussion." });
    },
    onError: () => {
      toast({ 
        title: "Failed to send message", 
        description: "Please try again.",
        variant: "destructive" 
      });
    },
  });

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessageMutation.mutate(messageText.trim());
    }
  };

  const handleRequestToJoin = () => {
    if (event && !hasApplied && !requestToJoinMutation.isPending) {
      requestToJoinMutation.mutate(event.id);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!event) return;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = new Date(event.datetime).getTime();
      const distance = eventTime - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event?.datetime]);

  const formatDateTime = (datetime: Date | string) => {
    const date = datetime instanceof Date ? datetime : new Date(datetime);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }) + ', ' + date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-unalon-600">Loading event details...</div>
      </div>
    );
  }

  // Show loading state only if we're fetching from API
  if (isLoading && !event) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-unalon-600">Loading event details...</div>
      </div>
    );
  }

  // Ensure we have an event to display
  if (!event) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-unalon-600">Event not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-unalon-200">
        <button 
          onClick={() => setLocation('/')}
          className="text-unalon-700 hover:text-unalon-900 transition-colors"
        >
          <span className="material-icons">arrow_back</span>
        </button>
        <h1 className="font-semibold text-unalon-900">Event Details</h1>
        <div className="w-6"></div>
      </header>

      {/* Banner Image */}
      <div className="w-full h-48 bg-unalon-100 overflow-hidden">
        <img 
          src={event.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&h=400'}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className={`w-full h-full flex items-center justify-center hidden`}>
          <div className="text-center">
            <span className="material-icons text-4xl text-unalon-400 mb-2">event</span>
            <p className="text-unalon-500 text-sm">{event.title}</p>
          </div>
        </div>
      </div>

      {/* Event Info */}
      <div className="p-4 space-y-6 pb-24">
        {/* Title and Time */}
        <div>
          <h2 className="text-xl font-bold text-unalon-900 mb-2">{event.title}</h2>
          <p className="text-unalon-600">{formatDateTime(event.datetime)} · {event.location}</p>
        </div>

        {/* Host Section */}
        <div className="bg-unalon-50 rounded-xl p-4">
          <h3 className="font-semibold text-unalon-900 mb-3">Host</h3>
          <div className="flex items-center space-x-3">
            {event.host?.avatar ? (
              <img
                src={event.host.avatar}
                alt={event.host.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-12 h-12 rounded-full bg-unalon-200 flex items-center justify-center ${event.host?.avatar ? 'hidden' : ''}`}>
              <span className="text-unalon-600 font-medium text-lg">
                {event.host?.name?.charAt(0) || '?'}
              </span>
            </div>
            <div>
              <p className="font-medium text-unalon-900">{event.host?.name}</p>
              <p className="text-sm text-unalon-600">Verified · 5 past events</p>
            </div>
          </div>
          <p className="text-sm text-unalon-600 mt-3">
            {event.host?.name} is passionate about {event.host?.interests?.slice(0, 2).join(' and ')}. {event.host?.favoriteQuote}
          </p>
        </div>

        {/* Attendees Section */}
        <div>
          <h3 className="font-semibold text-unalon-900 mb-3">Attendees</h3>
          <div className="flex items-center space-x-2 mb-2">
            {/* Show first 5 attendees if available */}
            {event.participants && event.participants.length > 0 ? (
              event.participants.slice(0, 5).map((participant) => (
                <div key={participant.id} className="w-8 h-8 rounded-full bg-unalon-200 overflow-hidden">
                  <img
                    src={participant.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'}
                    alt={participant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full bg-unalon-200 flex items-center justify-center text-xs text-unalon-600 font-medium hidden">
                    {participant.name?.charAt(0) || '?'}
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-unalon-200 flex items-center justify-center">
                  <span className="text-xs text-unalon-600 font-medium">
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
              ))
            )}
          </div>
          <p className="text-sm text-unalon-600">
            {event.participants?.length || event.currentParticipants || 0} going
          </p>
        </div>

        {/* Vibe Check */}
        <div>
          <h3 className="font-semibold text-unalon-900 mb-3">Vibe Check</h3>
          <div className="flex space-x-2 mb-3">
            {event.vibes?.map((vibe, index) => (
              <span key={index} className="bg-unalon-100 text-unalon-700 text-sm px-3 py-1 rounded-full">
                {vibe}
              </span>
            ))}
          </div>

        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold text-unalon-900 mb-3">Description</h3>
          <p className="text-unalon-600 text-sm leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Countdown */}
        <div>
          <h3 className="font-semibold text-unalon-900 mb-3">Countdown</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-unalon-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-unalon-900">{timeLeft.days}</div>
              <div className="text-xs text-unalon-600">Days</div>
            </div>
            <div className="bg-unalon-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-unalon-900">{timeLeft.hours}</div>
              <div className="text-xs text-unalon-600">Hours</div>
            </div>
            <div className="bg-unalon-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-unalon-900">{timeLeft.minutes}</div>
              <div className="text-xs text-unalon-600">Minutes</div>
            </div>
            <div className="bg-unalon-100 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-unalon-900">{timeLeft.seconds}</div>
              <div className="text-xs text-unalon-600">Seconds</div>
            </div>
          </div>
        </div>

        {/* Discussion */}
        <div>
          <h3 className="font-semibold text-unalon-900 mb-3">Discussion</h3>
          <div className="space-y-3">
            {discussionMessages.length > 0 ? (
              discussionMessages.map((message) => {
                const isCurrentUser = message.senderId === currentUser?.user?.id;
                const displayUser = isCurrentUser ? currentUser?.user : event?.host;
                
                return (
                  <div key={message.id} className="flex items-start space-x-3">
                    <img
                      src={displayUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'}
                      alt={displayUser?.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face';
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-unalon-900">{displayUser?.name || 'Unknown User'}</p>
                      <p className="text-sm text-unalon-600">{message.content}</p>
                      <p className="text-xs text-unalon-500">
                        {message.timestamp ? new Date(message.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        }) : 'Just now'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-unalon-500 text-sm">No messages yet. Be the first to start the discussion!</p>
              </div>
            )}
          </div>
          
          {/* Comment Input */}
          <div className="flex items-center space-x-3 pt-4 border-t border-unalon-100">
            <img
              src={currentUser?.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
              alt="You"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
              }}
            />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Add a comment..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                disabled={sendMessageMutation.isPending}
                className="w-full px-4 py-2 bg-unalon-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-unalon-accent-400 disabled:opacity-50"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!messageText.trim() || sendMessageMutation.isPending}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-unalon-accent-500 hover:text-unalon-accent-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-icons text-sm">
                  {sendMessageMutation.isPending ? 'hourglass_empty' : 'send'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-unalon-200 p-4 space-y-3">
          <button 
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              hasApplied || requestToJoinMutation.isPending
                ? 'bg-unalon-accent-400 text-white cursor-not-allowed' 
                : 'bg-unalon-accent-500 text-white hover:bg-unalon-accent-600'
            }`}
            onClick={handleRequestToJoin}
            disabled={hasApplied || requestToJoinMutation.isPending}
          >
            {requestToJoinMutation.isPending ? 'Sending...' : hasApplied ? 'Requested' : 'Request to Join'}
          </button>
          <div className="flex space-x-3">
            <button 
              className="flex-1 bg-unalon-100 text-unalon-700 py-3 rounded-xl font-medium hover:bg-unalon-200 transition-colors"
              onClick={() => alert('Added to calendar!')}
            >
              Add to Calendar
            </button>
            <button 
              className="flex-1 bg-unalon-100 text-unalon-700 py-3 rounded-xl font-medium hover:bg-unalon-200 transition-colors"
              onClick={() => alert('Reminder set!')}
            >
              Set Reminder
            </button>
          </div>
        </div>
    </div>
  );
} 