import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useSearch } from '@/context/SearchContext';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import type { Activity, User } from '@shared/schema';
import { getRequestedActivities, addRequestedActivity, isActivityRequested as checkActivityRequested } from '@/lib/requestedActivities';

interface ActivityWithHost extends Activity {
  host: User | null;
  participants?: User[];
}

type FilterType = 'hobbies' | 'filter' | 'sort';
type HobbyType = 'hiking' | 'studying' | 'coffee' | 'sports' | 'photography' | 'art' | 'food' | 'travel';
type FilterOption = 'today' | 'tomorrow' | 'week' | 'distance' | 'location';
type SortOption = 'date' | 'popularity' | 'spots';

export default function HomePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { searchQuery } = useSearch();
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [selectedHobby, setSelectedHobby] = useState<HobbyType | null>(null);
  const [filterOption, setFilterOption] = useState<FilterOption | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [distanceFilter, setDistanceFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [showAttendeesDropdown, setShowAttendeesDropdown] = useState<string | null>(null);
  const [requestedActivities, setRequestedActivities] = useState<Set<string>>(new Set());

  // Load requested activities from localStorage on mount
  useEffect(() => {
    setRequestedActivities(getRequestedActivities());
  }, []);

  const { data: apiActivities = [], isLoading } = useQuery<ActivityWithHost[]>({
    queryKey: ['/api/activities'],
  });

  // Use API activities if available, otherwise fallback to sample activities
  const sampleActivities: ActivityWithHost[] = [
    // Reading Category Events
    {
      id: '1',
      title: 'Book Club Discussion',
      description: 'Join us for a lively discussion about "The Midnight Library" by Matt Haig. Perfect for book lovers and deep thinkers.',
      datetime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      location: 'Central Library',
      maxParticipants: 15,
      currentParticipants: 8,
      vibes: ['Intellectual', 'Chill', 'Discussion', 'Reading'],
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '120',
      hostId: '1',
      participantIds: ['1', '2', '3'],
      host: { 
        id: '1', 
        name: 'Emma', 
        username: 'emma_reader',
        email: 'emma@example.com', 
        age: 28,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        unalonScore: 95,
        interests: ['reading', 'books', 'discussion'],
        favoriteQuote: 'Books are a uniquely portable magic.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'r1',
      title: 'Science Fiction Book Exchange',
      description: 'Bring your favorite sci-fi novels to exchange with other readers. Discover new authors and make friends with similar reading interests.',
      datetime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      location: 'Borderlands Books, Mission District',
      maxParticipants: 20,
      currentParticipants: 12,
      vibes: ['Sci-Fi', 'Exchange', 'Community', 'Reading'],
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '150',
      hostId: 'r1h',
      participantIds: ['r1p1', 'r1p2', 'r1p3'],
      host: { 
        id: 'r1h', 
        name: 'Thomas', 
        username: 'thomas_scifi',
        email: 'thomas@example.com', 
        age: 34,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        unalonScore: 91,
        interests: ['science fiction', 'fantasy', 'reading'],
        favoriteQuote: 'The universe is made of stories, not atoms.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'r2',
      title: 'Silent Reading Party',
      description: 'Bring your current read and join us for a peaceful afternoon of silent reading in a beautiful setting with light refreshments.',
      datetime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      location: 'Green Apple Books, Richmond District',
      maxParticipants: 15,
      currentParticipants: 7,
      vibes: ['Quiet', 'Peaceful', 'Focused', 'Reading'],
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '180',
      hostId: 'r2h',
      participantIds: ['r2p1', 'r2p2', 'r2p3'],
      host: { 
        id: 'r2h', 
        name: 'Olivia', 
        username: 'olivia_reads',
        email: 'olivia@example.com', 
        age: 29,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        unalonScore: 94,
        interests: ['reading', 'quiet spaces', 'literature'],
        favoriteQuote: 'Reading is dreaming with open eyes.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'r3',
      title: 'Poetry Reading Night',
      description: 'An evening of poetry readings from local poets and open mic for attendees to share their own work.',
      datetime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      location: 'City Lights Bookstore, North Beach',
      maxParticipants: 25,
      currentParticipants: 15,
      vibes: ['Literary', 'Expressive', 'Cultural', 'Reading'],
      image: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '150',
      hostId: 'r3h',
      participantIds: ['r3p1', 'r3p2', 'r3p3'],
      host: { 
        id: 'r3h', 
        name: 'Amara', 
        username: 'amara_poet',
        email: 'amara@example.com', 
        age: 31,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
        unalonScore: 93,
        interests: ['poetry', 'literature', 'writing'],
        favoriteQuote: 'Poetry is the spontaneous overflow of powerful feelings.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'r4',
      title: 'Literary Walking Tour',
      description: 'Explore San Francisco through the lens of famous authors who lived and wrote here. Visit landmarks and get inspired.',
      datetime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      location: 'Starting at Jack Kerouac Alley, North Beach',
      maxParticipants: 12,
      currentParticipants: 6,
      vibes: ['Educational', 'Walking', 'Historical', 'Reading'],
      image: 'https://images.unsplash.com/photo-1519677584237-752f8853252e?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '180',
      hostId: 'r4h',
      participantIds: ['r4p1', 'r4p2', 'r4p3'],
      host: { 
        id: 'r4h', 
        name: 'Julian', 
        username: 'julian_lit',
        email: 'julian@example.com', 
        age: 36,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
        unalonScore: 89,
        interests: ['literature', 'history', 'walking tours'],
        favoriteQuote: 'A good book is an event in my life.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'r5',
      title: 'Mystery Novel Book Club',
      description: 'Join fellow mystery enthusiasts to discuss classic and contemporary detective fiction. This month we\'re reading "The Thursday Murder Club" by Richard Osman.',
      datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      location: 'Dog Eared Books, Castro',
      maxParticipants: 18,
      currentParticipants: 10,
      vibes: ['Mystery', 'Discussion', 'Analytical', 'Reading'],
      image: 'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '150',
      hostId: 'r5h',
      participantIds: ['r5p1', 'r5p2', 'r5p3'],
      host: { 
        id: 'r5h', 
        name: 'Victor', 
        username: 'victor_mystery',
        email: 'victor@example.com', 
        age: 42,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        unalonScore: 88,
        interests: ['mystery novels', 'crime fiction', 'reading'],
        favoriteQuote: 'The world is full of obvious things which nobody by any chance ever observes.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'r6',
      title: 'Manga & Graphic Novel Exchange',
      description: 'Trade your favorite manga and graphic novels with other enthusiasts. Discover new series and discuss art styles and storytelling techniques.',
      datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      location: 'Comix Experience, Divisadero St',
      maxParticipants: 20,
      currentParticipants: 14,
      vibes: ['Manga', 'Comics', 'Artistic', 'Reading'],
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '180',
      hostId: 'r6h',
      participantIds: ['r6p1', 'r6p2', 'r6p3'],
      host: { 
        id: 'r6h', 
        name: 'Yuki', 
        username: 'yuki_manga',
        email: 'yuki@example.com', 
        age: 25,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        unalonScore: 96,
        interests: ['manga', 'anime', 'illustration'],
        favoriteQuote: 'Manga is the literature of our time.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    
    // Music Category Events
    {
      id: '2',
      title: 'Acoustic Guitar Jam Session',
      description: 'Bring your guitar and join our acoustic music session. All skill levels welcome!',
      datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      location: 'Music Studio Downtown',
      maxParticipants: 10,
      currentParticipants: 5,
      vibes: ['Creative', 'Musical', 'Collaborative', 'Music'],
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '180',
      hostId: '2',
      participantIds: ['2', '4', '5'],
      host: { 
        id: '2', 
        name: 'Marcus', 
        username: 'marcus_music',
        email: 'marcus@example.com', 
        age: 32,
        location: 'Oakland',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        unalonScore: 88,
        interests: ['music', 'guitar', 'jamming'],
        favoriteQuote: 'Music is the universal language.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: '4',
      title: 'Jazz Band Practice',
      description: 'Weekly jazz band practice. Saxophone, trumpet, piano, and drums welcome!',
      datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: 'Community Music Center',
      maxParticipants: 8,
      currentParticipants: 4,
      vibes: ['Jazz', 'Professional', 'Weekly', 'Music'],
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '240',
      hostId: '4',
      participantIds: ['4', '8', '9'],
      host: { 
        id: '4', 
        name: 'David', 
        username: 'david_jazz',
        email: 'david@example.com', 
        age: 35,
        location: 'San Jose',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        unalonScore: 87,
        interests: ['jazz', 'saxophone', 'music'],
        favoriteQuote: 'Jazz is the only music in which the same note is played differently every time.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'm1',
      title: 'Vinyl Listening Party',
      description: 'Bring your favorite vinyl records to share with the group. We\'ll have turntables set up and discuss the albums as we listen.',
      datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      location: 'Amoeba Music, Haight Street',
      maxParticipants: 12,
      currentParticipants: 8,
      vibes: ['Vinyl', 'Retro', 'Appreciation', 'Music'],
      image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '180',
      hostId: 'm1h',
      participantIds: ['m1p1', 'm1p2', 'm1p3'],
      host: { 
        id: 'm1h', 
        name: 'James', 
        username: 'james_vinyl',
        email: 'james@example.com', 
        age: 33,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        unalonScore: 90,
        interests: ['vinyl records', 'music history', 'collecting'],
        favoriteQuote: 'Music is the soundtrack of your life.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'm2',
      title: 'Electronic Music Production Workshop',
      description: 'Learn the basics of electronic music production using Ableton Live. Bring your laptop with the software installed (trial version is fine).',
      datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      location: 'Sound Arts Studio, SOMA',
      maxParticipants: 10,
      currentParticipants: 6,
      vibes: ['Electronic', 'Production', 'Learning', 'Music'],
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '210',
      hostId: 'm2h',
      participantIds: ['m2p1', 'm2p2', 'm2p3'],
      host: { 
        id: 'm2h', 
        name: 'Elena', 
        username: 'elena_beats',
        email: 'elena@example.com', 
        age: 27,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        unalonScore: 93,
        interests: ['electronic music', 'production', 'DJing'],
        favoriteQuote: 'Electronic music is where technology meets creativity.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'm3',
      title: 'Classical Music Appreciation',
      description: 'Join us for an evening of classical music appreciation. We\'ll listen to selected works from Bach, Mozart, and Beethoven while discussing their historical context and musical innovations.',
      datetime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      location: 'San Francisco Conservatory of Music',
      maxParticipants: 15,
      currentParticipants: 8,
      vibes: ['Classical', 'Educational', 'Refined', 'Music'],
      image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '150',
      hostId: 'm3h',
      participantIds: ['m3p1', 'm3p2', 'm3p3'],
      host: { 
        id: 'm3h', 
        name: 'Robert', 
        username: 'robert_classical',
        email: 'robert@example.com', 
        age: 45,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        unalonScore: 94,
        interests: ['classical music', 'music history', 'piano'],
        favoriteQuote: 'Music is the universal language of mankind.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'm4',
      title: 'Jazz Club Night',
      description: 'Experience the vibrant San Francisco jazz scene with fellow enthusiasts. We\'ll visit a local jazz club to enjoy live performances from talented musicians.',
      datetime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      location: 'Black Cat Jazz Club, Tenderloin',
      maxParticipants: 12,
      currentParticipants: 7,
      vibes: ['Jazz', 'Nightlife', 'Social', 'Music'],
      image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '240',
      hostId: 'm4h',
      participantIds: ['m4p1', 'm4p2', 'm4p3'],
      host: { 
        id: 'm4h', 
        name: 'Jasmine', 
        username: 'jasmine_jazz',
        email: 'jasmine@example.com', 
        age: 31,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
        unalonScore: 92,
        interests: ['jazz', 'live music', 'saxophone'],
        favoriteQuote: 'Jazz is not just music, it\'s a way of life.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'm5',
      title: 'Karaoke Night Extravaganza',
      description: 'Show off your vocal talents or just have fun singing your favorite songs at our karaoke night. All singing abilities welcome!',
      datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      location: 'Pandora Karaoke & Bar, SOMA',
      maxParticipants: 20,
      currentParticipants: 12,
      vibes: ['Fun', 'Energetic', 'Social', 'Music'],
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '180',
      hostId: 'm5h',
      participantIds: ['m5p1', 'm5p2', 'm5p3'],
      host: { 
        id: 'm5h', 
        name: 'Carlos', 
        username: 'carlos_karaoke',
        email: 'carlos@example.com', 
        age: 29,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        unalonScore: 90,
        interests: ['karaoke', 'pop music', 'singing'],
        favoriteQuote: 'Life is a song - sing it!',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'm6',
      title: 'Hip-Hop Dance Workshop',
      description: 'Learn the fundamentals of hip-hop dance in this beginner-friendly workshop. We\'ll cover basic moves, rhythm, and put together a short routine by the end.',
      datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      location: 'City Dance Studios, SOMA',
      maxParticipants: 15,
      currentParticipants: 9,
      vibes: ['Hip-Hop', 'Dance', 'Energetic', 'Music'],
      image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '120',
      hostId: 'm6h',
      participantIds: ['m6p1', 'm6p2', 'm6p3'],
      host: { 
        id: 'm6h', 
        name: 'Malik', 
        username: 'malik_moves',
        email: 'malik@example.com', 
        age: 26,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        unalonScore: 95,
        interests: ['dance', 'hip-hop', 'choreography'],
        favoriteQuote: 'Dance is the hidden language of the soul.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'm7',
      title: 'Songwriting Circle',
      description: 'Join fellow songwriters to share works in progress, give and receive feedback, and collaborate on new music. All genres welcome!',
      datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: 'Bazaar Café, Richmond District',
      maxParticipants: 10,
      currentParticipants: 5,
      vibes: ['Creative', 'Collaborative', 'Supportive', 'Music'],
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '180',
      hostId: 'm7h',
      participantIds: ['m7p1', 'm7p2', 'm7p3'],
      host: { 
        id: 'm7h', 
        name: 'Sophia', 
        username: 'sophia_songs',
        email: 'sophia@example.com', 
        age: 32,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        unalonScore: 91,
        interests: ['songwriting', 'guitar', 'folk music'],
        favoriteQuote: 'A song is never finished, only abandoned.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    
    // Reading Category Additional Events
    {
      id: 'r6',
      title: 'Audiobook Listening Club',
      description: 'Experience literature in a different way with our audiobook club. We\'ll listen to excerpts together and discuss narration styles, voice acting, and how the audio format enhances the story.',
      datetime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      location: 'Dolores Park, Mission District',
      maxParticipants: 12,
      currentParticipants: 7,
      vibes: ['Relaxed', 'Outdoor', 'Discussion', 'Reading'],
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '120',
      hostId: 'r6h',
      participantIds: ['r6p1', 'r6p2', 'r6p3'],
      host: { 
        id: 'r6h', 
        name: 'Marcus', 
        username: 'marcus_listens',
        email: 'marcus@example.com', 
        age: 34,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        unalonScore: 89,
        interests: ['audiobooks', 'podcasts', 'storytelling'],
        favoriteQuote: 'To listen well is as powerful a means of influence as to talk well.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'r7',
      title: 'Children\'s Book Author Meet-Up',
      description: 'Connect with fellow children\'s book authors and illustrators to share ideas, discuss publishing experiences, and potentially collaborate on future projects.',
      datetime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      location: 'Green Apple Books, Richmond District',
      maxParticipants: 15,
      currentParticipants: 8,
      vibes: ['Creative', 'Networking', 'Supportive', 'Reading'],
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '150',
      hostId: 'r7h',
      participantIds: ['r7p1', 'r7p2', 'r7p3'],
      host: { 
        id: 'r7h', 
        name: 'Elena', 
        username: 'elena_illustrates',
        email: 'elena@example.com', 
        age: 36,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        unalonScore: 94,
        interests: ['illustration', 'children\'s literature', 'publishing'],
        favoriteQuote: 'The best children\'s books live in the hearts of adults.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    
    // Coffee Category Events
    {
      id: '6',
      title: 'Coffee & Code: JavaScript Workshop',
      description: 'A relaxed morning session where we\'ll dive deep into modern JavaScript concepts. Perfect for developers looking to sharpen their skills while enjoying great coffee. We\'ll cover ES6+, async/await, and practical examples.',
      datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      location: '456 Coffee Ave, Downtown',
      maxParticipants: 15,
      currentParticipants: 12,
      vibes: ['Relaxed', 'Learning', 'Coffee', 'Tech'],
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '120',
      hostId: '6',
      participantIds: ['6', '12', '13'],
      host: { 
        id: '6', 
        name: 'Sarah', 
        username: 'sarah_dev',
        email: 'sarah@example.com', 
        age: 26,
        location: 'Oakland',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        unalonScore: 92,
        interests: ['JavaScript', 'web development', 'coffee'],
        favoriteQuote: 'Code is like humor. When you have to explain it, it\'s bad.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'c1',
      title: 'Coffee Tasting Experience',
      description: 'Sample a variety of single-origin coffees from around the world. Learn about different brewing methods and flavor profiles from expert baristas.',
      datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      location: 'Ritual Coffee Roasters, Valencia Street',
      maxParticipants: 12,
      currentParticipants: 8,
      vibes: ['Tasting', 'Educational', 'Relaxed', 'Coffee'],
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '90',
      hostId: 'c1h',
      participantIds: ['c1p1', 'c1p2', 'c1p3'],
      host: { 
        id: 'c1h', 
        name: 'Miguel', 
        username: 'miguel_barista',
        email: 'miguel@example.com', 
        age: 30,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        unalonScore: 96,
        interests: ['coffee', 'brewing', 'roasting'],
        favoriteQuote: 'Life begins after coffee.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'c2',
      title: 'Latte Art Workshop',
      description: 'Learn the basics of creating beautiful latte art. This hands-on workshop will teach you techniques for hearts, rosettas, and more complex designs.',
      datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: 'Four Barrel Coffee, Mission District',
      maxParticipants: 8,
      currentParticipants: 5,
      vibes: ['Creative', 'Hands-on', 'Skill-building', 'Coffee'],
      image: 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '120',
      hostId: 'c2h',
      participantIds: ['c2p1', 'c2p2', 'c2p3'],
      host: { 
        id: 'c2h', 
        name: 'Sophia', 
        username: 'sophia_latte',
        email: 'sophia@example.com', 
        age: 28,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        unalonScore: 94,
        interests: ['latte art', 'espresso', 'coffee'],
        favoriteQuote: 'Coffee is my love language.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'c3',
      title: 'Coffee & Book Club',
      description: 'A relaxed book discussion group that meets in a cozy cafe. This month we\'re reading "The Dutch House" by Ann Patchett.',
      datetime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      location: 'Sightglass Coffee, SOMA',
      maxParticipants: 15,
      currentParticipants: 9,
      vibes: ['Literary', 'Discussion', 'Cozy', 'Coffee', 'Reading'],
      image: 'https://images.unsplash.com/photo-1529148482759-b35b25c5f217?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '150',
      hostId: 'c3h',
      participantIds: ['c3p1', 'c3p2', 'c3p3'],
      host: { 
        id: 'c3h', 
        name: 'Daniel', 
        username: 'daniel_reads',
        email: 'daniel@example.com', 
        age: 26,
        location: 'Oakland',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        unalonScore: 92,
        interests: ['JavaScript', 'web development', 'coffee'],
        favoriteQuote: 'Code is like humor. When you have to explain it, it\'s bad.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'c4',
      title: 'Home Coffee Roasting Workshop',
      description: 'Learn how to roast your own coffee beans at home using simple equipment. We\'ll cover different roasting levels, cooling techniques, and how to store your freshly roasted beans.',
      datetime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      location: 'Andytown Coffee Roasters, Outer Sunset',
      maxParticipants: 10,
      currentParticipants: 6,
      vibes: ['DIY', 'Educational', 'Artisanal', 'Coffee'],
      image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '180',
      hostId: 'c4h',
      participantIds: ['c4p1', 'c4p2', 'c4p3'],
      host: { 
        id: 'c4h', 
        name: 'Raj', 
        username: 'raj_roasts',
        email: 'raj@example.com', 
        age: 35,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        unalonScore: 93,
        interests: ['coffee roasting', 'specialty coffee', 'sustainability'],
        favoriteQuote: 'Life is too short for bad coffee.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: 'c5',
      title: 'Coffee Shop Entrepreneurs Meetup',
      description: 'A networking event for current and aspiring coffee shop owners. Share experiences, discuss business challenges, and learn from industry veterans.',
      datetime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      location: 'Equator Coffees, Fort Mason',
      maxParticipants: 20,
      currentParticipants: 14,
      vibes: ['Networking', 'Business', 'Entrepreneurial', 'Coffee'],
      image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '150',
      hostId: 'c5h',
      participantIds: ['c5p1', 'c5p2', 'c5p3'],
      host: { 
        id: 'c5h', 
        name: 'Amara', 
        username: 'amara_cafe',
        email: 'amara@example.com', 
        age: 38,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        unalonScore: 97,
        interests: ['cafe management', 'coffee industry', 'small business'],
        favoriteQuote: 'Behind every successful person is a substantial amount of coffee.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: '7',
      title: 'Yoga & Meditation Session',
      description: 'Start your day with a peaceful yoga and meditation session. All levels welcome, from beginners to advanced practitioners. We\'ll focus on mindfulness and inner peace.',
      datetime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      location: 'Zen Garden Studio',
      maxParticipants: 20,
      currentParticipants: 15,
      vibes: ['Peaceful', 'Wellness', 'Mindful'],
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '90',
      hostId: '7',
      participantIds: ['7', '14', '15'],
      host: { 
        id: '7', 
        name: 'Maya', 
        username: 'maya_yoga',
        email: 'maya@example.com', 
        age: 30,
        location: 'Berkeley',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        unalonScore: 89,
        interests: ['yoga', 'meditation', 'wellness'],
        favoriteQuote: 'Peace comes from within. Do not seek it without.',
        createdAt: new Date() 
      },
      userRequested: false
    },
    {
      id: '8',
      title: 'Photography Walk: Golden Gate Bridge',
      description: 'Join us for a photography walk around the iconic Golden Gate Bridge. Capture stunning shots and learn photography techniques from experienced photographers.',
      datetime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      location: 'Golden Gate Bridge',
      maxParticipants: 12,
      currentParticipants: 9,
      vibes: ['Creative', 'Outdoor', 'Photography'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&h=400',
      createdAt: new Date(),
      duration: '150',
      hostId: '8',
      participantIds: ['8', '16', '17'],
      host: { 
        id: '8', 
        name: 'Alex', 
        username: 'alex_photo',
        email: 'alex@example.com', 
        age: 27,
        location: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        unalonScore: 91,
        interests: ['photography', 'travel', 'art'],
        favoriteQuote: 'Photography is the art of making memories tangible.',
        createdAt: new Date() 
      },
      userRequested: false
    }
  ];

  // Always use API activities to ensure consistency with event details page
  const displayActivities = apiActivities;
  
  // Log all activities with their vibes for debugging
  console.log('All available activities:');
  sampleActivities.forEach(activity => {
    console.log(`Activity: ${activity.title}, Vibes:`, activity.vibes);
  });
  
  // Debug log for reading and music activities
  console.log('Reading activities:');
  const readingActivities = sampleActivities.filter(activity => {
    if (activity.vibes && activity.vibes.length > 0) {
      return activity.vibes.some(vibe => {
        const vibeText = vibe.toLowerCase();
        return vibeText === 'reading' || 
               vibe === 'Reading' || 
               vibeText.includes('reading') || 
               vibeText.includes('book') || 
               vibeText.includes('literary') || 
               vibeText.includes('poetry') || 
               vibeText.includes('novel');
      });
    }
    return false;
  });
  readingActivities.forEach(activity => {
    console.log(`Reading Activity: ${activity.title}, Vibes:`, activity.vibes);
  });
  
  console.log('Music activities:');
  const musicActivities = sampleActivities.filter(activity => {
    if (activity.vibes && activity.vibes.length > 0) {
      return activity.vibes.some(vibe => {
        const vibeText = vibe.toLowerCase();
        return vibeText === 'music' || 
               vibe === 'Music' || 
               vibeText.includes('music') || 
               vibeText.includes('jazz') || 
               vibeText.includes('band') || 
               vibeText.includes('guitar') ||
               vibeText.includes('song') ||
               vibeText.includes('hip-hop') ||
               vibeText.includes('karaoke');
      });
    }
    return false;
  });
  musicActivities.forEach(activity => {
    console.log(`Music Activity: ${activity.title}, Vibes:`, activity.vibes);
  });

  // Sample attendees data for demonstration
  const sampleAttendees = [
    { id: '1', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: '2', name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
    { id: '3', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    { id: '4', name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
  ];

  // Filter and sort activities
  const filteredAndSortedActivities = displayActivities
    .filter(activity => {
      // Search filter
      if (searchQuery) {
        const searchText = searchQuery.toLowerCase();
        const activityText = `${activity.title} ${activity.description} ${activity.location}`.toLowerCase();
        if (!activityText.includes(searchText)) {
          return false;
        }
      }

      // Hobby filter
      if (selectedHobby) {
        console.log('Filtering for hobby:', selectedHobby);
        console.log('Activity:', activity.title, 'Vibes:', activity.vibes);
        
        const hobbyKeywords = {
          reading: ['book', 'reading', 'study', 'library', 'cafe', 'literary', 'poetry', 'novel', 'literature'],
          studying: ['study', 'academic', 'library', 'cafe', 'coffee'],
          coffee: ['coffee', 'cafe', 'roastery', 'espresso'],
          sports: ['sport', 'fitness', 'gym', 'running', 'basketball'],
          hiking: ['hiking', 'adventure', 'outdoor', 'trail', 'mountain'],
          photography: ['photography', 'photo', 'camera', 'picture', 'image'],
          music: ['music', 'concert', 'band', 'guitar', 'piano', 'jazz', 'karaoke', 'song', 'singing'],
          art: ['art', 'painting', 'gallery', 'museum', 'creative'],
          food: ['food', 'restaurant', 'cooking', 'dining', 'lunch'],
          travel: ['travel', 'explore', 'trip', 'journey']
        };
        
        const keywords = hobbyKeywords[selectedHobby] || [];
        const activityText = `${activity.title} ${activity.description}`.toLowerCase();
        
        // Check if the activity has the selected hobby in its vibes array
        let hasHobbyVibe = false;
        
        if (activity.vibes && activity.vibes.length > 0) {
          // For Hiking and Photography, we need to be more inclusive with the matching
          if (selectedHobby === 'hiking') {
            hasHobbyVibe = activity.vibes.some(vibe => {
              const vibeText = vibe.toLowerCase();
              return vibeText === 'hiking' || 
                     vibe === 'Hiking' || 
                     vibeText.includes('hiking') || 
                     vibeText.includes('outdoor') || 
                     vibeText.includes('trail') || 
                     vibeText.includes('nature') || 
                     vibeText.includes('adventure');
            });
            if (hasHobbyVibe) {
              console.log('Hiking match found for', activity.title, 'with vibes', activity.vibes);
            }
          } else if (selectedHobby === 'photography') {
            hasHobbyVibe = activity.vibes.some(vibe => {
              const vibeText = vibe.toLowerCase();
              return vibeText === 'photography' || 
                     vibe === 'Photography' || 
                     vibeText.includes('photography') || 
                     vibeText.includes('photo') || 
                     vibeText.includes('camera') || 
                     vibeText.includes('creative') ||
                     vibeText.includes('visual') ||
                     vibeText.includes('artistic');
            });
            if (hasHobbyVibe) {
              console.log('Photography match found for', activity.title, 'with vibes', activity.vibes);
            }
          } else if (selectedHobby === 'coffee') {
            hasHobbyVibe = activity.vibes.some(vibe => {
              const vibeText = vibe.toLowerCase();
              return vibeText === 'coffee' || 
                     vibe === 'Coffee' || 
                     vibeText.includes('coffee') || 
                     vibeText.includes('cafe');
            });
            if (hasHobbyVibe) {
              console.log('Coffee match found for', activity.title, 'with vibes', activity.vibes);
            }
          } else {
            // For other hobbies, use the original logic
            for (const vibe of activity.vibes) {
              const vibeText = vibe.toLowerCase();
              const selectedHobbyLower = selectedHobby.toLowerCase();
              
              // Direct match with hobby name
              if (vibeText === selectedHobbyLower || vibeText.includes(selectedHobbyLower)) {
                console.log('Direct match found for', activity.title, 'with vibe', vibe);
                hasHobbyVibe = true;
                break;
              }
            }
          }
        }
        
        // Check if any keyword matches
        const keywordMatch = keywords.some((keyword: string) => activityText.includes(keyword));
        if (keywordMatch) {
          console.log('Keyword match found for', activity.title);
        }
        
        // Return true if either the activity text contains a keyword or the vibes include the hobby
        return keywordMatch || hasHobbyVibe;
      }

      // Time filter
      if (filterOption === 'today') {
        const today = new Date();
        const activityDate = new Date(activity.datetime);
        return activityDate.toDateString() === today.toDateString();
      }
      if (filterOption === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const activityDate = new Date(activity.datetime);
        return activityDate.toDateString() === tomorrow.toDateString();
      }
      if (filterOption === 'week') {
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        const activityDate = new Date(activity.datetime);
        return activityDate <= weekFromNow;
      }

      // Location filter
      if (locationFilter && !activity.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
        case 'popularity':
          return (b.currentParticipants || 0) - (a.currentParticipants || 0);
        case 'spots':
          return (a.maxParticipants - (a.currentParticipants || 0)) - (b.maxParticipants - (b.currentParticipants || 0));
        default:
          return 0;
      }
    });

  const handleFilterClick = (filterType: FilterType) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const handleHobbyClick = (hobby: HobbyType) => {
    const newHobby = selectedHobby === hobby ? null : hobby;
    console.log('Selected hobby:', newHobby);
    console.log('All activities count:', sampleActivities.length);
    
    // Log all activities with their vibes for debugging
    console.log('All activities with vibes:');
    sampleActivities.forEach(activity => {
      console.log(`Activity: ${activity.title}, Vibes:`, activity.vibes);
    });
    
    // Check which activities match the selected hobby
    const matchingActivities = sampleActivities.filter(activity => {
      if (!newHobby) return true;
      
      const hobbyKeywords = {
        hiking: ['hiking', 'trail', 'mountain', 'nature', 'outdoor', 'walk', 'adventure', 'trekking', 'wilderness'],
        studying: ['study', 'academic', 'library', 'cafe', 'coffee'],
        coffee: ['coffee', 'cafe', 'roastery', 'espresso'],
        sports: ['sport', 'fitness', 'gym', 'running', 'basketball'],
        photography: ['photography', 'photo', 'camera', 'picture', 'image', 'visual', 'portrait', 'landscape'],
        art: ['art', 'painting', 'gallery', 'museum', 'creative'],
        food: ['food', 'restaurant', 'cooking', 'dining', 'lunch'],
        travel: ['travel', 'adventure', 'explore', 'trip']
      };
      
      const keywords = hobbyKeywords[newHobby];
      const activityText = `${activity.title} ${activity.description}`.toLowerCase();
      
      // Check if the activity has the selected hobby in its vibes array
      let hasHobbyVibe = false;
      
      if (activity.vibes && activity.vibes.length > 0) {
        console.log(`Checking vibes for ${activity.title}:`, activity.vibes);
        
        // For Hiking and Photography, we need to be more inclusive with the matching
        if (newHobby === 'hiking') {
          hasHobbyVibe = activity.vibes.some(vibe => {
            const vibeText = vibe.toLowerCase();
            return vibeText === 'hiking' || 
                   vibe === 'Hiking' || 
                   vibeText.includes('hiking') || 
                   vibeText.includes('outdoor') || 
                   vibeText.includes('trail') || 
                   vibeText.includes('nature') || 
                   vibeText.includes('adventure');
          });
          if (hasHobbyVibe) {
            console.log(`Hiking match found for ${activity.title} with vibes`, activity.vibes);
          }
        } else if (newHobby === 'photography') {
          hasHobbyVibe = activity.vibes.some(vibe => {
            const vibeText = vibe.toLowerCase();
            return vibeText === 'photography' || 
                   vibe === 'Photography' || 
                   vibeText.includes('photography') || 
                   vibeText.includes('photo') || 
                   vibeText.includes('camera') || 
                   vibeText.includes('creative') ||
                   vibeText.includes('visual') ||
                   vibeText.includes('artistic');
          });
          if (hasHobbyVibe) {
            console.log(`Photography match found for ${activity.title} with vibes`, activity.vibes);
          }
        } else if (newHobby === 'coffee') {
          hasHobbyVibe = activity.vibes.some(vibe => {
            const vibeText = vibe.toLowerCase();
            return vibeText === 'coffee' || vibe === 'Coffee' || vibeText.includes('coffee') || vibeText.includes('cafe');
          });
          if (hasHobbyVibe) {
            console.log(`Coffee match found for ${activity.title} with vibes`, activity.vibes);
          }
        } else {
          // For other hobbies, use the original logic
          for (const vibe of activity.vibes) {
            const vibeText = vibe.toLowerCase();
            const selectedHobbyLower = newHobby.toLowerCase();
            
            console.log(`Comparing vibe '${vibe}' with hobby '${newHobby}'`);
            
            // Direct match with hobby name
            if (vibeText === selectedHobbyLower || vibeText.includes(selectedHobbyLower)) {
              console.log(`Direct match found for ${activity.title} with vibe ${vibe}`);
              hasHobbyVibe = true;
              break;
            }
          }
        }
      }
      
      // Check if any keyword matches
      const keywordMatch = keywords.some(keyword => activityText.includes(keyword));
      if (keywordMatch) {
        console.log(`Keyword match found for ${activity.title}`);
      }
      
      // Return true if either the activity text contains a keyword or the vibes include the hobby
      return keywordMatch || hasHobbyVibe;
    });
    
    console.log('Matching activities count:', matchingActivities.length);
    console.log('Matching activities:', matchingActivities.map(a => a.title));
    
    setSelectedHobby(newHobby);
    setActiveFilter(null);
  };

  const handleFilterOptionClick = (option: FilterOption) => {
    setFilterOption(filterOption === option ? null : option);
    setActiveFilter(null);
  };

  const clearFilters = () => {
    setSelectedHobby(null);
    setFilterOption(null);
    setDistanceFilter('');
    setLocationFilter('');
    setActiveFilter(null);
  };

  const requestToJoinMutation = useMutation({
    mutationFn: async (activityId: string) => {
      const response = await apiRequest('POST', `/api/activities/${activityId}/request`);
      return await response.json();
    },
    onSuccess: (data, activityId) => {
      // Mark this activity as requested in localStorage and local state
      addRequestedActivity(activityId);
      setRequestedActivities(getRequestedActivities());
      // Invalidate activities cache to refresh request status
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({ title: "Request sent!", description: "The host will review your request." });
    },
    onError: (error: any, activityId) => {
      const errorMessage = error.message || "Could not send request";
      
      // If already participating, still mark as "requested" in UI
      if (errorMessage.toLowerCase().includes("already participating") || 
          errorMessage.toLowerCase().includes("already")) {
        addRequestedActivity(activityId);
        setRequestedActivities(getRequestedActivities());
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

  const handleRequestToJoin = (activityId: string) => {
    // Check if already requested
    if (checkActivityRequested(activityId)) {
      return;
    }
    requestToJoinMutation.mutate(activityId);
  };

  // Helper function to check if an activity has been requested
  const isActivityRequested = (activity: ActivityWithHost) => {
    return activity.userRequested || checkActivityRequested(activity.id);
  };

  const handleHostClick = (host: User) => {
    toast({ 
      title: `${host.name}'s Profile`, 
      description: `Email: ${host.email}\nMember since: ${host.createdAt ? new Date(host.createdAt).toLocaleDateString() : 'Unknown'}` 
    });
  };

  const handleAttendeesClick = (activityId: string) => {
    setShowAttendeesDropdown(showAttendeesDropdown === activityId ? null : activityId);
  };

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
    } else {
      dayLabel = date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    const timeLabel = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    return `${dayLabel}, ${timeLabel}`;
  };

  if (isLoading) {
    return (
      <div className="p-4 overflow-y-auto bg-unalon-50">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-unalon-200 animate-pulse shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-6 bg-unalon-200 rounded mb-2"></div>
                  <div className="h-4 bg-unalon-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-unalon-200 rounded w-1/2"></div>
                </div>
                <div className="w-24 h-24 bg-unalon-200 rounded-xl ml-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Log filtered activities for debugging
  console.log('Rendering with filtered activities:', filteredAndSortedActivities);
  
  return (
    <div className="p-4 overflow-y-auto bg-unalon-50 min-h-screen">
      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => handleHobbyClick('hiking')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) border hover:scale-105 active:scale-95 ${
            selectedHobby === 'hiking' 
              ? 'bg-unalon-500 text-white border-unalon-500' 
              : 'bg-white text-unalon-700 border-unalon-300 hover:bg-unalon-100'
          }`}
        >
          🥾 Hiking
        </button>
        <button 
          onClick={() => handleHobbyClick('coffee')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) border hover:scale-105 active:scale-95 ${
            selectedHobby === 'coffee' 
              ? 'bg-unalon-500 text-white border-unalon-500' 
              : 'bg-white text-unalon-700 border-unalon-300 hover:bg-unalon-100'
          }`}
        >
          ☕ Coffee
        </button>
        <button 
          onClick={() => handleHobbyClick('photography')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) border hover:scale-105 active:scale-95 ${
            selectedHobby === 'photography' 
              ? 'bg-unalon-500 text-white border-unalon-500' 
              : 'bg-white text-unalon-700 border-unalon-300 hover:bg-unalon-100'
          }`}
        >
          📸 Photography
        </button>
        <button 
          onClick={() => handleFilterClick('filter')}
          className={`flex items-center space-x-1 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) border hover:scale-105 active:scale-95 ${
            activeFilter === 'filter' 
              ? 'bg-unalon-500 text-white border-unalon-500' 
              : 'bg-white text-unalon-700 border-unalon-300 hover:bg-unalon-100'
          }`}
        >
          <span className="material-icons text-sm">filter_list</span>
          <span className="font-medium">Filter by</span>
          <span className="material-icons text-sm">expand_more</span>
        </button>

        {(selectedHobby || filterOption || distanceFilter || locationFilter) && (
          <button 
            onClick={clearFilters}
            className="px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) border hover:scale-105 active:scale-95 bg-unalon-100 text-unalon-700 border-unalon-300 hover:bg-unalon-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Dropdowns */}
      {activeFilter === 'hobbies' && (
        <div className="mb-4 p-4 bg-white rounded-2xl shadow-lg border border-unalon-200">
          <div className="grid grid-cols-2 gap-2">
            {(['hiking', 'studying', 'coffee', 'sports', 'photography', 'art', 'food', 'travel'] as HobbyType[]).map((hobby) => (
              <button
                key={hobby}
                onClick={() => handleHobbyClick(hobby)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedHobby === hobby
                    ? 'bg-unalon-500 text-white'
                    : 'bg-unalon-50 text-unalon-700 hover:bg-unalon-100'
                }`}
              >
                {hobby.charAt(0).toUpperCase() + hobby.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

             {activeFilter === 'filter' && (
         <div className="mb-4 p-4 bg-white rounded-2xl shadow-lg border border-unalon-200">
           <div className="space-y-3">
             <div>
               <h3 className="text-sm font-medium text-unalon-700 mb-2">Time</h3>
               <div className="flex space-x-2">
                 {(['today', 'tomorrow', 'week'] as FilterOption[]).map((option) => (
                   <button
                     key={option}
                     onClick={() => handleFilterOptionClick(option)}
                     className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                       filterOption === option
                         ? 'bg-unalon-500 text-white'
                         : 'bg-unalon-50 text-unalon-700 hover:bg-unalon-100'
                     }`}
                   >
                     {option.charAt(0).toUpperCase() + option.slice(1)}
                   </button>
                 ))}
               </div>
             </div>
                         <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-unalon-700">Distance</h3>
                <span className="text-sm text-unalon-600">{distanceFilter || '10'}km</span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={distanceFilter || '10'}
                  onChange={(e) => setDistanceFilter(e.target.value)}
                  className="w-full h-2 bg-unalon-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-unalon-500">
                  <span>0km</span>
                  <span>50km</span>
                </div>
              </div>
            </div>
             <div>
               <h3 className="text-sm font-medium text-unalon-700 mb-2">Location</h3>
               <input
                 type="text"
                 placeholder="Enter location"
                 value={locationFilter}
                 onChange={(e) => setLocationFilter(e.target.value)}
                 className="w-full px-3 py-2 border border-unalon-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-unalon-400"
               />
             </div>
           </div>
         </div>
       )}



              {/* Activities List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-2xl p-6 border border-unalon-200 shadow-sm text-center">
              <h3 className="text-lg font-semibold text-unalon-700 mb-2">Loading activities...</h3>
              <p className="text-unalon-600">Finding amazing activities for you</p>
            </div>
          ) : filteredAndSortedActivities.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-unalon-200 shadow-sm text-center">
              <h3 className="text-lg font-semibold text-unalon-700 mb-2">No activities found</h3>
              <p className="text-unalon-600">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            filteredAndSortedActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="bg-white rounded-2xl p-4 border border-unalon-200 shadow-sm card-hover hover-lift transition-all duration-300 cursor-pointer"
              onClick={() => {
                // Pass event data through URL state
                const eventData = encodeURIComponent(JSON.stringify(activity));
                setLocation(`/event/${activity.id}?data=${eventData}`);
              }}
            >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-unalon-900 mb-2">{activity.title}</h2>
                <p className="text-unalon-600 mb-2">{activity.description}</p>
                <div className="flex items-center text-sm text-unalon-500">
                  <span className="material-icons text-sm mr-1">schedule</span>
                  {formatDateTime(activity.datetime)}
                </div>
                <div className="flex items-center text-sm text-unalon-500 mt-1">
                  <span className="material-icons text-sm mr-1">location_on</span>
                  {activity.location}
                </div>
                
                {/* Vibes */}
                {activity.vibes && activity.vibes.length > 0 && (
                  <div className="flex space-x-2 mt-3 overflow-x-auto scrollbar-hide">
                    {activity.vibes.map((vibe, index) => (
                      <span key={index} className="bg-unalon-100 text-unalon-600 text-sm px-3 py-1 rounded-full border border-unalon-200 whitespace-nowrap">
                        {vibe}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Location Image */}
              <div className="w-24 h-24 rounded-xl ml-4 flex-shrink-0 border border-unalon-200 overflow-hidden bg-unalon-100">
                <img 
                  alt={`${activity.title} location`}
                  className="w-full h-full object-cover"
                  src={activity.image || "https://images.unsplash.com/photo-1511920170104-daa98f68f26b?auto=format&fit=crop&w=400&h=400"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1511920170104-daa98f68f26b?auto=format&fit=crop&w=400&h=400";
                  }}
                />
              </div>
            </div>

            {/* Host and Attendees - Moved below description */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={activity.host?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                    alt={activity.host?.name || 'Host'}
                    className="w-12 h-12 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => activity.host && handleHostClick(activity.host)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-unalon-900 cursor-pointer hover:text-unalon-700 transition-colors duration-200" onClick={() => activity.host && handleHostClick(activity.host)}>
                    Hosted by {activity.host?.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-unalon-600">
                    {activity.maxParticipants - (activity.currentParticipants || 0)} spots open
                  </p>
                </div>
              </div>
              
              {/* Attendees */}
              <div className="relative">
                <div className="flex -space-x-2 cursor-pointer" onClick={() => handleAttendeesClick(activity.id)}>
                  {sampleAttendees.slice(0, 3).map((attendee, i) => (
                    <div key={attendee.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                      <img
                        src={attendee.avatar}
                        alt={attendee.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="w-full h-full bg-unalon-100 flex items-center justify-center text-unalon-600 text-xs font-medium hidden">
                        {attendee.name.charAt(0)}
                      </div>
                    </div>
                  ))}
                  {sampleAttendees.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-unalon-100 border-2 border-white flex items-center justify-center text-unalon-600 text-xs font-medium">
                      +{sampleAttendees.length - 3}
                    </div>
                  )}
                </div>
                
                {/* Attendees Dropdown */}
                {showAttendeesDropdown === activity.id && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-unalon-200 z-50">
                    <div className="p-3">
                      <h4 className="text-sm font-medium text-unalon-700 mb-2">Attendees</h4>
                      <div className="space-y-2">
                        {sampleAttendees.map((attendee) => (
                          <div key={attendee.id} className="flex items-center space-x-2">
                            <img
                              src={attendee.avatar}
                              alt={attendee.name}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="w-8 h-8 rounded-full bg-unalon-100 flex items-center justify-center text-unalon-600 text-xs font-medium hidden">
                              {attendee.name.charAt(0)}
                            </div>
                            <span className="text-sm text-unalon-700">{attendee.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRequestToJoin(activity.id);
              }}
              disabled={isActivityRequested(activity) || requestToJoinMutation.isPending}
              className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                isActivityRequested(activity)
                  ? 'bg-unalon-400 text-white cursor-not-allowed'
                  : 'bg-unalon-accent-500 text-white hover:bg-unalon-accent-600 active:scale-95'
              }`}
            >
              {requestToJoinMutation.isPending ? 'Sending...' : (isActivityRequested(activity) ? 'Requested' : 'Request to Join')}
            </button>
          </div>
        )))
      }
      </div>
    </div>
  );
}
