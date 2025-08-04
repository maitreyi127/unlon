import { useLocation } from 'wouter';

interface BottomNavigationProps {
  onCreateClick?: () => void;
}

export default function BottomNavigation({ onCreateClick }: BottomNavigationProps = {}) {
  const [location, setLocation] = useLocation();

  const navigation = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/my-plans', icon: 'event_note', label: 'My Plans' },
    { path: '/create', icon: 'add_circle', label: 'Create' },
    { path: '/chat', icon: 'chat', label: 'Chat' },
    { path: '/activities', icon: 'attractions', label: 'Activities' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-unalon-200 z-10 shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navigation.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              if (item.path === '/create' && onCreateClick) {
                onCreateClick();
              } else {
                setLocation(item.path);
              }
            }}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) hover:-translate-y-1 shadow-sm hover:shadow-md ${
              location === item.path
                ? 'bg-unalon-500 text-white font-bold shadow-md transform scale-105'
                : 'text-unalon-600 hover:bg-unalon-100 hover:text-unalon-700 active:bg-unalon-200 active:scale-95'
            }`}
          >
            <span className="material-icons text-sm">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </footer>
  );
}
