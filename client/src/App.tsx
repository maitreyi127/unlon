import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider, useSearch } from "@/context/SearchContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import BottomNavigation from "@/components/BottomNavigation";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import CreateShortsModal from "@/components/CreateShortsModal";
import HomePage from "@/pages/HomePage";
import MyPlansPage from "@/pages/MyPlansPage";
import CreatePage from "@/pages/CreatePage";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import EventDetailsPage from "@/pages/EventDetailsPage";
import ActivitiesPage from "@/pages/ActivitiesPage";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import { useLocation } from "wouter";

function Router() {
  const { searchQuery, setSearchQuery } = useSearch();
  const [showSearch, setShowSearch] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateShortsModal, setShowCreateShortsModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [location, setLocation] = useLocation();

  return (
    <ProtectedRoute>
      <div className="max-w-md mx-auto bg-unalon-100 relative min-h-screen flex flex-col">
        {/* Header */}
        <header className={`flex justify-between items-center p-4 border-b border-unalon-300 bg-unalon-100 fixed top-0 left-0 right-0 max-w-md mx-auto z-20 transition-all duration-500 ease-in-out ${
          showSearch ? 'bg-white/95 backdrop-blur-md shadow-lg' : ''
        }`}>
          <div className={`transition-all duration-500 ease-in-out ${
            showSearch ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
          }`}>
            <span className="font-black text-2xl text-unalon-900 unalon-logo">
              {location === '/my-plans' ? 'My Plans' : location === '/activities' ? 'Activities' : location === '/chat' ? 'Messages' : 'unalon'}
            </span>
          </div>
          
          {/* Search Input - Full width when active */}
          <div className={`absolute inset-0 px-4 transition-all duration-500 ease-in-out ${
            showSearch ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}>
            <div className="relative h-full flex items-center">
              <input
                type="text"
                placeholder="Search by name, interest, or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-unalon-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-unalon-400 bg-white/90 backdrop-blur-sm shadow-sm"
                autoFocus
              />
              <span className="material-icons absolute left-4 text-unalon-500 text-lg">
                search
              </span>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="absolute right-4 text-unalon-500 hover:text-unalon-700 transition-colors duration-200"
              >
                <span className="material-icons text-lg">close</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className={`text-unalon-700 hover:text-unalon-400 transition-all duration-300 ease-in-out active:scale-95 ${
                showSearch ? 'text-unalon-900' : ''
              }`}
            >
              <span className="material-icons">{showSearch ? 'close' : 'search'}</span>
            </button>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`text-unalon-700 hover:text-unalon-400 transition-all duration-300 ease-in-out active:scale-95 ${
                showSearch ? 'opacity-0 scale-95 pointer-events-none' : ''
              }`}
            >
              <span className="material-icons">notifications_none</span>
            </button>
            <button 
              onClick={() => setLocation('/profile')}
              className={`text-unalon-700 hover:text-unalon-400 transition-all duration-300 ease-in-out active:scale-95 ${
                showSearch ? 'opacity-0 scale-95 pointer-events-none' : ''
              }`}
            >
              <span className="material-icons">person</span>
            </button>
          </div>
        </header>



        {/* Main Content */}
        <main className="flex-grow pt-20 pb-20">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/my-plans" component={MyPlansPage} />
            <Route path="/create" component={HomePage} />
            <Route path="/chat" component={ChatPage} />
            <Route path="/activities" component={ActivitiesPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/event/:id" component={EventDetailsPage} />
            <Route component={NotFound} />
          </Switch>
        </main>

        {/* Create Activity Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
            <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <CreatePage onClose={() => setShowCreateModal(false)} />
            </div>
          </div>
        )}

        {/* Create Shorts Modal */}
        <CreateShortsModal
          isOpen={showCreateShortsModal}
          onClose={() => setShowCreateShortsModal(false)}
        />

        {/* Bottom Navigation */}
        <BottomNavigation onCreateClick={() => setShowCreateShortsModal(true)} />
        
        {/* Notifications Dropdown */}
        <NotificationsDropdown 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SearchProvider>
            <Toaster />
            <Router />
          </SearchProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
