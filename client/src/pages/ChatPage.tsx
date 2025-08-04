import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/context/AuthContext';
import type { User, Message } from '@shared/schema';

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  text?: string;
  timestamp: Date;
  viewed: boolean;
}

interface FriendWithStory {
  id: string;
  name: string;
  avatar: string;
  hasStory: boolean;
  gender?: 'male' | 'female';
  stories?: Story[];
}

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Story viewer state
  const [selectedStory, setSelectedStory] = useState<FriendWithStory | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [friendsWithStoriesState, setFriendsWithStoriesState] = useState<FriendWithStory[]>([]);
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Initialize friendsWithStoriesState with mock data
  useEffect(() => {
    setFriendsWithStoriesState([
    {
      id: '1',
      name: 'Emma',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      hasStory: true,
      gender: 'female',
      stories: [
        {
          id: '1-1',
          userId: '1',
          userName: 'Emma',
          userAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
          imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
          text: 'Beautiful sunset today! 🌅',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          viewed: false
        },
        {
          id: '1-2',
          userId: '1',
          userName: 'Emma',
          userAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
          imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          viewed: false
        }
      ]
    },
    {
      id: '2',
      name: 'James',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      hasStory: true,
      gender: 'male',
      stories: [
        {
          id: '2-1',
          userId: '2',
          userName: 'James',
          userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
          text: 'Check out my new ride!',
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          viewed: false
        }
      ]
    },
    {
      id: '3',
      name: 'Sophia',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      hasStory: false,
      gender: 'female'
    },
    {
      id: '4',
      name: 'Michael',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      hasStory: true,
      gender: 'male',
      stories: [
        {
          id: '4-1',
          userId: '4',
          userName: 'Michael',
          userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206',
          timestamp: new Date(Date.now() - 1000 * 60 * 240),
          viewed: false
        },
        {
          id: '4-2',
          userId: '4',
          userName: 'Michael',
          userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          imageUrl: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7',
          text: 'Hiking trip with friends',
          timestamp: new Date(Date.now() - 1000 * 60 * 180),
          viewed: false
        },
        {
          id: '4-3',
          userId: '4',
          userName: 'Michael',
          userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          viewed: false
        }
      ]
    }
    ]);
  }, []);

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations'],
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['/api/messages', selectedUser?.id],
    enabled: !!selectedUser,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { receiverId: string; content: string }) => {
      const response = await apiRequest('POST', '/api/messages', data);
      return await response.json();
    },
    onSuccess: () => {
      setMessageInput('');
      queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
  });

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser) return;

    sendMessageMutation.mutate({
      receiverId: selectedUser.id,
      content: messageInput.trim(),
    });
  };

  const formatMessageTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  // Story handling functions
  const handleOpenStory = (friend: FriendWithStory) => {
    if (friend.hasStory && friend.stories && friend.stories.length > 0) {
      // Mark stories as viewed when opened
      const updatedFriend = {
        ...friend,
        stories: friend.stories.map(story => ({
          ...story,
          viewed: true
        }))
      };
      
      setSelectedStory(updatedFriend);
      setCurrentStoryIndex(0);
      setStoryProgress(0);
      
      // Update the friendsWithStoriesState array to reflect viewed status
      setFriendsWithStoriesState(prevState => 
        prevState.map(f => f.id === friend.id ? updatedFriend : f)
      );
    }
  };
  
  const handleCloseStory = () => {
    setSelectedStory(null);
    setCurrentStoryIndex(0);
    setStoryProgress(0);
  };
  
  const handleNextStory = () => {
    if (!selectedStory || !selectedStory.stories) return;
    
    if (currentStoryIndex < selectedStory.stories.length - 1) {
      // Move to next story of the same user
      setCurrentStoryIndex(currentStoryIndex + 1);
      setStoryProgress(0);
    } else {
      // Find the next friend with stories
      const currentFriendIndex = friendsWithStoriesState.findIndex(f => f.name === selectedStory.name);
      const nextFriendIndex = friendsWithStoriesState.findIndex((f, index) => 
        index > currentFriendIndex && f.hasStory && f.stories && f.stories.length > 0
      );
      
      if (nextFriendIndex !== -1) {
        setSelectedStory(friendsWithStoriesState[nextFriendIndex]);
        setCurrentStoryIndex(0);
        setStoryProgress(0);
      } else {
        // No more stories, close the viewer
        handleCloseStory();
      }
    }
  };
  
  const handlePrevStory = () => {
    if (!selectedStory) return;
    
    if (currentStoryIndex > 0) {
      // Move to previous story of the same user
      setCurrentStoryIndex(currentStoryIndex - 1);
      setStoryProgress(0);
    } else {
      // Find the previous friend with stories
      const currentFriendIndex = friendsWithStoriesState.findIndex(f => f.name === selectedStory.name);
      const prevFriendWithStories = [...friendsWithStoriesState]
        .slice(0, currentFriendIndex)
        .reverse()
        .find(f => f.hasStory && f.stories && f.stories.length > 0);
      
      if (prevFriendWithStories) {
        setSelectedStory(prevFriendWithStories);
        setCurrentStoryIndex(prevFriendWithStories.stories?.length ? prevFriendWithStories.stories.length - 1 : 0);
        setStoryProgress(0);
      }
    }
  };
  
  // Auto-advance story progress
  useEffect(() => {
    if (!selectedStory) return;
    
    const storyDuration = 5000; // 5 seconds per story
    const interval = 100; // Update progress every 100ms
    const steps = storyDuration / interval;
    
    const timer = setInterval(() => {
      setStoryProgress(prev => {
        const newProgress = prev + (1 / steps) * 100;
        if (newProgress >= 100) {
          handleNextStory();
          return 0;
        }
        return newProgress;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [selectedStory, currentStoryIndex]);

  if (selectedUser) {
    return (
      <div className="fixed inset-0 bg-white z-30">
        <div className="flex flex-col h-full max-w-md mx-auto">
          {/* Chat Header */}
          <div className="flex items-center p-4 border-b border-unalon-300 bg-unalon-100">
            <button onClick={() => setSelectedUser(null)} className="mr-4">
              <span className="material-icons text-unalon-700">arrow_back</span>
            </button>
            <img 
              alt={`${selectedUser.name} avatar`}
              className="w-10 h-10 rounded-full object-cover mr-3" 
              src={selectedUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400"}
            />
            <div>
              <h3 className="text-base font-semibold text-unalon-900">{selectedUser.name}</h3>
              <p className="text-xs text-unalon-700">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
              const isMe = message.senderId === currentUser?.id;
              return (
                <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isMe 
                      ? 'bg-black text-white' 
                      : 'bg-unalon-200 text-unalon-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp ? formatMessageTime(message.timestamp) : 'Just now'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-unalon-300 bg-unalon-100">
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 rounded-full px-4 py-2 bg-unalon-200 text-unalon-900 placeholder:text-unalon-400 focus:outline-none"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || sendMessageMutation.isPending}
                className="bg-black text-white rounded-full p-2 hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                <span className="material-icons text-sm">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 overflow-y-auto bg-unalon-100">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-unalon-50 rounded-2xl p-4 border border-unalon-300 animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-unalon-200 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-unalon-200 rounded mb-2"></div>
                  <div className="h-3 bg-unalon-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto bg-unalon-100">
      
      {/* Story Viewer Modal */}
       {selectedStory && (
         <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
           {/* Story Progress Bars */}
           <div className="absolute top-4 left-4 right-4 flex space-x-1">
             {selectedStory.stories?.map((_, index) => (
               <div key={index} className="h-1 bg-gray-600 flex-1 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-white" 
                   style={{
                     width: index === currentStoryIndex ? `${storyProgress}%` : 
                            index < currentStoryIndex ? '100%' : '0%'
                   }}
                 ></div>
               </div>
             ))}
           </div>
           
           {/* Story Header */}
           <div className="absolute top-8 left-4 right-4 flex items-center">
             <div className="flex items-center">
               <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                 <img 
                   src={selectedStory.avatar} 
                   alt={selectedStory.name} 
                   className="w-full h-full object-cover" 
                 />
               </div>
               <div>
                 <p className="text-white font-semibold">{selectedStory.name}</p>
                 <p className="text-gray-300 text-xs">
                   {selectedStory.stories && selectedStory.stories[currentStoryIndex]?.timestamp ? 
                     formatMessageTime(selectedStory.stories[currentStoryIndex].timestamp) : 
                     'Just now'}
                 </p>
               </div>
             </div>
             <button 
               onClick={handleCloseStory} 
               className="ml-auto text-white p-2"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
           </div>
           
           {/* Story Content */}
           <div className="relative w-full h-full max-w-md max-h-[80vh] flex items-center justify-center">
             {selectedStory.stories && selectedStory.stories[currentStoryIndex] && (
               <>
                 <img 
                   src={selectedStory.stories[currentStoryIndex].imageUrl} 
                   alt="Story" 
                   className="max-w-full max-h-full object-contain" 
                 />
                 {selectedStory.stories[currentStoryIndex].text && (
                   <p className="absolute bottom-20 left-4 right-4 text-white text-center text-lg font-medium p-4 bg-black bg-opacity-30 rounded">
                     {selectedStory.stories[currentStoryIndex].text}
                   </p>
                 )}
               </>
             )}
           </div>
           
           {/* Navigation Controls */}
           <div className="absolute inset-0 flex">
             <div className="w-1/3 h-full" onClick={handlePrevStory}></div>
             <div className="w-1/3 h-full"></div>
             <div className="w-1/3 h-full" onClick={handleNextStory}></div>
           </div>
         </div>
       )}
      
      {/* Stories Bar */}
      <div className="mb-6">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
          {/* Your Story */}
          <div className="flex flex-col items-center min-w-16">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-unalon-300 to-unalon-400 flex items-center justify-center border-2 border-unalon-300">
                <span className="material-icons text-white text-lg">add</span>
              </div>
            </div>
            <span className="text-xs text-unalon-600 mt-1 text-center">Your Story</span>
          </div>
          
          {/* Friend Stories */}
          {friendsWithStoriesState.map((friend) => (
            <div 
              key={friend.name} 
              className="flex flex-col items-center min-w-16 cursor-pointer" 
              onClick={() => handleOpenStory(friend)}
            >
              <div className="relative">
                <div className={`w-14 h-14 rounded-full ${friend.hasStory ? (friend.stories && friend.stories.some(s => !s.viewed) ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gray-300') : 'bg-gray-300'} p-0.5`}>
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <img 
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                {friend.hasStory && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
                       style={{ backgroundColor: friend.stories && friend.stories.some(s => !s.viewed) ? '#10b981' : '#9ca3af' }}>
                  </div>
                )}
              </div>
              <span className="text-xs text-unalon-600 mt-1 text-center truncate w-16">{friend.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {conversations.map((conversation) => (
          <div 
            key={conversation.user.id}
            onClick={() => setSelectedUser(conversation.user)}
            className="bg-unalon-50 rounded-2xl shadow-sm p-4 border border-unalon-300 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex items-center">
              <img 
                alt={`${conversation.user.name} profile`}
                className="w-12 h-12 rounded-full object-cover mr-3" 
                src={conversation.user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400"}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-semibold text-unalon-900">{conversation.user.name}</h3>
                  <span className="text-xs text-unalon-700">
                    {conversation.lastMessage.timestamp ? formatMessageTime(conversation.lastMessage.timestamp) : 'Just now'}
                  </span>
                </div>
                <p className="text-sm text-unalon-700 mt-1">{conversation.lastMessage.content}</p>
              </div>
              {conversation.unreadCount > 0 && (
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
              )}
            </div>
          </div>
        ))}

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-unalon-700 text-lg">No conversations yet</p>
            <p className="text-unalon-500 text-sm mt-1">Join activities to start chatting with other members!</p>
          </div>
        )}
      </div>
    </div>
  );
}
