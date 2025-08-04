import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Activity, User } from '@shared/schema';

interface ActivityWithHost extends Activity {
  host: User | null;
}

interface MyPlansData {
  upcoming: ActivityWithHost[];
  past: ActivityWithHost[];
}

export default function MyPlansPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const { data, isLoading } = useQuery<MyPlansData>({
    queryKey: ['/api/my-plans'],
  });

  const formatDateTime = (datetime: string | Date) => {
    const date = new Date(datetime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let dayLabel = '';
    if (activityDate.getTime() === today.getTime()) {
      dayLabel = 'Today';
    } else if (activityDate.getTime() === tomorrow.getTime()) {
      dayLabel = 'Tomorrow';
    } else if (activityDate > now) {
      dayLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    } else {
      dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    const timeLabel = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    return `${timeLabel} · ${dayLabel}`;
  };

  const groupActivitiesByTime = (activities: ActivityWithHost[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() + 7);

    const groups: { [key: string]: ActivityWithHost[] } = {
      'Today': [],
      'Tomorrow': [],
      'This Week': [],
      'Past': []
    };

    activities.forEach(activity => {
      const activityDate = new Date(activity.datetime);
      const activityDay = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate());

      if (activityDay.getTime() === today.getTime()) {
        groups['Today'].push(activity);
      } else if (activityDay.getTime() === tomorrow.getTime()) {
        groups['Tomorrow'].push(activity);
      } else if (activityDate > now && activityDate <= thisWeek) {
        groups['This Week'].push(activity);
      } else if (activityDate <= now) {
        groups['Past'].push(activity);
      }
    });

    return groups;
  };

  if (isLoading) {
    return (
      <div className="p-4 overflow-y-auto bg-unalon-100">
        <h1 className="text-xl font-bold text-unalon-900 mb-6">My Plans</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-unalon-50 rounded-2xl p-3 border border-unalon-300 animate-pulse">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-unalon-200 rounded-lg mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-unalon-200 rounded mb-2"></div>
                  <div className="h-3 bg-unalon-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sample upcoming activities
  const sampleUpcomingActivities: ActivityWithHost[] = [
    {
      id: 'upcoming1',
      title: 'Hiking Adventure: Mount Tamalpais',
      description: 'Join us for a scenic hike with breathtaking views of the Bay Area.',
      datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      location: 'Mount Tamalpais State Park',
      maxParticipants: 10,
      currentParticipants: 6,
      vibes: ['Outdoors', 'Adventure', 'Nature'],
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&h=400',
      createdAt: new Date(),
      duration: '240',
      hostId: 'host4',
      participantIds: ['10', '11', '12'],
      host: {
        id: 'host4',
        name: 'Michael',
        username: 'mike_hiker',
        email: 'michael@example.com',
        age: 29,
        location: 'Marin County',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        unalonScore: 94,
        interests: ['hiking', 'outdoors', 'photography'],
        favoriteQuote: 'The mountains are calling and I must go.',
        createdAt: new Date()
      },
      userRequested: true
    },
    {
      id: 'upcoming2',
      title: 'Pottery Workshop for Beginners',
      description: 'Learn the basics of pottery in this hands-on workshop. All materials provided.',
      datetime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      location: 'Creative Arts Studio, Downtown',
      maxParticipants: 8,
      currentParticipants: 5,
      vibes: ['Creative', 'Learning', 'Relaxed'],
      image: 'https://images.unsplash.com/photo-1565122256212-41788ba4ca9e?auto=format&fit=crop&w=400&h=400',
      createdAt: new Date(),
      duration: '180',
      hostId: 'host5',
      participantIds: ['13', '14', '15'],
      host: {
        id: 'host5',
        name: 'Olivia',
        username: 'olivia_creates',
        email: 'olivia@example.com',
        age: 31,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        unalonScore: 89,
        interests: ['pottery', 'art', 'crafts'],
        favoriteQuote: 'Creativity takes courage.',
        createdAt: new Date()
      },
      userRequested: true
    },
    {
      id: 'upcoming3',
      title: 'Sunset Beach Volleyball',
      description: 'Casual beach volleyball game followed by a small bonfire. All skill levels welcome!',
      datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      location: 'Ocean Beach',
      maxParticipants: 12,
      currentParticipants: 8,
      vibes: ['Active', 'Beach', 'Social'],
      image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=400&h=400',
      createdAt: new Date(),
      duration: '180',
      hostId: 'host6',
      participantIds: ['16', '17', '18'],
      host: {
        id: 'host6',
        name: 'Carlos',
        username: 'carlos_beach',
        email: 'carlos@example.com',
        age: 27,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        unalonScore: 91,
        interests: ['volleyball', 'beach', 'outdoor sports'],
        favoriteQuote: 'Life\'s a beach, enjoy the waves.',
        createdAt: new Date()
      },
      userRequested: false
    }
  ];
  
  // Use sample data if no API data is available
  const upcomingGroups = data?.upcoming ? groupActivitiesByTime(data.upcoming) : groupActivitiesByTime(sampleUpcomingActivities);
  
  // Sample past activities
  const samplePastActivities: ActivityWithHost[] = [
    {
      id: 'past1',
      title: 'Coffee & Code Meetup',
      description: 'Great session learning about React hooks and state management.',
      datetime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      location: 'Tech Hub Downtown',
      maxParticipants: 15,
      currentParticipants: 12,
      vibes: ['Learning', 'Tech', 'Coffee'],
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&h=400',
      createdAt: new Date(),
      duration: '120',
      hostId: 'host1',
      participantIds: ['1', '2', '3'],
      host: {
        id: 'host1',
        name: 'Sarah',
        username: 'sarah_dev',
        email: 'sarah@example.com',
        age: 26,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        unalonScore: 92,
        interests: ['JavaScript', 'web development', 'coffee'],
        favoriteQuote: 'Code is like humor. When you have to explain it, it\'s bad.',
        createdAt: new Date()
      },
      userRequested: false
    },
    {
      id: 'past2',
      title: 'Book Club: Sci-Fi Night',
      description: 'Amazing discussion about "The Three-Body Problem".',
      datetime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      location: 'Central Library',
      maxParticipants: 12,
      currentParticipants: 8,
      vibes: ['Intellectual', 'Discussion', 'Books'],
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&h=400',
      createdAt: new Date(),
      duration: '90',
      hostId: 'host2',
      participantIds: ['4', '5', '6'],
      host: {
        id: 'host2',
        name: 'David',
        username: 'david_reader',
        email: 'david@example.com',
        age: 28,
        location: 'Berkeley',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        unalonScore: 88,
        interests: ['science fiction', 'reading', 'discussion'],
        favoriteQuote: 'A reader lives a thousand lives before he dies.',
        createdAt: new Date()
      },
      userRequested: false
    },
    {
      id: 'past3',
      title: 'Acoustic Guitar Jam',
      description: 'Fun evening playing covers and original songs.',
      datetime: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
      location: 'Music Studio Downtown',
      maxParticipants: 10,
      currentParticipants: 6,
      vibes: ['Creative', 'Music', 'Casual'],
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&h=400',
      createdAt: new Date(),
      duration: '180',
      hostId: 'host3',
      participantIds: ['7', '8', '9'],
      host: {
        id: 'host3',
        name: 'Emma',
        username: 'emma_music',
        email: 'emma@example.com',
        age: 25,
        location: 'Oakland',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        unalonScore: 85,
        interests: ['music', 'guitar', 'acoustic'],
        favoriteQuote: 'Music is the universal language of mankind.',
        createdAt: new Date()
      },
      userRequested: false
    }
  ];
  
  // Force use sample data for past activities
  const pastActivities = samplePastActivities;

  return (
    <div className="p-4 overflow-y-auto bg-unalon-100">

      {/* Tabs */}
      <div className="flex border-b border-unalon-300 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-3 text-center font-semibold transition-colors duration-200 border-b-2 ${
            activeTab === 'upcoming' 
              ? 'text-unalon-900 border-unalon-900' 
              : 'text-unalon-700 border-transparent hover:border-unalon-300'
          }`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-3 text-center font-semibold transition-colors duration-200 border-b-2 ${
            activeTab === 'past' 
              ? 'text-unalon-900 border-unalon-900' 
              : 'text-unalon-700 border-transparent hover:border-unalon-300'
          }`}
        >
          Past
        </button>
      </div>

      {/* Content */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          {Object.entries(upcomingGroups).map(([groupName, activities]) => {
            if (activities.length === 0) return null;
            
            return (
              <div key={groupName} className="space-y-4">
                <h2 className="text-lg font-bold text-unalon-900">{groupName}</h2>
                {activities.map((activity) => (
                  <div key={activity.id} className="bg-unalon-50 rounded-2xl shadow-sm p-3 border border-unalon-300 flex items-center hover:shadow-md transition-shadow duration-200">
                    <img 
                      alt={`${activity.title} activity`}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 mr-3" 
                      src={activity.image || "https://images.unsplash.com/photo-1511920170104-daa98f68f26b?auto=format&fit=crop&w=400&h=400"}
                    />
                    <div>
                      <h3 className="text-base font-semibold text-unalon-900">
                        {activity.hostId === activity.id ? 'My Hosted: ' : ''}{activity.title}
                      </h3>
                      <p className="text-xs text-unalon-700 mt-1">
                        {formatDateTime(activity.datetime)} · {activity.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {Object.keys(upcomingGroups).length === 0 && (
            <div className="text-center py-12">
              <p className="text-unalon-700 text-lg">No upcoming plans</p>
              <p className="text-unalon-500 text-sm mt-1">Join some activities to see them here!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastActivities.map((activity) => (
            <div key={activity.id} className="bg-unalon-50 rounded-2xl shadow-sm p-3 border border-unalon-300 flex items-center opacity-60">
              <img 
                alt={`${activity.title} activity`}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0 mr-3" 
                src={activity.image || "https://images.unsplash.com/photo-1511920170104-daa98f68f26b?auto=format&fit=crop&w=400&h=400"}
              />
              <div>
                <h3 className="text-base font-semibold text-unalon-900">{activity.title}</h3>
                <p className="text-xs text-unalon-700 mt-1">
                  {formatDateTime(activity.datetime)} · {activity.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
