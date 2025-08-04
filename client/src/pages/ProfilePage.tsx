import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged out successfully" });
    } catch (error) {
      toast({ 
        title: "Logout failed", 
        description: "Please try again",
        variant: "destructive" 
      });
    }
  };

  if (!user) return null;

  return (
    <div className="flex-grow overflow-y-auto pb-20 bg-white">
      {/* Settings Header */}
      <div className="flex items-center bg-white p-4 pb-2 justify-between">
        <div className="w-12"></div>
        <button
          onClick={handleLogout}
          className="flex w-12 items-center justify-end"
        >
          <div className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 bg-transparent text-black gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 hover:bg-black hover:text-white transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
            </svg>
          </div>
        </button>
      </div>

      {/* Profile header */}
      <section className="flex p-4">
        <div className="flex w-full flex-col gap-4 items-center">
          <div className="flex gap-4 flex-col items-center">
            {/* Profile avatar */}
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 shadow-md"
              style={{
                backgroundImage: `url("${user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400'}")`,
              }}
            ></div>
            {/* User info */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-black text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
                {user.name}
              </p>
              <p className="text-black text-base font-normal leading-normal text-center">
                {user.age ? `${user.age}, ` : ''}{user.location || 'Location not set'}
              </p>
              {/* Unalon Score */}
              <div className="mt-2 px-4 py-1 bg-black text-white rounded-full shadow-md flex items-center gap-1">
                <span className="material-icons text-sm">star</span>
                <span className="text-sm font-semibold">Unalon Score: {user.unalonScore || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interests section */}
      <section className="px-4 pb-4">
        <h3 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">
          Interests
        </h3>
        <div className="flex gap-3 flex-wrap">
          {user.interests && user.interests.length > 0 ? (
            user.interests.map((interest, index) => (
              <div
                key={index}
                className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white px-4 text-black hover:bg-black hover:text-white transition-colors duration-200 active:scale-95 shadow-sm border border-unalon-300"
              >
                <p className="text-sm font-medium leading-normal">{interest}</p>
              </div>
            ))
          ) : (
            <p className="text-unalon-500 text-sm">No interests added yet</p>
          )}
          {/* Add button */}
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white px-4 text-black font-bold hover:bg-black hover:text-white transition-colors duration-200 active:scale-95 shadow-sm border border-unalon-300">
            <span className="material-icons text-sm">add</span>
            <p className="text-sm font-medium leading-normal">Add</p>
          </button>
        </div>
      </section>

      {/* Favorite Quote section */}
      <section className="px-4 pb-4">
        <h3 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">
          Favorite Quote
        </h3>
        <p className="text-black text-base font-normal leading-normal pt-1">
          {user.favoriteQuote || '"Add your favorite quote to inspire others!"'}
        </p>
      </section>

      {/* Linked Playlists section */}
      <section className="pb-4">
        <h3 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Linked Playlists
        </h3>
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex items-stretch p-4 gap-3">
            {/* Sample playlists */}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40 bg-white p-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-unalon-300">
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&h=400")',
                }}
              ></div>
              <p className="text-black text-base font-medium leading-normal">Chill Vibes</p>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40 bg-white p-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-unalon-300">
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&h=400")',
                }}
              ></div>
              <p className="text-black text-base font-medium leading-normal">Road Trip</p>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40 bg-white p-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-unalon-300">
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=400")',
                }}
              ></div>
              <p className="text-black text-base font-medium leading-normal">Workout Mix</p>
            </div>
            {/* Add playlist button */}
            <button className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40 items-center justify-center bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg border border-unalon-300">
              <span className="material-icons text-2xl">add</span>
              <p className="text-base font-medium leading-normal">Add Playlist</p>
            </button>
          </div>
        </div>
      </section>

      {/* Favorite Places section */}
      <section className="px-4 pb-4">
        <h3 className="text-black text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">
          Favorite Places
        </h3>
        
        {/* Sample favorite places */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-unalon-300">
            <div
              className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg h-14 w-fit"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&h=300")',
              }}
            ></div>
            <div className="flex flex-col justify-center">
              <p className="text-black text-base font-medium leading-normal line-clamp-1">
                The Daily Grind
              </p>
              <p className="text-black text-sm font-normal leading-normal line-clamp-2">
                Coffee Shop
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-unalon-300">
            <div
              className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg h-14 w-fit"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&h=300")',
              }}
            ></div>
            <div className="flex flex-col justify-center">
              <p className="text-black text-base font-medium leading-normal line-clamp-1">
                Golden Gate Park
              </p>
              <p className="text-black text-sm font-normal leading-normal line-clamp-2">Park</p>
            </div>
          </div>

          {/* Add place button */}
          <button className="flex items-center justify-center gap-4 bg-white px-4 py-3 rounded-lg w-full text-black hover:bg-black hover:text-white transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg border border-unalon-300">
            <span className="material-icons">add</span>
            <p className="text-base font-medium leading-normal">Add Favorite Place</p>
          </button>
        </div>
      </section>
    </div>
  );
}
