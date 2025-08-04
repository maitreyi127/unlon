import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface Activity {
  id: string;
  title: string;
  category: 'show' | 'movie' | 'dining' | 'store' | 'cafe' | 'activities';
  image: string;
  rating?: number;
  price: string;
  location: string;
  description?: string;
  discount?: string;
  date?: string;
  time?: string;
  isAd?: boolean;
}

export default function ActivitiesPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'filter' | null>(null);
  const [filterOption, setFilterOption] = useState<'today' | 'tomorrow' | 'under-10km' | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<string>('10');
  const [bookedActivities, setBookedActivities] = useState<Set<string>>(new Set());
  const [favoritedActivities, setFavoritedActivities] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', label: 'FOR YOU', icon: 'auto_awesome' },
    { id: 'show', label: 'SHOWS', icon: 'theater_comedy' },
    { id: 'movie', label: 'MOVIES', icon: 'movie' },
    { id: 'dining', label: 'DINING', icon: 'restaurant' },
    { id: 'cafe', label: 'CAFES', icon: 'local_cafe' },
    { id: 'store', label: 'STORES', icon: 'shopping_bag' },
    { id: 'activities', label: 'ACTIVITIES', icon: 'attractions' },
  ];

  const activities: Activity[] = [
    // Shows & Events (8 events)
    {
      id: '1',
      title: 'Comedy Night with Local Stars',
      category: 'show',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.5,
      price: '$25 onwards',
      location: 'Laugh Factory, Downtown',
      date: 'Today',
      time: '8:30 PM',
      discount: 'Flat 20% OFF'
    },
    {
      id: '2',
      title: 'Live Music Jam Session',
      category: 'show',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.3,
      price: '$15 onwards',
      location: 'The Blue Note, Westside',
      date: 'Tomorrow',
      time: '9:00 PM',
      discount: 'Flat 15% OFF'
    },
    {
      id: '3',
      title: 'Stand-up Comedy Open Mic',
      category: 'show',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.1,
      price: '$10 onwards',
      location: 'Comedy Cellar, Midtown',
      date: 'Friday',
      time: '7:00 PM',
      discount: 'Student Discount'
    },
    {
      id: '4',
      title: 'Jazz Night at Blue Moon',
      category: 'show',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.6,
      price: '$20 onwards',
      location: 'Blue Moon Lounge, Harbor',
      date: 'Saturday',
      time: '10:00 PM',
      discount: 'Early Bird Special'
    },
    {
      id: '5',
      title: 'Poetry Slam Night',
      category: 'show',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.2,
      price: '$8 onwards',
      location: 'Word Cafe, University District',
      date: 'Sunday',
      time: '6:00 PM',
      discount: 'Open Mic Free'
    },
    {
      id: '6',
      title: 'Rock Band Live Performance',
      category: 'show',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.7,
      price: '$30 onwards',
      location: 'The Rock Arena, Downtown',
      date: 'Next Friday',
      time: '9:30 PM',
      discount: 'VIP Package Available'
    },
    {
      id: '7',
      title: 'Classical Music Concert',
      category: 'show',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.8,
      price: '$45 onwards',
      location: 'Symphony Hall, Cultural District',
      date: 'Next Saturday',
      time: '7:30 PM',
      discount: 'Student Discount'
    },
    {
      id: '8',
      title: 'Magic Show & Illusions',
      category: 'show',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.4,
      price: '$35 onwards',
      location: 'Magic Theater, Entertainment District',
      date: 'Next Sunday',
      time: '8:00 PM',
      discount: 'Family Package'
    },
    // Movies (6 events)
    {
      id: '9',
      title: 'The Batman',
      category: 'movie',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.8,
      price: '$12 onwards',
      location: 'AMC Theater, Mall Plaza',
      date: 'Today',
      time: '7:00 PM',
      discount: 'Flat 25% OFF'
    },
    {
      id: '10',
      title: 'Spider-Man: No Way Home',
      category: 'movie',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.6,
      price: '$14 onwards',
      location: 'Regal Cinemas, Downtown',
      date: 'Tomorrow',
      time: '9:15 PM',
      discount: 'Flat 30% OFF'
    },
    {
      id: '11',
      title: 'Dune: Part Two',
      category: 'movie',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.7,
      price: '$13 onwards',
      location: 'Cinemark, Westside',
      date: 'Saturday',
      time: '6:30 PM',
      discount: 'Matinee Special'
    },
    {
      id: '12',
      title: 'Avengers: Endgame',
      category: 'movie',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.9,
      price: '$15 onwards',
      location: 'IMAX Theater, Mall Plaza',
      date: 'Sunday',
      time: '8:00 PM',
      discount: '3D Experience'
    },
    {
      id: '13',
      title: 'The Matrix Resurrections',
      category: 'movie',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.5,
      price: '$11 onwards',
      location: 'Cinemark, Downtown',
      date: 'Next Friday',
      time: '9:45 PM',
      discount: 'Late Night Special'
    },
    {
      id: '14',
      title: 'Black Panther: Wakanda Forever',
      category: 'movie',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.6,
      price: '$16 onwards',
      location: 'Regal Cinemas, Westside',
      date: 'Next Saturday',
      time: '7:15 PM',
      discount: 'Premium Seating'
    },
    // Restaurants (8 events)
    {
      id: '15',
      title: 'The Grand Bistro - Fine Dining',
      category: 'dining',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.3,
      price: '$80 for two',
      location: 'Downtown District',
      description: 'Elegant fine dining with international cuisine and sophisticated ambiance.',
      discount: 'Flat 15% OFF',
      isAd: true
    },
    {
      id: '16',
      title: 'Ocean View Seafood Grill',
      category: 'dining',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.7,
      price: '$120 for two',
      location: 'Harbor Front',
      description: 'Fresh seafood with stunning ocean views and romantic atmosphere.',
      discount: 'Flat 35% OFF',
      isAd: true
    },
    {
      id: '17',
      title: 'Urban Kitchen - Modern American',
      category: 'dining',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.4,
      price: '$60 for two',
      location: 'Midtown Square',
      description: 'Contemporary American cuisine with farm-to-table ingredients.',
      discount: 'Happy Hour Special'
    },
    {
      id: '18',
      title: 'Sakura Japanese Sushi Bar',
      category: 'dining',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.6,
      price: '$90 for two',
      location: 'Asian Quarter, Downtown',
      description: 'Authentic Japanese sushi and sashimi with traditional atmosphere.',
      discount: 'Lunch Special'
    },
    {
      id: '19',
      title: 'La Trattoria - Italian Cuisine',
      category: 'dining',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.5,
      price: '$70 for two',
      location: 'Little Italy, Midtown',
      description: 'Traditional Italian pasta and pizza in a cozy family atmosphere.',
      discount: 'Wine Pairing Special'
    },
    {
      id: '20',
      title: 'Spice Garden - Indian Restaurant',
      category: 'dining',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.2,
      price: '$50 for two',
      location: 'Cultural District',
      description: 'Authentic Indian cuisine with aromatic spices and traditional dishes.',
      discount: 'Thali Special'
    },
    {
      id: '21',
      title: 'Golden Dragon - Chinese Restaurant',
      category: 'dining',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.3,
      price: '$55 for two',
      location: 'Chinatown, Downtown',
      description: 'Classic Chinese dishes with dim sum and traditional favorites.',
      discount: 'Family Meal Deal'
    },
    {
      id: '22',
      title: 'Le Petit Bistro - French Cuisine',
      category: 'dining',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.8,
      price: '$150 for two',
      location: 'French Quarter, Harbor',
      description: 'Elegant French dining with wine cellar and romantic ambiance.',
      discount: 'Chef\'s Tasting Menu'
    },
    // Cafes (6 events)
    {
      id: '23',
      title: 'Artisan Coffee Roasters',
      category: 'cafe',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.4,
      price: '$25 for two',
      location: 'University District',
      description: 'Specialty coffee with artisanal pastries and cozy study atmosphere.',
      discount: 'Flat 10% OFF'
    },
    {
      id: '24',
      title: 'The Bookworm Cafe',
      category: 'cafe',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.2,
      price: '$20 for two',
      location: 'Library Quarter',
      description: 'Quiet cafe perfect for reading with great coffee and light snacks.',
      discount: 'Student Discount'
    },
    {
      id: '25',
      title: 'Sweet Dreams Bakery & Cafe',
      category: 'cafe',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.5,
      price: '$30 for two',
      location: 'Downtown Plaza',
      description: 'Fresh baked goods and specialty coffee in a charming atmosphere.',
      discount: 'Breakfast Special'
    },
    {
      id: '26',
      title: 'Zen Tea House',
      category: 'cafe',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.3,
      price: '$18 for two',
      location: 'Cultural District',
      description: 'Traditional tea ceremonies and Asian-inspired beverages.',
      discount: 'Tea Tasting Experience'
    },
    {
      id: '27',
      title: 'Urban Brew Coffee Co.',
      category: 'cafe',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.1,
      price: '$22 for two',
      location: 'Tech District',
      description: 'Modern coffee shop with workspace and tech-friendly environment.',
      discount: 'WiFi Included'
    },
    {
      id: '28',
      title: 'Sunset Beach Cafe',
      category: 'cafe',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.6,
      price: '$35 for two',
      location: 'Beach Front',
      description: 'Ocean view cafe with fresh seafood and tropical drinks.',
      discount: 'Sunset Special'
    },
    // Stores (8 events)
    {
      id: '29',
      title: 'Urban Outfitters - Summer Collection',
      category: 'store',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.2,
      price: 'Up to 60% OFF',
      location: 'Fashion District',
      description: 'Latest summer trends with casual and streetwear styles.',
      discount: 'Extra 12% OFF + food/movie vouchers',
      isAd: true
    },
    {
      id: '30',
      title: 'Tech Haven - Electronics Store',
      category: 'store',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.1,
      price: 'Up to 50% OFF',
      location: 'Tech Plaza',
      description: 'Latest gadgets and electronics with expert advice.',
      discount: 'Bank benefits + food/movie vouchers',
      isAd: true
    },
    {
      id: '31',
      title: 'Home & Garden Essentials',
      category: 'store',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.0,
      price: 'Up to 40% OFF',
      location: 'Shopping Center',
      description: 'Everything for your home and garden needs.',
      discount: 'Weekend Sale'
    },
    {
      id: '32',
      title: 'Sports Zone - Athletic Wear',
      category: 'store',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.3,
      price: 'Up to 45% OFF',
      location: 'Sports Complex',
      description: 'Professional athletic wear and sports equipment.',
      discount: 'Team Discount'
    },
    {
      id: '33',
      title: 'Beauty & Beyond - Cosmetics',
      category: 'store',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.4,
      price: 'Up to 55% OFF',
      location: 'Beauty District',
      description: 'Premium cosmetics and beauty products.',
      discount: 'Makeup Artist Consultation'
    },
    {
      id: '34',
      title: 'Book Nook - Independent Bookstore',
      category: 'store',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.5,
      price: 'Up to 30% OFF',
      location: 'University District',
      description: 'Curated books and literary events.',
      discount: 'Book Club Membership'
    },
    {
      id: '35',
      title: 'Artisan Crafts - Handmade Goods',
      category: 'store',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.2,
      price: 'Up to 35% OFF',
      location: 'Arts District',
      description: 'Unique handmade crafts and artisanal products.',
      discount: 'Workshop Classes'
    },
    {
      id: '36',
      title: 'Pet Paradise - Pet Supplies',
      category: 'store',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.1,
      price: 'Up to 25% OFF',
      location: 'Pet District',
      description: 'Premium pet food and accessories.',
      discount: 'Grooming Services'
    },
    // Activities (8 events)
    {
      id: '37',
      title: 'Adventure Park - Thrill Rides',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.6,
      price: '$45 onwards',
      location: 'Adventure Zone, Outskirts',
      date: 'Daily',
      time: '10 AM - 6 PM',
      discount: 'Flat 50% off'
    },
    {
      id: '38',
      title: 'Rock Climbing Center',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.4,
      price: '$25 onwards',
      location: 'Sports Complex',
      date: 'Daily',
      time: '9 AM - 8 PM',
      discount: 'Flat 40% off'
    },
    {
      id: '39',
      title: 'Escape Room Challenge',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.3,
      price: '$30 per person',
      location: 'Entertainment District',
      date: 'Daily',
      time: '11 AM - 10 PM',
      discount: 'Group Discount'
    },
    {
      id: '40',
      title: 'Paintball Arena',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.5,
      price: '$35 per person',
      location: 'Adventure Zone',
      date: 'Weekends',
      time: '9 AM - 5 PM',
      discount: 'Team Package'
    },
    {
      id: '41',
      title: 'Laser Tag Arena',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.2,
      price: '$20 per person',
      location: 'Entertainment District',
      date: 'Daily',
      time: '12 PM - 9 PM',
      discount: 'Birthday Package'
    },
    {
      id: '42',
      title: 'Mini Golf Course',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.1,
      price: '$15 per person',
      location: 'Family Fun Center',
      date: 'Daily',
      time: '10 AM - 8 PM',
      discount: 'Family Package'
    },
    {
      id: '43',
      title: 'Bowling Alley',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.4,
      price: '$18 per person',
      location: 'Entertainment District',
      date: 'Daily',
      time: '11 AM - 11 PM',
      discount: 'League Discount'
    },
    {
      id: '44',
      title: 'Trampoline Park',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=300&q=80',
      rating: 4.3,
      price: '$25 per person',
      location: 'Family Fun Center',
      date: 'Daily',
      time: '10 AM - 9 PM',
      discount: 'Kids Special'
    }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply filter logic
    let matchesFilters = true;
    
    if (filterOption === 'today') {
      matchesFilters = matchesFilters && (activity.date === 'Today');
    }
    if (filterOption === 'tomorrow') {
      matchesFilters = matchesFilters && (activity.date === 'Tomorrow');
    }
    if (filterOption === 'under-10km') {
      // Simulate distance filtering - in real app this would check actual distance
      matchesFilters = matchesFilters && (activity.location.includes('Downtown') || 
                                        activity.location.includes('Midtown') || 
                                        activity.location.includes('University District'));
    }
    
    return matchesCategory && matchesSearch && matchesFilters;
  });

  const handleFilterClick = (filterType: 'filter') => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const handleFilterOptionClick = (option: 'today' | 'tomorrow' | 'under-10km') => {
    setFilterOption(filterOption === option ? null : option);
  };

  const clearFilters = () => {
    setFilterOption(null);
    setDistanceFilter('10');
    setActiveFilter(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'show': return 'theater_comedy';
      case 'movie': return 'movie';
      case 'dining': return 'restaurant';
      case 'cafe': return 'local_cafe';
      case 'store': return 'shopping_bag';
      case 'activities': return 'attractions';
      default: return 'place';
    }
  };

  return (
    <div className="min-h-screen bg-unalon-100">




      {/* Category Navigation */}
      <div className="px-4 pb-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {/* Filter Icon Button - Left of FOR YOU */}
          <button
            onClick={() => handleFilterClick('filter')}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              activeFilter === 'filter'
                ? 'bg-unalon-900 text-white'
                : 'bg-unalon-200 text-unalon-700 hover:bg-unalon-300'
            }`}
          >
            <span className="material-icons text-sm">filter_list</span>
          </button>
          
          {/* FOR YOU Button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-unalon-900 text-white'
                : 'bg-unalon-200 text-unalon-700 hover:bg-unalon-300'
            }`}
          >
            <span className="material-icons text-sm">auto_awesome</span>
            <span className="text-sm font-medium">FOR YOU</span>
          </button>
          
          {/* Other Category Buttons */}
          {categories.slice(1).map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-unalon-900 text-white'
                  : 'bg-unalon-200 text-unalon-700 hover:bg-unalon-300'
              }`}
            >
              <span className="material-icons text-sm">{category.icon}</span>
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          ))}
        </div>
      </div>



      {/* Filter Dropdown */}
      {activeFilter === 'filter' && (
        <div className="mb-4 mx-4 p-4 bg-white rounded-2xl shadow-lg border border-unalon-200">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-unalon-700 mb-2">Time</h3>
              <div className="flex space-x-2">
                {(['today', 'tomorrow'] as const).map((option) => (
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
                <span className="text-sm text-unalon-600">{distanceFilter}km</span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={distanceFilter}
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
              <h3 className="text-sm font-medium text-unalon-700 mb-2">Quick Filters</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterOptionClick('under-10km')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    filterOption === 'under-10km'
                      ? 'bg-unalon-500 text-white'
                      : 'bg-unalon-50 text-unalon-700 hover:bg-unalon-100'
                  }`}
                >
                  Under 10km
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="px-4 pb-24">
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-unalon-200">
              {/* Image and Discount Banner */}
              <div className="relative">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&h=300&q=80';
                  }}
                />
                {activity.discount && (
                  <div className="absolute top-3 left-3 bg-unalon-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {activity.discount}
                  </div>
                )}
                {activity.isAd && (
                  <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    Ad
                  </div>
                )}

              </div>

              {/* Content */}
              <div className="p-4">
                {/* Date and Time for Shows/Movies/Activities */}
                {(activity.date || activity.time) && (
                  <div className="text-unalon-500 text-sm mb-2">
                    {activity.date} {activity.time && `• ${activity.time}`}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-bold text-unalon-900 mb-2">{activity.title}</h3>

                {/* Rating */}
                {activity.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="material-icons text-yellow-400 text-sm">star</span>
                    <span className="text-unalon-600 text-sm">{activity.rating}</span>
                  </div>
                )}

                {/* Location and Price */}
                <div className="flex items-center justify-between mb-2">
                  <div className="text-unalon-500 text-sm">
                    📍 {activity.location}
                  </div>
                  <span className="text-unalon-500 font-semibold">{activity.price}</span>
                </div>

                {/* Description */}
                {activity.description && (
                  <p className="text-unalon-600 text-sm leading-relaxed">
                    {activity.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => {
                      if (bookedActivities.has(activity.id)) {
                        setBookedActivities(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(activity.id);
                          return newSet;
                        });
                        toast({ 
                          title: "Booking cancelled!", 
                          description: `Booking for ${activity.title} has been cancelled.`
                        });
                      } else {
                        setBookedActivities(prev => new Set(prev).add(activity.id));
                        toast({ 
                          title: "Booking successful!", 
                          description: `You've successfully booked ${activity.title}. Check your email for confirmation.`
                        });
                      }
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors active:scale-95 ${
                      bookedActivities.has(activity.id)
                        ? 'bg-unalon-600 text-white'
                        : 'bg-unalon-500 text-white hover:bg-unalon-600'
                    }`}
                  >
                    {bookedActivities.has(activity.id) ? 'Booked' : 'Book Now'}
                  </button>
                  <button 
                    onClick={() => {
                      if (favoritedActivities.has(activity.id)) {
                        setFavoritedActivities(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(activity.id);
                          return newSet;
                        });
                        toast({ 
                          title: "Removed from favorites!", 
                          description: `${activity.title} has been removed from your favorites.`
                        });
                      } else {
                        setFavoritedActivities(prev => new Set(prev).add(activity.id));
                        toast({ 
                          title: "Added to favorites!", 
                          description: `${activity.title} has been added to your favorites.`
                        });
                      }
                    }}
                    className={`px-4 py-2 border rounded-lg transition-colors active:scale-95 ${
                      favoritedActivities.has(activity.id)
                        ? 'border-unalon-500 bg-unalon-500 text-white'
                        : 'border-unalon-300 text-unalon-600 hover:bg-unalon-100'
                    }`}
                  >
                    <span className="material-icons text-sm">
                      {favoritedActivities.has(activity.id) ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons text-unalon-400 text-4xl mb-4">search_off</span>
            <p className="text-unalon-400">No activities found</p>
          </div>
        )}
      </div>
    </div>
  );
} 